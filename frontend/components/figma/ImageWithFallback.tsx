"use client";

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

// Ảnh mặc định khi không có ảnh
const DEFAULT_NO_COVER = '/images/no_cover.jpeg'

interface ImageWithFallbackProps extends Omit<React.ComponentProps<typeof Image>, 'src' | 'alt' | 'width' | 'height' | 'fill' | 'quality' | 'priority' | 'loading' | 'sizes' | 'style' | 'className'> {
  src?: string | null;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  quality?: number;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
}

export function ImageWithFallback({
  src,
  alt = "No cover image",
  className = "",
  style,
  width,
  height,
  fill = false,
  sizes,
  priority = false,
  loading = 'lazy',
  quality = 85,
  objectFit = 'cover',
  objectPosition = 'center',
  ...rest
}: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false)
  const [imgSrc, setImgSrc] = useState<string>(() => {
    // Kiểm tra nếu src rỗng, null, undefined hoặc chỉ là khoảng trắng thì dùng no_cover
    if (!src || (typeof src === 'string' && src.trim() === '')) {
      return DEFAULT_NO_COVER;
    }
    return src;
  })

  // Update imgSrc khi src prop thay đổi
  useEffect(() => {
    const normalizedSrc = !src || (typeof src === 'string' && src.trim() === '')
      ? DEFAULT_NO_COVER
      : src;

    if (normalizedSrc !== imgSrc) {
      setImgSrc(normalizedSrc);
      setDidError(false);
    }
  }, [src]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleError = () => {
    if (!didError && imgSrc !== DEFAULT_NO_COVER) {
      setDidError(true);
      setImgSrc(DEFAULT_NO_COVER);
    }
  }

  // Nếu là external URL hoặc data URL, cần xử lý đặc biệt
  const isExternal = imgSrc.startsWith('http://') || imgSrc.startsWith('https://');
  const isDataUrl = imgSrc.startsWith('data:');

  // Nếu fill được set, sử dụng fill mode
  if (fill) {
    const objectFitClass = objectFit === 'cover' ? 'object-cover' :
      objectFit === 'contain' ? 'object-contain' :
        objectFit === 'fill' ? 'object-fill' :
          objectFit === 'none' ? 'object-none' :
            objectFit === 'scale-down' ? 'object-scale-down' : 'object-cover';

    return (
      <div className="relative w-full h-full" style={style}>
        <Image
          src={imgSrc}
          alt={alt}
          fill
          sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
          priority={priority}
          quality={quality}
          className={`${objectFitClass} ${className}`}
          style={{ objectPosition }}
          unoptimized={isExternal || isDataUrl}
          onError={() => handleError()}
          {...rest}
        />
      </div>
    );
  }

  // Nếu có width và height, sử dụng chúng
  if (width && height) {
    const objectFitClass = objectFit === 'cover' ? 'object-cover' :
      objectFit === 'contain' ? 'object-contain' :
        objectFit === 'fill' ? 'object-fill' :
          objectFit === 'none' ? 'object-none' :
            objectFit === 'scale-down' ? 'object-scale-down' : 'object-cover';

    return (
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${objectFitClass}`}
        style={{ ...style, objectPosition }}
        priority={priority}
        loading={loading}
        quality={quality}
        unoptimized={isExternal || isDataUrl}
        {...rest}
      />
    );
  }

  // Fallback: sử dụng img tag nếu không có width/height và không fill
  // (trường hợp này nên tránh, nhưng giữ lại để tương thích)
  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      style={{ ...style, objectFit, objectPosition }}
      loading={loading}
      onError={handleError}
      {...Object.fromEntries(Object.entries(rest).filter(([key]) => key !== 'ref'))}
    />
  );
}
