import React, { useRef, useState } from 'react';
import { buildMediaImageCandidates, type MediaImageProvider, type MediaImageSize } from '../../lib/mediaImages';

export interface PandaImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'onError' | 'onLoad'> {
  src?: string | null;
  fallbackSrc?: string | null;
  size?: MediaImageSize;
  provider?: MediaImageProvider;
  onLoad?: React.ReactEventHandler<HTMLImageElement>;
  onError?: React.ReactEventHandler<HTMLImageElement>;
}

/**
 * Shared content-art renderer. It retries only a bounded list of provider-valid
 * URLs, resets on source changes, and never leaves a broken-image icon behind.
 */
export function PandaImage({
  src,
  fallbackSrc,
  size = 'w342',
  provider = 'auto',
  alt,
  className = '',
  onLoad,
  onError,
  loading = 'lazy',
  decoding = 'async',
  fetchPriority = 'auto',
  referrerPolicy = 'no-referrer',
  ...props
}: PandaImageProps) {
  const candidates = buildMediaImageCandidates(src, fallbackSrc, size, provider);
  const sourceKey = candidates.join('\u001f');
  const currentKeyRef = useRef(sourceKey);
  currentKeyRef.current = sourceKey;
  const [progress, setProgress] = useState<{ key: string; index: number; exhausted: boolean }>({
    key: '',
    index: 0,
    exhausted: false,
  });
  const current = progress.key === sourceKey ? progress : { key: sourceKey, index: 0, exhausted: false };
  const activeSrc = candidates[Math.min(current.index, candidates.length - 1)];

  if (current.exhausted || !activeSrc) {
    return <span className={className} role={alt ? 'img' : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true} />;
  }

  return (
    <img
      {...props}
      key={sourceKey + ':' + current.index}
      src={activeSrc}
      alt={alt || ''}
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
      referrerPolicy={referrerPolicy}
      onLoad={(event) => {
        if (progress.key !== sourceKey) setProgress({ key: sourceKey, index: current.index, exhausted: false });
        onLoad?.(event);
      }}
      onError={(event) => {
        if (currentKeyRef.current !== sourceKey) return;
        onError?.(event);
        setProgress((previous) => {
          if (current.index < candidates.length - 1) {
            return { key: sourceKey, index: current.index + 1, exhausted: false };
          }
          return { key: sourceKey, index: current.index, exhausted: true };
        });
      }}
      className={className}
    />
  );
}
