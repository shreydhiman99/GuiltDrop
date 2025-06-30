"use client"
import React, { useRef, useState, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'

interface VideoPlayerProps {
  src: string
  className?: string
}

export default function VideoPlayer({ src, className = "" }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true) // Start muted by default
  const [showControls, setShowControls] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    
    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)
    
    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('loadedmetadata', updateDuration)
    video.addEventListener('ended', () => setIsPlaying(false))
    
    return () => {
      video.removeEventListener('timeupdate', updateTime)
      video.removeEventListener('loadedmetadata', updateDuration)
      video.removeEventListener('ended', () => setIsPlaying(false))
    }
  }, [])
  
  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    
    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }
  
  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    
    video.muted = !isMuted
    setIsMuted(!isMuted)
  }
  
  const handleVideoClick = (e: React.MouseEvent) => {
    // Only toggle play if clicking in the center area (not on controls)
    const rect = e.currentTarget.getBoundingClientRect()
    const clickY = e.clientY - rect.top
    const videoHeight = rect.height
    
    // If clicking in the bottom 60px, don't toggle play (that's the controls area)
    if (clickY < videoHeight - 60) {
      togglePlay()
    }
  }
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }
  
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div 
      className={`relative group cursor-pointer ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-auto max-h-[400px] object-contain"
        muted={isMuted}
        playsInline
        preload="metadata"
        onClick={handleVideoClick}
      >
        <source src={src} type="video/mp4" />
        <source src={src} type="video/webm" />
        Your browser does not support the video tag.
      </video>
      
      {/* Center Play/Pause Button - Always visible when paused */}
      {(!isPlaying || showControls) && (
        <div 
          className="absolute inset-0 flex items-center justify-center"
          onClick={togglePlay}
        >
          <div className="bg-black/50 rounded-full p-3 transition-opacity duration-200">
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" />
            )}
          </div>
        </div>
      )}
      
      {/* Bottom Controls - Show on hover or when paused */}
      {(showControls || !isPlaying) && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          {/* Progress Bar */}
          <div className="w-full h-1 bg-white/30 rounded-full mb-3">
            <div 
              className="h-full bg-white rounded-full transition-all duration-100"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={togglePlay}
                className="text-white hover:text-gray-300 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>
              
              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            
            <button
              onClick={toggleMute}
              className="text-white hover:text-gray-300 transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}