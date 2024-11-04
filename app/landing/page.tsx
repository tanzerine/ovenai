'use client'
import React, { useEffect } from 'react';

export default function LandingPage() {
  useEffect(() => {
    // Track page view when component mounts
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_title: 'Oven AI Landing Page',
        page_location: window.location.href,
        page_path: '/landing',
      });
    }
  }, []);

  return (
    <div style={{ height: '1000vh', display: 'flex', flexDirection: 'column'}}>
      <iframe 
        src="/framer-landing.html" 
        style={{ 
          border: 'none', 
          flexGrow: 1, 
          position: 'absolute',
          top: '-65px',
          left: 0,
          width: '100%',
          height: 'calc(100% + 65px)',
        }}
        scrolling="no"
      />
    </div>
  );
}
