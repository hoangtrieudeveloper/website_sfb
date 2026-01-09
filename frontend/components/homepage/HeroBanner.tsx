"use client";

import { useState } from "react";
import {
  MoveRight,
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

import { partners, heroData } from "./data";

interface HeroBannerProps {
  data?: any;
}

export function HeroBanner({ data }: HeroBannerProps) {
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  
  // Use data from props if available, otherwise fallback to static data
  const title = data?.title || heroData.title;
  const description = data?.description || heroData.description;
  const primaryButton = data?.primaryButton || heroData.primaryButton;
  const secondaryButton = data?.secondaryButton || heroData.secondaryButton;
  const heroImage = data?.heroImage || heroData.heroImage;
  const partnersList = data?.partners || partners;

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
      className="relative w-full max-w-[1920px] mx-auto min-h-screen lg:h-[850px] flex items-center lg:items-start overflow-hidden bg-[#F4FAFE] pt-32 pb-[28px] lg:pt-[171px]"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#006FB3]/20 rounded-full blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-[#0088D9]/20 rounded-full blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-[#006FB3]/15 rounded-full blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <div className="mx-auto w-full max-w-[1920px] px-6 xl:px-0 xl:pl-[clamp(24px,17.45vw,335px)] xl:pr-[clamp(24px,7.8125vw,150px)] relative z-10">
        <div className="grid lg:grid-cols-2 xl:[grid-template-columns:minmax(0,486px)_minmax(0,851px)] gap-[45px] xl:gap-[clamp(45px,5.1042vw,98px)] items-center">
          {/* Left */}
          <div className="space-y-8">
            <ScrollAnimation variant="blur-in" delay={0.2}>
              <h1
                className="text-[#0F172A] font-bold self-stretch text-4xl md:text-5xl lg:text-[54px] text-center lg:text-left"
                style={{
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  lineHeight: "1.2",
                  fontFeatureSettings: "'liga' off, 'clig' off",
                }}
              >
                {title.line1}<br className="hidden lg:block" />
                {title.line2}<br className="hidden lg:block" />
                {title.line3}
              </h1>
            </ScrollAnimation>

            <ScrollAnimation variant="blur-in" delay={0.3}>
              <p
                className="text-[#0F172A] text-base md:text-lg text-center lg:text-left mx-auto lg:mx-0 max-w-xl lg:max-w-[486px]"
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
              <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center lg:justify-start">
                <Link
                  href={primaryButton.link}
                  className="group transition-all hover:shadow-[0_0_20px_rgba(46,171,226,0.6)] text-white font-semibold"
                  style={{
                    display: "flex",
                    height: "56px",
                    padding: "7px 30px",
                    alignItems: "center",
                    gap: "12px",
                    borderRadius: "12px",
                    border: "1px solid #FFF",
                    background:
                      "linear-gradient(73deg, #1D8FCF 32.85%, #2EABE2 82.8%)",
                  }}
                >
                  {primaryButton.text}
                  <MoveRight size={22} className="group-hover:translate-x-1 transition-transform" />
                </Link>

                {secondaryButton?.link ? (
                  <button
                    onClick={handleSecondaryButtonClick}
                    className="group transition-all hover:shadow-[0_0_20px_rgba(29,143,207,0.3)] hover:bg-[#1D8FCF]/5 font-semibold text-[#1D8FCF]"
                    style={{
                      display: "flex",
                      height: "56px",
                      padding: "0 30px",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "12px",
                      borderRadius: "12px",
                      border: "1.5px solid #1D8FCF",
                      background: "transparent",
                    }}
                  >
                    <div className="w-8 h-8 rounded-full bg-white border border-[#1D8FCF] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play size={14} className="text-[#1D8FCF] ml-0.5" />
                    </div>
                    <span>{secondaryButton.text}</span>
                  </button>
                ) : (
                  <button
                    className="group transition-all hover:shadow-[0_0_20px_rgba(29,143,207,0.3)] hover:bg-[#1D8FCF]/5 font-semibold text-[#1D8FCF]"
                    style={{
                      display: "flex",
                      height: "56px",
                      padding: "0 30px",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "12px",
                      borderRadius: "12px",
                      border: "1.5px solid #1D8FCF",
                      background: "transparent",
                    }}
                  >
                     <span>{secondaryButton.text}</span>
                    <div className="w-8 h-8 rounded-full bg-white border border-[#1D8FCF] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play size={14} className="text-[#1D8FCF] ml-0.5" />
                    </div>
                   
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
                alt="SFB Technology Office"
                className="w-full h-full object-cover"
              />
            </div>
          </ScrollAnimation>
        </div>

        {/* ===== Partners ===== */}
        <ScrollAnimation
          variant="fade-in"
          delay={0.6}
          className="mt-[76px]"
        >
          <div
            className="relative mx-auto overflow-hidden mask-fade-x w-full max-w-[1120px]"
            style={{ height: "64px", flexShrink: 0 }}
          >
            <div className="flex items-center gap-16 animate-partner-marquee hover:[animation-play-state:paused] h-full">
              {[...partnersList, ...partnersList].map((logo, idx) => (
                <div
                  key={`${logo}-${idx}`}
                  className="flex items-center justify-center h-full"
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
            className="p-0 flex flex-col"
            style={{ 
              maxWidth: "95vw", 
              width: "90vw",
              maxHeight: "95vh",
              height: "95vh"
            }}
          >
            <DialogHeader className="p-6 pb-4 flex-shrink-0">
              <DialogTitle>
                {secondaryButton.text || "Video"}
              </DialogTitle>
            </DialogHeader>
            <div className="px-6 pb-6 flex-1 flex items-center justify-center min-h-0">
              <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
                {isYouTubeOrVimeo(secondaryButton.link) ? (
                  // YouTube or Vimeo embed
                  (() => {
                    const youtubeId = getYouTubeVideoId(secondaryButton.link);
                    const vimeoId = getVimeoVideoId(secondaryButton.link);
                    
                    if (youtubeId) {
                      return (
                        <iframe
                          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      );
                    } else if (vimeoId) {
                      return (
                        <iframe
                          src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1`}
                          allow="autoplay; fullscreen; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      );
                    }
                    return null;
                  })()
                ) : (
                  // Direct video file
                  <video
                    src={getVideoUrl(secondaryButton.link)}
                    controls
                    autoPlay
                    className="w-full h-full"
                  >
                    Trình duyệt của bạn không hỗ trợ video.
                  </video>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}
