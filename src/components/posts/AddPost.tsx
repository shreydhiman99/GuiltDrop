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
import { Image } from 'lucide-react'
import { Button } from '../ui/button'
import ImagePreview from '../common/ImagePreview'
import { v4 as uuidv4 } from 'uuid'
import { createClient } from '@/lib/supabase/supabaseClient'
import Env from '@/Env'
import { toast } from 'react-toastify'

export default function AddPost({ user, children }: { user: User, children: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const [previewUrl, setPreviewUrl] = useState("")
    const [image, setImage] = useState<File | null>(null)
    const imageRef = useRef<HTMLInputElement | null>(null)
    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(false)
    const supabase = createClient(undefined)
    const handleImageIcon = () => {
        imageRef.current?.click()
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setImage(file)
            const imageUrl = URL.createObjectURL(file)
            setPreviewUrl(imageUrl)
        }
    }


    const handleImageRemove = () => {
        setImage(null)
        if (imageRef.current) {
            imageRef.current.value = ""
        }
        setPreviewUrl("")
    }

    const addPost = async () => {
        setLoading(true); // Start loading
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
            // Handle errors and show error message
            toast.error(error.message || "An unexpected error occurred", { theme: "dark" });
        } finally {
            // Stop loading in all cases
            setLoading(false);
        }
    };

    const resetState = () => {
        
        handleImageRemove()
        setContent("")
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Drop it here!!</DialogTitle>
                </DialogHeader>
                <div>
                    <textarea
                        className='bg-muted w-full rounded-lg outline-none h-32 p-2 border'
                        placeholder='Share funny guilt confessions or guilty pleasures.'
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                    {previewUrl && (
                        <div className='flex justify-center mt-4'>
                            <ImagePreview image={previewUrl} callback={handleImageRemove} />
                        </div>
                    )}
                    <div className='flex justify-between items-center mt-4'>
                        <input
                            type="file"
                            className='hidden'
                            ref={imageRef}
                            accept='image/png, image/jpeg, image/webp, image/svg, image/gif image/mkv'
                            onChange={handleImageChange}
                        />
                        <Image className='cursor-pointer' onClick={handleImageIcon} />
                        <Button size="sm" disabled={content.length <= 1 || loading} onClick={addPost}>  {loading? "Processing..":"Share"} </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
