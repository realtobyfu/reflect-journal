'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  blurDataURL?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  placeholder,
  blurDataURL,
  width,
  height,
  priority = false,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div 
      ref={imgRef} 
      className={cn('relative overflow-hidden', className)}
      style={{ width, height }}
    >
      {/* Blur placeholder */}
      <motion.div
        className={cn(
          'absolute inset-0 bg-surface-dark transition-opacity duration-300',
          isLoaded ? 'opacity-0' : 'opacity-100'
        )}
        style={{
          backgroundImage: blurDataURL ? `url(${blurDataURL})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        animate={{
          opacity: isLoaded ? 0 : 1
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Placeholder content */}
      {!isLoaded && !hasError && placeholder && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-muted-foreground text-sm">{placeholder}</span>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface-dark">
          <span className="text-muted-foreground text-sm">Failed to load image</span>
        </div>
      )}

      {/* Actual image (lazy loaded) */}
      {isInView && !hasError && (
        <motion.img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'relative z-10 w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </div>
  );
};

// Image gallery component with optimized loading
interface ImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    thumbnail?: string;
  }>;
  className?: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, className }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <>
      <div className={cn('grid grid-cols-2 md:grid-cols-3 gap-4', className)}>
        {images.map((image, index) => (
          <motion.div
            key={image.src}
            className="aspect-square cursor-pointer rounded-lg overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedIndex(index)}
          >
            <OptimizedImage
              src={image.thumbnail || image.src}
              alt={image.alt}
              className="w-full h-full"
              placeholder="Loading..."
            />
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedIndex(null)}
        >
          <motion.div
            className="max-w-4xl max-h-full"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            onClick={(e) => e.stopPropagation()}
          >
            <OptimizedImage
              src={images[selectedIndex].src}
              alt={images[selectedIndex].alt}
              className="w-full h-full rounded-lg"
              priority
            />
          </motion.div>
        </motion.div>
      )}
    </>
  );
};