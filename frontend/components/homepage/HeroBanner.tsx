"use client";

import {
  ArrowRight,
  Play,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion"; // Add Framer Motion
import { ImageWithFallback } from "../figma/ImageWithFallback";
import Link from "next/link";
import { ScrollAnimation } from "../public/ScrollAnimation";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../ui/dialog";

import { partners, heroData } from "./data";

interface HeroBannerProps {
  data?: any;
}

export function HeroBanner({ data }: HeroBannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  // Use data from props if available, otherwise fallback to static data
  const title = data?.title || heroData.title;
  const description = data?.description || heroData.description;
  const primaryButton = data?.primaryButton || heroData.primaryButton;
  const secondaryButton = data?.secondaryButton || heroData.secondaryButton;
  const heroImage = data?.heroImage || heroData.heroImage;
  const partnersList = data?.partners || partners;

  return (
    <section
      id="home"
      className="relative w-full max-w-[1920px] mx-auto h-[100svh] min-h-[550px] lg:min-h-screen lg:h-[850px] flex flex-col justify-center lg:block overflow-hidden bg-[#F4FAFE] pt-28 lg:pt-[171px] pb-20 lg:pb-[28px]"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#006FB3]/20 rounded-full blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-[#0088D9]/20 rounded-full blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-[#006FB3]/15 rounded-full blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <div className="mx-auto w-full max-w-[1920px] px-4 sm:px-6 xl:px-0 xl:pl-[clamp(24px,17.45vw,335px)] xl:pr-[clamp(24px,7.8125vw,150px)] relative z-10 h-full flex flex-col lg:block justify-center lg:justify-start">
        <div className="flex-1 flex flex-col justify-center lg:grid lg:grid-cols-2 lg:justify-start xl:[grid-template-columns:minmax(0,486px)_minmax(0,851px)] gap-y-4 min-[410px]:gap-y-6 min-h-[800px]:gap-y-10 lg:gap-[45px] xl:gap-[clamp(45px,5.1042vw,98px)] items-center">
          {/* Left */}
          <div className="space-y-3 min-[410px]:space-y-4 sm:space-y-5 lg:space-y-8 flex flex-col items-center lg:items-start text-center lg:text-left w-full">
            <ScrollAnimation variant="blur-in" delay={0.2}>
              <h1
                className="text-[#0F172A] font-bold self-stretch text-[28px] min-[375px]:text-[32px] min-[410px]:text-[36px] sm:text-4xl md:text-5xl lg:text-[54px]"
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
                className="text-[#0F172A] text-sm min-[410px]:text-[15px] md:text-lg mx-auto lg:mx-0 max-w-xl lg:max-w-[486px] line-clamp-2 min-[375px]:line-clamp-3 md:line-clamp-none px-2 sm:px-0"
                style={{
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  lineHeight: "1.5",
                  fontWeight: 400,
                  fontFeatureSettings: "'liga' off, 'clig' off",
                }}
              >
                {description}
              </p>
            </ScrollAnimation>

            <ScrollAnimation variant="blur-in" delay={0.4} className="w-full lg:w-auto">
              <div className="flex flex-row gap-3 pt-1 sm:pt-2 justify-center lg:justify-start w-full px-2 sm:px-0">
                <Link
                  href="/products"
                  className="group transition-all hover:shadow-[0_0_20px_rgba(46,171,226,0.6)] text-white font-semibold flex-1 lg:flex-none justify-center whitespace-nowrap gap-2 lg:gap-3 lg:px-[30px] lg:py-[7px]"
                  style={{
                    display: "flex",
                    height: "56px",
                    alignItems: "center",
                    borderRadius: "12px",
                    border: "1px solid #FFF",
                    background:
                      "linear-gradient(73deg, #1D8FCF 32.85%, #2EABE2 82.8%)",
                  }}
                >
                  <span className="text-[15px] min-[410px]:text-base px-1 lg:px-0">{primaryButton.text}</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>

                <Dialog open={isOpen} onOpenChange={(open) => {
                  setIsOpen(open);
                  if (open) console.log("Popup opened - Custom Effect Triggered");
                }}>
                  <DialogTrigger asChild>
                    <button
                      className="group transition-all hover:shadow-[0_0_20px_rgba(29,143,207,0.3)] hover:bg-[#1D8FCF]/5 font-semibold text-[#1D8FCF] flex-none sm:flex-[0.8] lg:flex-none justify-center whitespace-nowrap w-[56px] sm:w-auto gap-2 lg:gap-3 lg:px-[30px]"
                      style={{
                        display: "flex",
                        height: "56px",
                        alignItems: "center",
                        borderRadius: "12px",
                        border: "1.5px solid #1D8FCF",
                        background: "transparent",
                      }}
                    >
                      <div className="w-8 h-8 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#006FB3] to-[#0088D9] flex items-center justify-center group-hover:scale-110 transition-transform sm:ml-1 lg:ml-0">
                        <Play size={14} className="text-white ml-0.5" />
                      </div>
                      <span className="text-[15px] min-[410px]:text-base px-1 lg:px-0 hidden sm:inline">{secondaryButton.text}</span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[1024px] w-[95vw] p-0 bg-black/90 border border-white/10 shadow-2xl overflow-hidden backdrop-blur-sm">
                    <div className="relative pt-[56.25%]">
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src={isOpen ? "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0" : ""}
                        title="SFB Technology Introduction"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </ScrollAnimation>
          </div>

          {/* Right Image */}
          <ScrollAnimation
            variant="zoom-in"
            delay={0.3}
            duration={0.8}
            className="block lg:justify-self-end w-full"
          >
            <div
              className={`relative overflow-hidden box-border w-full max-w-[851px] aspect-[851/505] lg:ml-auto min-[1920px]:w-[851px] min-[1920px]:h-[505px] min-[1920px]:aspect-auto mx-auto max-h-[25vh] min-[410px]:max-h-[35vh] min-h-[800px]:max-h-[38vh] lg:max-h-none rounded-2xl md:rounded-[24px] border-[6px] lg:border-[10px] border-white`}
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
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
          className="mt-4 sm:mt-6 lg:mt-[76px] w-full shrink-0"
        >
          <div
            className="relative mx-auto overflow-hidden mask-fade-x w-full max-w-[1120px] h-14 min-[410px]:h-18 lg:h-20 shrink-0"
          >
            <div className="flex items-center gap-6 sm:gap-8 lg:gap-16 animate-partner-marquee hover:[animation-play-state:paused] h-full">
              {[...partnersList, ...partnersList].map((logo, idx) => (
                <div
                  key={`${logo}-${idx}`}
                  className="flex items-center justify-center h-full"
                >
                  <ImageWithFallback
                    src={logo}
                    alt="Đối tác SFB"
                    className="h-10 min-[410px]:h-14 lg:h-16 w-auto object-contain hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
