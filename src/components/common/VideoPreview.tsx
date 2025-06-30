"use client"
import React, { useRef, useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { X, Play, Pause, Volume2, VolumeX } from 'lucide-react'

export default function VideoPreview({ 
  video, 
  callback 
}: { 
  video: string, 
  callback: () => void 
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [duration, setDuration] = useState(0)
  
  useEffect(() => {
    const videoElement = videoRef.current
    if (videoElement) {
      videoElement.onloadedmetadata = () => {
        setDuration(videoElement.duration)
      }
      
      videoElement.onplay = () => setIsPlaying(true)
      videoElement.onpause = () => setIsPlaying(false)
      videoElement.onended = () => setIsPlaying(false)
    }
    
    return () => {
      if (videoElement) {
        videoElement.onloadedmetadata = null
        videoElement.onplay = null
        videoElement.onpause = null
        videoElement.onended = null
      }
    }
  }, [])
  
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
    }
  }
  
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }
  
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  return (
    <div className='relative border-2 rounded-xl overflow-hidden max-w-full' style={{ maxHeight: '180px' }}>
      <video 
        ref={videoRef}
        src={video} 
        className="w-full h-auto max-h-[180px] object-contain" 
        muted={isMuted}
        loop
        playsInline
      />
      
      {/* Video controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1 flex justify-between items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 rounded-full text-white hover:bg-white/20 p-0"
          onClick={togglePlay}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </Button>
        
        <span className="text-white text-xs">
          {formatDuration(duration)}
        </span>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 rounded-full text-white hover:bg-white/20 p-0"
          onClick={toggleMute}
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </Button>
      </div>
      
      {/* Remove button */}
      <Button 
        variant="secondary" 
        size="icon" 
        className='absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white h-6 w-6 p-0' 
        onClick={callback}
      >
        <X size={14} />
      </Button>
    </div>
  )
}