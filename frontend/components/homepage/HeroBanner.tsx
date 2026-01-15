"use client";

import { useState } from "react";
import {
  ArrowRight,
  Play,
} from "lucide-react";
import { motion } from "framer-motion"; // Add Framer Motion
import { ImageWithFallback } from "../figma/ImageWithFallback";
import Link from "next/link";
import { ScrollAnimation } from "../public/ScrollAnimation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { buildUrl } from "@/lib/api/base";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { getLocalizedText } from "@/lib/utils/i18n";

interface HeroBannerProps {
  data?: any;
  locale?: 'vi' | 'en' | 'ja';
}

export function HeroBanner({ data, locale: propLocale }: HeroBannerProps) {
  const { locale: contextLocale } = useLocale();
  const locale = (propLocale || contextLocale) as 'vi' | 'en' | 'ja';
  const [showVideoDialog, setShowVideoDialog] = useState(false);

  // Chỉ sử dụng data từ API, không có fallback static data
  if (!data) {
    return null;
  }

  // Localize fields
  // Title can be string or object with line1, line2, line3
  let title: { line1?: string; line2?: string; line3?: string } | string = data?.title;
  if (title && typeof title === 'object' && !Array.isArray(title)) {
    title = {
      line1: typeof title.line1 === 'string' ? title.line1 : getLocalizedText(title.line1, locale),
      line2: typeof title.line2 === 'string' ? title.line2 : getLocalizedText(title.line2, locale),
      line3: typeof title.line3 === 'string' ? title.line3 : getLocalizedText(title.line3, locale),
    };
  } else if (typeof title === 'string') {
    // If title is string, keep as is
    title = title;
  }

  const description = typeof data?.description === 'string' ? data.description : getLocalizedText(data?.description, locale);
  const primaryButton = data?.primaryButton;
  const secondaryButton = data?.secondaryButton;
  const heroImage = data?.heroImage;
  const partnersList = data?.partners || [];

  // Localize button texts
  const primaryButtonText = primaryButton?.text
    ? (typeof primaryButton.text === 'string' ? primaryButton.text : getLocalizedText(primaryButton.text, locale))
    : undefined;
  const secondaryButtonText = secondaryButton?.text
    ? (typeof secondaryButton.text === 'string' ? secondaryButton.text : getLocalizedText(secondaryButton.text, locale))
    : undefined;

  // Get YouTube video ID from URL
  const getYouTubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Get Vimeo video ID from URL
  const getVimeoVideoId = (url: string): string | null => {
    const regExp = /(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  // Check if URL is YouTube or Vimeo
  const isYouTubeOrVimeo = (url: string): boolean => {
    if (!url) return false;
    const lowerUrl = url.toLowerCase();
    return lowerUrl.includes('youtube.com') ||
      lowerUrl.includes('youtu.be') ||
      lowerUrl.includes('vimeo.com');
  };

  // Get video URL (build full URL if needed)
  const getVideoUrl = (url: string): string => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    if (url.startsWith('/')) {
      return buildUrl(url);
    }
    return url;
  };

  // Handle secondary button click
  const handleSecondaryButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const link = secondaryButton?.link || '';
    const buttonType = secondaryButton?.type || 'link'; // 'link' or 'video'

    if (!link) return;

    // Sử dụng type từ config thay vì auto-detect
    if (buttonType === 'video') {
      // Open video popup
      setShowVideoDialog(true);
    } else {
      // Redirect to link
      if (link.startsWith('http://') || link.startsWith('https://')) {
        window.open(link, '_blank');
      } else {
        window.location.href = link;
      }
    }
  };

  return (
    <section
      id="home"
      className="relative w-full max-w-[1920px] mx-auto min-h-[100dvh] lg:min-h-[700px] xl:min-h-[850px] flex flex-col justify-center overflow-hidden bg-[#F4FAFE] pt-24 sm:pt-28 pb-8 lg:pt-20"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#006FB3]/20 rounded-full blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-[#0088D9]/20 rounded-full blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-[#006FB3]/15 rounded-full blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <div className="mx-auto w-full max-w-[1920px] px-6 lg:px-10 xl:px-0 xl:pl-[clamp(24px,17.45vw,335px)] xl:pr-[clamp(24px,7.8125vw,150px)] relative z-10 flex flex-col justify-center">
        <div className="grid lg:grid-cols-2 xl:[grid-template-columns:minmax(0,486px)_minmax(0,851px)] gap-8 md:gap-[45px] xl:gap-[clamp(45px,5.1042vw,98px)] items-center">
          {/* Left */}
          <div className="space-y-6 lg:space-y-8">
            <ScrollAnimation variant="blur-in" delay={0.2}>
              <h1
                className="text-[#0F172A] font-bold self-stretch text-3xl sm:text-4xl md:text-5xl lg:text-[54px] text-center lg:text-left"
                style={{
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  lineHeight: "1.2",
                  fontFeatureSettings: "'liga' off, 'clig' off",
                }}
              >
                {typeof title === 'string' ? (
                  title
                ) : (
                  <>
                    {title.line1} <br className="hidden lg:block" />
                    {title.line2} <br className="hidden lg:block" />
                    {title.line3}
                  </>
                )}
              </h1>
            </ScrollAnimation>

            <ScrollAnimation variant="blur-in" delay={0.3}>
              <p
                className="text-[#0F172A] text-sm sm:text-base md:text-lg text-center lg:text-left mx-auto lg:mx-0 max-w-xl lg:max-w-[486px]"
                style={{
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  lineHeight: "30px",
                  fontWeight: 400,
                  fontFeatureSettings: "'liga' off, 'clig' off",
                }}
              >
                {description}
              </p>
            </ScrollAnimation>

            <ScrollAnimation variant="blur-in" delay={0.4}>
              <div className="flex flex-row gap-3 sm:gap-4 pt-2 justify-center lg:justify-start">
                <Link
                  href={primaryButton.link}
                  prefetch={true}
                  className="group transition-all hover:shadow-[0_0_20px_rgba(46,171,226,0.6)] text-white font-semibold px-4 sm:px-[30px] h-12 sm:h-[56px] text-sm sm:text-base"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    borderRadius: "12px",
                    border: "1px solid #FFF",
                    background:
                      "linear-gradient(73deg, #1D8FCF 32.85%, #2EABE2 82.8%)",
                  }}
                >
                  {primaryButton.text}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>

                {secondaryButton?.link ? (
                  <button
                    onClick={handleSecondaryButtonClick}
                    className="group transition-all hover:shadow-[0_0_20px_rgba(29,143,207,0.3)] hover:bg-[#1D8FCF]/5 font-semibold text-[#1D8FCF] px-0 w-[48px] sm:w-auto sm:px-[30px] flex justify-center items-center gap-0 sm:gap-3 h-12 sm:h-[56px] text-sm sm:text-base"
                    style={{
                      borderRadius: "12px",
                      border: "1.5px solid #1D8FCF",
                      background: "transparent",
                    }}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#006FB3] to-[#0088D9] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play size={14} className="text-white ml-0.5" />
                    </div>
                    <span className="hidden sm:inline">{secondaryButton.text}</span>
                  </button>
                ) : (
                  <button
                    className="group transition-all hover:shadow-[0_0_20px_rgba(29,143,207,0.3)] hover:bg-[#1D8FCF]/5 font-semibold text-[#1D8FCF] px-0 w-[56px] sm:w-auto sm:px-[30px] flex justify-center items-center gap-0 sm:gap-3"
                    style={{
                      height: "56px",
                      borderRadius: "12px",
                      border: "1.5px solid #1D8FCF",
                      background: "transparent",
                    }}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#006FB3] to-[#0088D9] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play size={14} className="text-white ml-0.5" />
                    </div>
                    <span className="hidden sm:inline">{secondaryButton.text}</span>
                  </button>
                )}
              </div>
            </ScrollAnimation>
          </div>

          {/* Right Image */}
          <ScrollAnimation
            variant="zoom-in"
            delay={0.3}
            duration={0.8}
            className="block lg:justify-self-end"
          >
            <div
              className="relative overflow-hidden box-border w-full max-w-[851px] aspect-[851/505] lg:ml-auto min-[1920px]:w-[851px] min-[1920px]:h-[505px] min-[1920px]:aspect-auto"
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                borderRadius: "24px",
                border: "10px solid #FFF",
                background: "#FFF",
                boxShadow: "0 18px 36px 0 rgba(0, 0, 0, 0.12)",
              }}
            >
              <ImageWithFallback
                src={heroImage}
                alt={title || description || "SFB Technology Hero"}

                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 851px"
                priority={true}
                objectFit="cover"
                className="rounded-[14px]"
              />
            </div>
          </ScrollAnimation>
        </div>

        {/* ===== Partners ===== */}
        <ScrollAnimation
          variant="fade-in"
          delay={0.6}
          className="mt-10 md:mt-[76px]"
        >
          <div
            className="relative mx-auto overflow-hidden mask-fade-x w-full max-w-[1120px]"
            style={{ height: "64px", flexShrink: 0 }}
          >
            <div
              className="flex items-center animate-partner-marquee hover:[animation-play-state:paused] h-full"
              style={{ animationDuration: '100s' }}
            >
              {[...partnersList, ...partnersList, ...partnersList, ...partnersList, ...partnersList, ...partnersList, ...partnersList, ...partnersList].map((logo, idx) => (
                <div
                  key={`${logo}-${idx}`}
                  className="flex items-center justify-center h-full pr-16"
                >
                  <ImageWithFallback
                    src={logo}
                    alt="Đối tác SFB"
                    className="h-16 w-auto object-contain hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </ScrollAnimation>
      </div>

      {/* Video Dialog */}
      {secondaryButton?.link && secondaryButton?.type === 'video' && (
        <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
          <DialogContent
            className="p-0 overflow-hidden data-[state=open]:duration-700 data-[state=open]:zoom-in-0"
            style={{
              maxWidth: "1000px",
              width: "90vw",
              maxHeight: "90vh", // Prevent overflowing screen on crazy tall usage, but mainly rely on aspect-video
              animationTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <DialogHeader className="p-4 sm:p-6 pb-2 sm:pb-4 flex-shrink-0">
              <DialogTitle>
                {secondaryButtonText || "Video"}
              </DialogTitle>
            </DialogHeader>
            <div className="px-4 sm:px-6 pb-4 sm:pb-6 w-full flex justify-center">
              {isYouTubeOrVimeo(secondaryButton.link) ? (
                <div className="relative w-full h-[65vh] sm:h-auto sm:aspect-video bg-black rounded-lg overflow-hidden shadow-xl">
                  {(() => {
                    const youtubeId = getYouTubeVideoId(secondaryButton.link);
                    const vimeoId = getVimeoVideoId(secondaryButton.link);

                    if (youtubeId) {
                      return (
                        <iframe
                          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute inset-0 w-full h-full"
                        />
                      );
                    } else if (vimeoId) {
                      return (
                        <iframe
                          src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1`}
                          allow="autoplay; fullscreen; picture-in-picture"
                          allowFullScreen
                          className="absolute inset-0 w-full h-full"
                        />
                      );
                    }
                    return null;
                  })()}
                </div>
              ) : (
                <div className="relative w-full bg-black rounded-lg overflow-hidden shadow-xl flex justify-center items-center">
                  <video
                    src={getVideoUrl(secondaryButton.link)}
                    controls
                    autoPlay
                    className="max-w-full max-h-[80vh] w-auto h-auto"
                  >
                    Trình duyệt của bạn không hỗ trợ video.
                  </video>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}
