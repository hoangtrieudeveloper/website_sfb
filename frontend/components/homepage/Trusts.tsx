"use client";

import Link from "next/link";
import { trustSectionData } from "./data";
import { ArrowRight } from "lucide-react";
import { ScrollAnimation } from "../public/ScrollAnimation";

export function Trusts() {

  return (
    <section className="bg-white py-24 overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
        <ScrollAnimation variant="fade-up" className="text-center mb-16">
          <span className="text-[#0088D9] font-bold text-sm tracking-widest uppercase mb-3 block">
            {trustSectionData.subHeader}
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0F172A] mb-4">
            {trustSectionData.title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {trustSectionData.description}
          </p>
        </ScrollAnimation>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Image */}
          <ScrollAnimation variant="slide-right" className="relative group">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <div className="aspect-[4/3] w-full relative">
                <img
                  src={trustSectionData.image}
                  alt="SFB Team Working"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Optional: Floating Stats Card or Deco */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-dots-pattern opacity-20" />
            </div>
          </ScrollAnimation>

          {/* Right Column - Content */}
          <div className="space-y-10">
            {trustSectionData.features.map((feature, idx) => (
              <ScrollAnimation
                key={idx}
                variant="flip-up"
                delay={idx * 0.1}
                className="flex-1 min-w-[300px]"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#006FB3] to-[#0088D9] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="text-white w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0F172A] mb-2 group-hover:text-[#006FB3] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                    {feature.description}
                  </p>
                </div>
              </ScrollAnimation>
            ))}

            <ScrollAnimation variant="fade-up" delay={0.4}>
              <Link
                href={trustSectionData.button.link}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#006FB3] to-[#0088D9] text-white font-semibold shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:-translate-y-1 transition-all duration-300 group"
              >
                <span>{trustSectionData.button.text}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </section>
  );
}