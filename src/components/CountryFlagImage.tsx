'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Globe } from 'lucide-react';

interface CountryFlagImageProps {
  src: string;
  alt: string;
  cca2?: string;
  cca3?: string;
  countryName?: string;
  flagEmoji?: string;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  sizes?: string;
}

export default function CountryFlagImage({
  src,
  alt,
  cca2,
  cca3,
  countryName,
  flagEmoji,
  fill = true,
  priority = false,
  className = 'object-cover',
  sizes,
}: CountryFlagImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [fallbackAttempted, setFallbackAttempted] = useState(false);

  const handleError = () => {
    if (!fallbackAttempted && cca2) {
      setFallbackAttempted(true);
      setImgSrc(`https://flagcdn.com/w320/${cca2.toLowerCase()}.png`);
    } else {
      setHasError(true);
    }
  };

  if (hasError) {
    return (
      <div className="w-full h-full min-h-[60px] flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 text-slate-600 dark:text-slate-300 p-2 text-center select-none">
        {flagEmoji ? (
          <span className="text-3xl leading-none mb-1">{flagEmoji}</span>
        ) : (
          <Globe className="w-5 h-5 text-slate-400 mb-1" />
        )}
        {cca3 && (
          <span className="text-[11px] font-bold font-mono text-slate-600 dark:text-slate-300">
            {cca3}
          </span>
        )}
        {countryName && (
          <span className="text-[10px] text-slate-400 truncate max-w-full">
            {countryName}
          </span>
        )}
      </div>
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      priority={priority}
      sizes={sizes}
      className={className}
      onError={handleError}
    />
  );
}
