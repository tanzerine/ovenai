import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface RotatingGalleryProps {
  imageCount: number;
}

const RotatingGallery: React.FC<RotatingGalleryProps> = ({ imageCount }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imageCount);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [imageCount]);

  console.log('RotatingGallery rendering with imageCount:', imageCount);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        {Array.from({ length: imageCount }).map((_, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={`https://picsum.photos/800/600?random=${index}`}
              alt={`Use case ${index + 1}`}
              layout="fill"
              objectFit="cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-white/75 backdrop-blur-sm" />
    </div>
  );
};

export default RotatingGallery;