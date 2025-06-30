"use client"
import React, { useState, useRef } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { User } from '@supabase/supabase-js'
import { Image, Video, AlertCircle } from 'lucide-react'
import { Button } from '../ui/button'
import ImagePreview from '../common/ImagePreview'
import VideoPreview from '../common/VideoPreview'
import { v4 as uuidv4 } from 'uuid'
import { createClient } from '@/lib/supabase/supabaseClient'
import Env from '@/Env'
import { toast } from 'react-toastify'

export default function AddPost({ user, children }: { user: User, children: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const [previewUrl, setPreviewUrl] = useState("")
    const [videoPreviewUrl, setVideoPreviewUrl] = useState("")
    const [image, setImage] = useState<File | null>(null)
    const [video, setVideo] = useState<File | null>(null)
    const [videoError, setVideoError] = useState<string | null>(null)
    const imageRef = useRef<HTMLInputElement | null>(null)
    const videoRef = useRef<HTMLInputElement | null>(null)
    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(false)
    const supabase = createClient(undefined)
    
    const handleImageIcon = () => {
        imageRef.current?.click()
    }

    const handleVideoIcon = () => {
        videoRef.current?.click()
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            // Clear video if exists
            if (video) {
                handleVideoRemove()
            }
            
            setImage(file)
            const imageUrl = URL.createObjectURL(file)
            setPreviewUrl(imageUrl)
        }
    }
    
    const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            // Clear image if exists
            if (image) {
                handleImageRemove()
            }
            
            // Check file size (50MB limit for better compression)
            if (file.size > 15 * 1024 * 1024) {
                setVideoError("Video file is too large. Maximum size is 50MB.")
                return
            }
            
            // Check video duration
            const video = document.createElement('video')
            video.preload = 'metadata'
            
            video.onloadedmetadata = () => {
                window.URL.revokeObjectURL(video.src)
                if (video.duration > 30) {
                    setVideoError("Video is too long. Maximum duration is 30 seconds.")
                    return
                }
                
                setVideo(file)
                const videoUrl = URL.createObjectURL(file)
                setVideoPreviewUrl(videoUrl)
                setVideoError(null)
            }
            
            video.onerror = () => {
                setVideoError("Invalid video format. Please use MP4, WebM, or MOV formats.")
            }
            
            video.src = URL.createObjectURL(file)
        }
    }

    const handleImageRemove = () => {
        setImage(null)
        if (imageRef.current) {
            imageRef.current.value = ""
        }
        setPreviewUrl("")
    }
    
    const handleVideoRemove = () => {
        setVideo(null)
        if (videoRef.current) {
            videoRef.current.value = ""
        }
        setVideoPreviewUrl("")
        setVideoError(null)
    }

    const addPost = async () => {
        setLoading(true);
        try {
            const payload: PostPayloadType = {
                content: content,
                user_id: user.id,
            };

            // Handle image upload if an image is provided
            if (image) {
                const path = `${user.id}/${uuidv4()}`;
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from(Env.S3_BUCKET)
                    .upload(path, image);

                if (uploadError) {
                    throw new Error("Error uploading image");
                }

                payload.image = uploadData.path;
            }
            
            // Handle video upload if a video is provided
            if (video) {
                const path = `videos/${user.id}/${uuidv4()}`;
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from(Env.S3_BUCKET)
                    .upload(path, video);

                if (uploadError) {
                    throw new Error("Error uploading video: " + uploadError.message);
                }

                payload.video = uploadData.path;
            }

            // Add post to the database
            const { data: postData, error: postError } = await supabase
                .from("posts")
                .insert([payload]);

            if (postError) {
                throw new Error("Error posting your Guilt");
            }

            // Reset state and show success message
            resetState();
            toast.success("Guilt posted successfully", { theme: "dark" });
            setOpen(false);
        } catch (error: any) {
            toast.error(error.message || "An unexpected error occurred", { theme: "dark" });
        } finally {
            setLoading(false);
        }
    };

    const resetState = () => {
        handleImageRemove()
        handleVideoRemove()
        setContent("")
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Drop it here!!</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <textarea
                        className='bg-muted w-full rounded-lg outline-none h-32 p-2 border'
                        placeholder='Share funny guilt confessions or guilty pleasures.'
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                    
                    {previewUrl && (
                        <div className='flex justify-center'>
                            <ImagePreview image={previewUrl} callback={handleImageRemove} />
                        </div>
                    )}
                    
                    {videoPreviewUrl && (
                        <div className='flex justify-center'>
                            <VideoPreview video={videoPreviewUrl} callback={handleVideoRemove} />
                        </div>
                    )}
                    
                    {videoError && (
                        <div className="flex items-center text-red-500 text-sm">
                            <AlertCircle size={16} className="mr-1" />
                            {videoError}
                        </div>
                    )}
                    
                    <div className='flex justify-between items-center'>
                        <div className="flex space-x-4">
                            <div>
                                <input
                                    type="file"
                                    className='hidden'
                                    ref={imageRef}
                                    accept='image/png, image/jpeg, image/webp, image/svg, image/gif'
                                    onChange={handleImageChange}
                                />
                                <Image 
                                    className='cursor-pointer hover:text-primary transition-colors' 
                                    onClick={handleImageIcon} 
                                />
                            </div>
                            <div>
                                <input
                                    type="file"
                                    className='hidden'
                                    ref={videoRef}
                                    accept='video/mp4,video/webm,video/quicktime'
                                    onChange={handleVideoChange}
                                />
                                <Video 
                                    className='cursor-pointer hover:text-primary transition-colors' 
                                    onClick={handleVideoIcon}
                                />
                            </div>
                        </div>
                        
                        <Button 
                            size="sm" 
                            disabled={content.length <= 1 || loading || !!videoError} 
                            onClick={addPost}
                        >  
                            {loading ? "Processing.." : "Share"} 
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
