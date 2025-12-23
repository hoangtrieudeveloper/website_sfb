"use client";

import {
  ArrowRight,
  Play,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion"; // Add Framer Motion
import { ImageWithFallback } from "../figma/ImageWithFallback";
import Link from "next/link";
import { ScrollAnimation } from "../public/ScrollAnimation";

import { partners, heroData } from "./data";

export function HeroBanner() {

  return (
    <section
      id="home"
      className="relative w-full max-w-[1920px] mx-auto lg:h-[850px] flex items-start overflow-hidden bg-[#F4FAFE] pt-[171px] pb-20"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#006FB3]/20 rounded-full blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-[#0088D9]/20 rounded-full blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-[#006FB3]/15 rounded-full blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div className="space-y-8">
            <ScrollAnimation variant="blur-in" delay={0.2}>
              <h1
                className="text-[#0F172A] font-bold self-stretch"
                style={{
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontSize: "56px",
                  lineHeight: "normal",
                  fontFeatureSettings: "'liga' off, 'clig' off",
                }}
              >
                {heroData.title.line1}<br />
                {heroData.title.line2}<br />
                {heroData.title.line3}
              </h1>
            </ScrollAnimation>

            <ScrollAnimation variant="blur-in" delay={0.3}>
              <p
                className="text-[#0F172A]"
                style={{
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontSize: "16px",
                  lineHeight: "30px",
                  fontWeight: 400,
                  width: "486px",
                  height: "116px",
                  fontFeatureSettings: "'liga' off, 'clig' off",
                }}
              >
                {heroData.description}
              </p>
            </ScrollAnimation>

            <ScrollAnimation variant="blur-in" delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  href={heroData.primaryButton.link}
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
                  {heroData.primaryButton.text}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>

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
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#006FB3] to-[#0088D9] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play size={14} className="text-white ml-0.5" />
                  </div>
                  <span>{heroData.secondaryButton.text}</span>
                </button>
              </div>
            </ScrollAnimation>
          </div>

          {/* Right Image */}
          <ScrollAnimation
            variant="zoom-in"
            delay={0.3}
            duration={0.8}
            className="hidden lg:block"
          >
            <div
              className="relative overflow-hidden"
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
                src="/images/hero.png"
                alt="SFB Technology Office"
                className="w-full h-auto"
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
            className="relative mx-auto overflow-hidden mask-fade-x"
            style={{ width: "1120px", height: "64px", flexShrink: 0 }}
          >
            <div className="flex items-center gap-16 animate-partner-marquee hover:[animation-play-state:paused] h-full">
              {[...partners, ...partners].map((logo, idx) => (
                <motion.div
                  key={`${logo}-${idx}`}
                  className="flex items-center justify-center h-full"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: idx * 0.1, // Stagger effect: One at a time
                  }}
                >
                  <ImageWithFallback
                    src={logo}
                    alt="Đối tác SFB"
                    className="h-16 w-auto object-contain hover:scale-110 transition-transform duration-300"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
