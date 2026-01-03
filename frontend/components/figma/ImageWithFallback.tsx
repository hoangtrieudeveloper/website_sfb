"use client";

import React, { useState } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

// Ảnh mặc định khi không có ảnh
const DEFAULT_NO_COVER = '/images/no_cover.jpeg'

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(false)

  const handleError = () => {
    setDidError(true)
  }

  const { src, alt, style, className, ...rest } = props

  // Kiểm tra nếu src rỗng, null, undefined hoặc chỉ là khoảng trắng thì dùng no_cover
  const imageSrc = !src || src.trim() === '' ? DEFAULT_NO_COVER : src

  // Nếu ảnh bị lỗi khi load, fallback về no_cover
  const finalSrc = didError ? DEFAULT_NO_COVER : imageSrc

  return (
    <img 
      src={finalSrc} 
      alt={alt || "No cover image"} 
      className={className} 
      style={style} 
      {...rest} 
      onError={handleError} 
    />
  )
}
