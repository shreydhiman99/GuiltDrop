"use client"
import React, { useState } from 'react'

export default function VideoTest() {
  const [videoUrl, setVideoUrl] = useState('');
  const [fetchStatus, setFetchStatus] = useState('');
  const testUrl = "https://aamchipirkycsdyxrfkf.supabase.co/storage/v1/object/public/guiltdrop/videos/1a524e20-0d79-4984-a2ea-d654387c9c9f/0e64beab-d347-4751-b237-254ad8a37aee";
  
  const testFetch = async (url: string) => {
    setFetchStatus('Testing...');
    try {
      const response = await fetch(url, { method: 'HEAD' });
      setFetchStatus(`Status: ${response.status} - ${response.statusText}`);
      console.log('Response headers:', response.headers);
      console.log('Content-Type:', response.headers.get('content-type'));
      console.log('Content-Length:', response.headers.get('content-length'));
    } catch (error) {
      setFetchStatus(`Error: ${error}`);
      console.error('Fetch error:', error);
    }
  };
  
  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Video Test</h2>
      
      <div className="mb-4">
        <input 
          type="text" 
          value={videoUrl} 
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Enter video URL to test"
          className="w-full p-2 border rounded mb-2"
        />
        <div className="flex gap-2">
          <button 
            onClick={() => setVideoUrl(testUrl)} 
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Use Sample URL
          </button>
          <button 
            onClick={() => testFetch(videoUrl || testUrl)} 
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Test Access
          </button>
        </div>
        {fetchStatus && (
          <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
            {fetchStatus}
          </div>
        )}
      </div>
      
      {videoUrl && (
        <div className="space-y-4">
          {/* Test with simple video tag */}
          <div className="border rounded overflow-hidden">
            <h3 className="text-lg font-semibold p-2 bg-gray-100">Simple Video Element</h3>
            <video 
              controls 
              className="w-full h-auto"
              src={videoUrl}
              onLoadStart={() => console.log('Video load started')}
              onLoadedMetadata={() => console.log('Video metadata loaded')}
              onCanPlay={() => console.log('Video can play')}
              onError={(e) => console.error('Video error:', e.currentTarget.error)}
            >
              Your browser doesn't support video playback.
            </video>
          </div>
          
          {/* Test with iframe */}
          <div className="border rounded overflow-hidden">
            <h3 className="text-lg font-semibold p-2 bg-gray-100">Direct Link Test</h3>
            <a 
              href={videoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block p-4 text-blue-500 underline"
            >
              Open video in new tab
            </a>
          </div>
        </div>
      )}
    </div>
  );
}