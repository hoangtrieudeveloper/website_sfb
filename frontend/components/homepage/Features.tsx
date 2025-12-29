"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import { ScrollAnimation } from "../public/ScrollAnimation";

const BTN_GRADIENT = "linear-gradient(73deg, #1D8FCF 32.85%, #2EABE2 82.8%)";

function FeatureImageFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      className="bg-white border border-slate-100"
      style={{
        width: "100%",
        maxWidth: 701,
        aspectRatio: "701 / 511",
        boxSizing: "border-box",
        borderRadius: 24,
        padding: 10,
      }}
    >
      <div
        className="w-full h-full"
        style={{
          borderRadius: 10,
          overflow: "hidden",
          clipPath: "inset(0 round 10px)",
        }}
      >
        <img
          src={src}
          alt={alt}
          className="block w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          style={{ borderRadius: 10 }}
        />
      </div>
    </div>
  );
}

function PrimaryLinkButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-all hover:brightness-110 active:brightness-95"
      style={{ background: BTN_GRADIENT }}
    >
      {children}
    </Link>
  );
}

import { featureData } from "./data";
export function Features() {

  return (
    <section
      className="relative overflow-hidden py-20 md:py-24 bg-[linear-gradient(180deg,#FFFFFF_0%,#F1F9FD_100%)]"
    >
      <div className="container mx-auto relative z-10 px-6">
        {/* HEADER */}
        <ScrollAnimation variant="blur-in" className="mx-auto mb-14 max-w-4xl text-center">
          <p className="mb-4 text-[15px] font-medium uppercase text-[#1D8FCF]">
            {featureData.header.sub}
          </p>

          <h2 className="text-[34px] sm:text-[44px] lg:text-[56px] font-bold text-[#0F172A]">
            {featureData.header.title}
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-[16px] leading-[26px] text-[#0F172A]">
            {featureData.header.description}
          </p>
        </ScrollAnimation>

        {/* BLOCK 1 */}
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <ScrollAnimation variant="slide-right" className="flex justify-center lg:justify-start">
            <FeatureImageFrame src={featureData.block1.image} alt="SFB overview" />
          </ScrollAnimation>

          <ScrollAnimation variant="slide-left" delay={0.1}>
            <div className="max-w-xl">
              <p className="text-slate-700 leading-relaxed">
                {featureData.block1.text}
              </p>

              <div className="mt-6 space-y-3">
                {featureData.block1.list.map((t, idx) => (
                  <ScrollAnimation
                    key={t}
                    variant="slide-left"
                    delay={0.1 + idx * 0.15}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors"
                  >
                    <CheckCircle className="h-5 w-5 text-sky-500" />
                    <span className="font-medium text-slate-800">{t}</span>
                  </ScrollAnimation>
                ))}
              </div>

              <div className="mt-7">
                <PrimaryLinkButton href={featureData.block1.button.link}>
                  {featureData.block1.button.text} <ArrowRight className="h-4 w-4" />
                </PrimaryLinkButton>
              </div>
            </div>
          </ScrollAnimation>
        </div>

        {/* BLOCK 2 */}
        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:items-center">
          <ScrollAnimation variant="slide-right">
            {/* ✅ bỏ shadow */}
            <div className="rounded-3xl bg-white border border-slate-100 p-8 hover:shadow-[0_0_40px_-10px_rgba(29,143,207,0.15)] transition-all duration-500">
              <div className="space-y-5">
                {featureData.block2.items.map((item, idx) => (
                  <ScrollAnimation
                    key={item.title}
                    variant="slide-right"
                    delay={idx * 0.15}
                    className="flex gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all duration-300 hover:scale-[1.02]"
                  >
                    <CheckCircle className="mt-0.5 h-5 w-5 text-sky-500 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-slate-900">{item.title}</p>
                      <p className="text-slate-600">{item.text}</p>
                    </div>
                  </ScrollAnimation>
                ))}
              </div>

              <div className="mt-7">
                <PrimaryLinkButton href={featureData.block2.button.link}>
                  {featureData.block2.button.text} <ArrowRight className="h-4 w-4" />
                </PrimaryLinkButton>
              </div>
            </div>
          </ScrollAnimation>

          <ScrollAnimation variant="slide-left" delay={0.1} className="flex justify-center lg:justify-end">
            <FeatureImageFrame src={featureData.block2.image} alt="Business tech" />
          </ScrollAnimation>
        </div>

        {/* BLOCK 3 */}
        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:items-center">
          <ScrollAnimation variant="zoom-in" className="flex justify-center lg:justify-start">
            <FeatureImageFrame src={featureData.block3.image} alt="Workflow" />
          </ScrollAnimation>

          <ScrollAnimation variant="zoom-in" delay={0.1}>
            {/* ✅ bỏ shadow */}
            <div className="rounded-3xl bg-white border border-slate-100 p-8 hover:shadow-[0_0_40px_-10px_rgba(29,143,207,0.15)] transition-all duration-500">
              <div className="space-y-5">
                {featureData.block3.items.map((item, idx) => (
                  <ScrollAnimation
                    key={item.title}
                    variant="slide-left"
                    delay={idx * 0.15}
                    className="flex gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all duration-300 hover:scale-[1.02]"
                  >
                    <CheckCircle className="mt-0.5 h-5 w-5 text-sky-500 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-slate-900">{item.title}</p>
                      <p className="text-slate-600">{item.text}</p>
                    </div>
                  </ScrollAnimation>
                ))}
              </div>

              <div className="mt-7">
                <PrimaryLinkButton href={featureData.block3.button.link}>
                  {featureData.block3.button.text} <ArrowRight className="h-4 w-4" />
                </PrimaryLinkButton>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
