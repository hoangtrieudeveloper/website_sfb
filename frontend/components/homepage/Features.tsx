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
          className="block w-full h-full object-cover"
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

import { purposeItems, advantages } from "./data";
export function Features() {

  return (
    <section
      className="relative overflow-hidden py-20 md:py-24 bg-[linear-gradient(180deg,#FFFFFF_0%,#F1F9FD_100%)]"
    >
      <div className="container mx-auto relative z-10 px-6">
        {/* HEADER */}
        <ScrollAnimation variant="fade-up" className="mx-auto mb-14 max-w-4xl text-center">
          <p className="mb-4 text-[15px] font-medium uppercase text-[#1D8FCF]">
            GIỚI THIỆU SFB
          </p>

          <h2 className="text-[34px] sm:text-[44px] lg:text-[56px] font-bold text-[#0F172A]">
            Chúng tôi là ai?
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-[16px] leading-[26px] text-[#0F172A]">
            Đơn vị phát triển phần mềm với kinh nghiệm thực chiến, chuyên sâu công nghệ và
            định hướng xây dựng hệ thống bền vững.
          </p>
        </ScrollAnimation>

        {/* BLOCK 1 */}
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <ScrollAnimation variant="fade-up" className="flex justify-center lg:justify-start">
            <FeatureImageFrame src="/images/feature1.png" alt="SFB overview" />
          </ScrollAnimation>

          <ScrollAnimation variant="fade-up" delay={0.1}>
            <div className="max-w-xl">
              <p className="text-slate-700 leading-relaxed">
                SFB với kinh nghiệm qua nhiều dự án lớn nhỏ, tự tin xử lý các bài toán phần mềm
                phức tạp, yêu cầu chuyên môn sâu. Đội ngũ trẻ – đam mê – trách nhiệm giúp xây
                dựng hệ thống ổn định, hiệu quả và tối ưu chi phí.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  "Tự tin trong các dự án phức tạp",
                  "Tối ưu quy trình và chi phí",
                  "Đồng hành trọn vòng đời sản phẩm",
                ].map((t) => (
                  <div key={t} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-sky-500" />
                    <span className="font-medium text-slate-800">{t}</span>
                  </div>
                ))}
              </div>

              <div className="mt-7">
                <PrimaryLinkButton href="/about">
                  Tìm hiểu thêm <ArrowRight className="h-4 w-4" />
                </PrimaryLinkButton>
              </div>
            </div>
          </ScrollAnimation>
        </div>

        {/* BLOCK 2 */}
        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:items-center">
          <ScrollAnimation variant="fade-up">
            {/* ✅ bỏ shadow */}
            <div className="rounded-3xl bg-white border border-slate-100 p-8">
              <div className="space-y-5">
                {advantages.map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-sky-500" />
                    <div>
                      <p className="font-bold text-slate-900">{item.title}</p>
                      <p className="text-slate-600">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-7">
                <PrimaryLinkButton href="/solutions">
                  Tìm hiểu cách SFB triển khai <ArrowRight className="h-4 w-4" />
                </PrimaryLinkButton>
              </div>
            </div>
          </ScrollAnimation>

          <ScrollAnimation variant="fade-up" delay={0.1} className="flex justify-center lg:justify-end">
            <FeatureImageFrame src="/images/feature2.png" alt="Business tech" />
          </ScrollAnimation>
        </div>

        {/* BLOCK 3 */}
        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:items-center">
          <ScrollAnimation variant="fade-up" className="flex justify-center lg:justify-start">
            <FeatureImageFrame src="/images/feature3.png" alt="Workflow" />
          </ScrollAnimation>

          <ScrollAnimation variant="fade-up" delay={0.1}>
            {/* ✅ bỏ shadow */}
            <div className="rounded-3xl bg-white border border-slate-100 p-8">
              <div className="space-y-5">
                {purposeItems.map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-sky-500" />
                    <div>
                      <p className="font-bold text-slate-900">{item.title}</p>
                      <p className="text-slate-600">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-7">
                <PrimaryLinkButton href="/contact">
                  Liên hệ với chúng tôi <ArrowRight className="h-4 w-4" />
                </PrimaryLinkButton>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
