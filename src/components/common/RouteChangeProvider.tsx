"use client";
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Heart } from 'lucide-react';

type RouteChangeContextType = {
  isLoading: boolean;
};

const RouteChangeContext = createContext<RouteChangeContextType>({ isLoading: false });

export const useRouteChangeStatus = () => useContext(RouteChangeContext);

export default function RouteChangeProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const loadingStartTime = useRef<number | null>(null);
  
  const MIN_LOADING_TIME = 3000; // Minimum 2 seconds of loading screen
  const FADE_DURATION = 300; // Duration of fade transition in milliseconds

  // Handle start and end of loading
  const startLoading = () => {
    loadingStartTime.current = Date.now();
    setShowLoader(true);
    // Short delay to ensure DOM is updated before animation
    setTimeout(() => setOpacity(1), 10);
    setIsLoading(true);
  };
  
  const endLoading = () => {
    if (loadingStartTime.current) {
      const elapsedTime = Date.now() - loadingStartTime.current;
      const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);
      
      // Wait for the minimum time before starting to fade out
      setTimeout(() => {
        setOpacity(0);
        // Wait for fade out to complete before removing from DOM
        setTimeout(() => {
          setShowLoader(false);
          setIsLoading(false);
          loadingStartTime.current = null;
        }, FADE_DURATION);
      }, remainingTime);
    }
  };

  useEffect(() => {
    const handleStart = startLoading;
    
    window.addEventListener('beforeunload', handleStart);
    
    return () => {
      window.removeEventListener('beforeunload', handleStart);
    };
  }, []);

  // Listen for pathname or search params changes to trigger loading state
  useEffect(() => {
    startLoading();
    
    // Ensure loading screen stays visible for at least MIN_LOADING_TIME
    const timer = setTimeout(endLoading, MIN_LOADING_TIME);
    
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return (
    <RouteChangeContext.Provider value={{ isLoading }}>
      {children}
      {showLoader && (
        <div 
          className="fixed inset-0 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex flex-col items-center justify-center z-50"
          style={{
            opacity: opacity,
            transition: `opacity ${FADE_DURATION}ms ease-in-out`,
          }}
        >
          <div className="relative">
            {/* Logo in center */}
            <div className={cn("w-28 h-28 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg", "animate-pulse")}>
              <svg 
                width="64" 
                height="64" 
                viewBox="0 0 512 512" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="text-green-500"
              >
                {/* Replace with your actual logo SVG path data */}
                <path 
                  d="M429.9 95.6c-40.4-42.1-106-42.1-146.4 0L256 124.1l-27.5-28.6c-40.5-42.1-106-42.1-146.4 0-45.5 47.3-45.5 124.1 0 171.4L256 448l173.9-181c45.5-47.3 45.5-124.1 0-171.4z"
                  fill="currentColor"
                />
              </svg>
            </div>
            
            {/* Orbit animation with hearts */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60">
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i} 
                  className="absolute rounded-full"
                  style={{
                    width: '100%',
                    height: '100%',
                    animation: `orbit ${3 + i * 0.5}s linear infinite`,
                    transform: `rotate(${i * 60}deg)`,
                  }}
                >
                  <Heart 
                    size={i % 2 === 0 ? 24 : 18} 
                    className="absolute text-white/80 animate-pulse"
                    style={{
                      top: '0',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      animationDelay: `${i * 0.2}s`
                    }}
                    fill="white"
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
            <p className="text-white font-medium">Loading your guilt...</p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-ping"></div>
          <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-white rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute top-2/3 right-1/4 w-2 h-2 bg-white rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
        </div>
      )}
    </RouteChangeContext.Provider>
  );
}