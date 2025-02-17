import React, { useState, useEffect, CSSProperties } from 'react';

interface BlurImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
}

const BlurImage: React.FC<BlurImageProps> = ({ src, alt, className = '', style = {} }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!src) {
      setIsLoading(false);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;

    img.onload = () => {
      setIsLoading(false);
      setLoadError(false);
    };

    img.onerror = () => {
      setIsLoading(false);
      setLoadError(true);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  if (loadError) {
    return (
      <div
        className={`
          ${className} 
          bg-slate-200 
          flex 
          items-center 
          justify-center 
          text-gray-500
        `}
      >
        Image failed to load
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder inherits className styling */}
      <div
        className={`
          absolute 
          inset-0 
          bg-slate-200
          ${isLoading ? 'visible' : 'invisible'}
        `}
      />

      <img
        src={src}
        alt={alt}
        crossOrigin='anonymous'
        style={style}
        className={`
          duration-700 
          ease-in-out 
          w-full 
          h-full 
          object-cover
          ${isLoading ? 'scale-110 blur-2xl opacity-40' : 'scale-100 blur-0 opacity-100'}
        `}
      />

      {/* Shimmer effect */}
      {isLoading && (
        <div
          className={`
            absolute 
            inset-0 
            -translate-x-full 
            animate-[shimmer_1s_infinite] 
            bg-gradient-to-r 
            from-transparent 
            via-white/20 
            to-transparent
          `}
        />
      )}
    </div>
  );
};

export default BlurImage;
