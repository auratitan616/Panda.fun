import React, { useState } from 'react';
import { DEFAULT_POSTER } from '../../types';
import { PandaImage } from './PandaImage';

export interface AnimeImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'loading' | 'src' | 'srcSet' | 'onError' | 'onLoad'> {
  src?: string | null;
  alt: string;
  aspectRatio?: 'poster' | 'landscape' | 'square' | 'custom';
  fallbackSrc?: string | null;
  className?: string;
  imageClassName?: string;
  loading?: 'lazy' | 'eager';
}

const aspectClasses = {
  poster: 'aspect-[2/3]',
  landscape: 'aspect-video',
  square: 'aspect-square',
  custom: '',
};

export function AnimeImage({
  src,
  alt,
  aspectRatio = 'poster',
  fallbackSrc = DEFAULT_POSTER,
  className = '',
  imageClassName = '',
  loading = 'lazy',
  ...props
}: AnimeImageProps) {
  const imageKey = src || '';
  const [loadedKey, setLoadedKey] = useState('');
  const isLoaded = loadedKey === imageKey && Boolean(imageKey);

  return (
    <div className={`relative overflow-hidden bg-[#12141c] ${aspectClasses[aspectRatio]} ${className}`}>
      {!isLoaded && <div className="absolute inset-0 bg-[#161824] animate-pulse" aria-hidden="true" />}
      <PandaImage
        key={imageKey}
        src={src}
        fallbackSrc={fallbackSrc}
        alt={alt}
        size={aspectRatio === 'landscape' ? 'w1280' : 'w342'}
        loading={loading}
        onLoad={() => setLoadedKey(imageKey)}
        className={`relative w-full h-full object-cover transition-opacity duration-300 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'} ${imageClassName}`}
        {...props}
      />
    </div>
  );
}
