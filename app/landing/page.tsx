'use client'
import React from 'react';

export default function LandingPage() {
  return (
    <div style={{ height: '1000vh', display: 'flex', flexDirection: 'column'}}>
      <iframe 
        src="/framer-landing.html" 
        style={{ 
          border: 'none', 
          flexGrow: 1, 
          position: 'absolute', // Change to absolute positioning
          top: '-65px', // Adjust this value as needed to cover the top gap
          left: 0,
          width: '100%',
          height: 'calc(100% + 65px)', // Increase height to compensate for negative top
        }}
        scrolling="no" // Disable scrolling for older browsers
      />
    </div>
  );
}