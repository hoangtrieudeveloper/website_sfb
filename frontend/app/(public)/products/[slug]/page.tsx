import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Play } from "lucide-react";
import { ImageWithFallback } from "../../../../components/figma/ImageWithFallback";
import { Consult } from "../../../../components/public/Consult";
import { Footer } from "../../../../components/public/Footer";
import { getProductBySlug, productDetails } from "./product-details";
import StepBadge from "@/components/product_detail_icon/StepBadge";



export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = getProductBySlug(slug);
  if (!product) return notFound();

  const sec1 = product.numberedSections.find((s) => s.no === 1);
  const sec2 = product.numberedSections.find((s) => s.no === 2);
  const sec4 = product.numberedSections.find((s) => s.no === 4);
  const sec5 = product.numberedSections.find((s) => s.no === 5);

  return (
    <div className="bg-white">
     
     {/* ẢNH 1: HERO (Figma spacing) */}
<section className="w-full">
  <div className="bg-[linear-gradient(31deg,#0870B4_51.21%,#2EABE2_97.73%)]">
    <div className="mx-auto w-full max-w-[1920px] px-6 lg:px-[243px] pt-[120px] sm:pt-[160px] lg:pt-[194.5px] pb-[80px] sm:pb-[110px] lg:pb-[127.5px]">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 lg:gap-[98px]">
        {/* LEFT */}
        <div className="text-white flex flex-col items-start gap-[29px] w-full lg:w-[486px]">
          <div
            className="text-white uppercase font-medium text-[16px]"
            style={{ fontFeatureSettings: "'liga' off, 'clig' off" }}
          >
            {product.metaTop}
          </div>

          <h1
            className="text-[32px] sm:text-[44px] lg:text-[56px] leading-[normal] font-extrabold w-full lg:w-[543px]"
            style={{ fontFeatureSettings: "'liga' off, 'clig' off" }}
          >
            {product.name}
          </h1>

          <p className="text-white/85 text-[14px] leading-[22px]">
            {product.heroDescription}
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
            <Link
              href="/contact"
              className="h-[48px] px-6 rounded-xl bg-white text-[#0B78B8] font-semibold text-[16px]
                         inline-flex items-center gap-2 hover:bg-white/90 transition"
            >
              LIÊN HỆ NGAY <ArrowRight size={18} />
            </Link>

            <a
              href="#demo"
              className="h-[48px] px-6 rounded-xl border border-white/80 text-white font-semibold text-[16px]
                         inline-flex items-center gap-3 hover:bg-white/10 transition"
            >
              DEMO HỆ THỐNG
              <span className="w-7 h-7 rounded-full border border-white/70 flex items-center justify-center">
                <Play size={14} className="ml-[1px]" />
              </span>
            </a>
          </div>
        </div>

        {/* RIGHT (Ảnh đúng kích thước Figma) */}
        <div className="w-full lg:w-auto shrink-0 flex justify-center lg:justify-start">
          <div className="w-full max-w-[701px] aspect-[701/511] lg:w-[701px] lg:h-[511px] rounded-[24px] border-[6px] lg:border-[10px] border-white bg-white
                          shadow-[0_18px_36px_rgba(15,23,42,0.12)] overflow-hidden">
            <ImageWithFallback
              src={product.heroImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


 


<section className="w-full">
  <div className="w-full max-w-[1920px] mx-auto px-6 lg:px-[120px] py-[90px] flex justify-center">
    <div className="flex flex-col items-start gap-[60px] w-full lg:w-[1340px]">
   
      <div className="w-full text-center space-y-4">
       <div
  className="
    w-full
    text-center
    text-[#1D8FCF]
    uppercase
    font-plus-jakarta
    text-[15px]
    font-medium
    leading-normal
    tracking-widest
    [font-feature-settings:'liga'_off,'clig'_off]
  "
>
  {product.overviewKicker}
</div>

        <h2
  className="
    mx-auto
    max-w-[840px]
    text-center
    text-[#0F172A]
    font-plus-jakarta
    text-[32px] sm:text-[44px] lg:text-[56px]
    font-bold
    leading-normal
    [font-feature-settings:'liga'_off,'clig'_off]
  "
>
  {product.overviewTitle}
</h2>

      </div>

   
      <div className="flex justify-center items-start content-start gap-[18px] flex-wrap w-full lg:w-[1340px] h-auto lg:h-[458px]">
        {product.overviewCards.map((c, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center gap-3 w-full max-w-[433px] lg:w-[433px] px-6 py-8 rounded-xl border border-white"
            style={{
              background: 'linear-gradient(237deg, rgba(128, 192, 228, 0.10) 7%, rgba(29, 143, 207, 0.10) 71.94%)'
            }}
          >
           
            <div className="flex justify-center mb-3">
              <StepBadge step={c.step} />
            </div>

            <div className="text-[#0B78B8] font-semibold text-center">{c.title}</div>
            <div className="text-gray-600 text-sm leading-relaxed text-center">{c.desc}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>


<section className="w-full bg-white">
  <div className="w-full max-w-[1920px] mx-auto px-6 lg:px-[120px]">
    <div className="flex flex-col lg:flex-row items-center justify-center gap-[90px] py-[90px] lg:h-[567px]">
     
      <div className="relative w-full lg:w-auto flex justify-center lg:justify-start">
       
        {product.showcase.overlay ? (
          <div className="relative w-[701px] h-[511px] scale-[0.48] sm:scale-[0.65] md:scale-[0.85] lg:scale-100 origin-top">
          
            <div className={product.showcase.overlay.back.frameClass ?? ""}>
              <ImageWithFallback
                src={product.showcase.overlay.back.src}
                alt={product.showcase.overlay.back.alt ?? product.showcase.title}
                className="w-full h-full object-contain"
              />
            </div>

            
            <div
              className={`${product.showcase.overlay.front.positionClass ?? ""} ${
                product.showcase.overlay.front.frameClass ?? ""
              }`}
            >
              <ImageWithFallback
                src={product.showcase.overlay.front.src}
                alt={product.showcase.overlay.front.alt ?? product.showcase.title}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        ) : (
          // Nếu chỉ có 1 ảnh (sản phẩm khác vẫn dùng được)
          <div className={product.showcase.single?.frameClass ?? ""}>
            <ImageWithFallback
              src={product.showcase.single?.src ?? "/images/placeholder.png"}
              alt={product.showcase.single?.alt ?? product.showcase.title}
              className="w-full h-full object-contain"
            />
          </div>
        )}
      </div>

      {/* RIGHT: Text */}
     <div className="flex w-full max-w-[549px] flex-col items-start gap-6">
        <h3 className="text-gray-900 text-2xl font-bold">{product.showcase.title}</h3>
        <p className="text-gray-600 leading-relaxed">{product.showcase.desc}</p>

        <div className="space-y-3">
          {product.showcase.bullets.map((b, i) => (
            <div key={i} className="flex items-start gap-3">
              <CheckCircle2 size={18} className="text-[#0B78B8] mt-0.5" />
              <span className="text-gray-700">{b}</span>
            </div>
          ))}
        </div>

        {product.showcase.ctaHref && (
          <Link
            href={product.showcase.ctaHref}
            className="inline-flex items-center gap-2 h-[42px] px-5 rounded-lg bg-[#2EABE2] text-white font-semibold hover:opacity-90 transition"
          >
            {product.showcase.ctaText ?? "Liên hệ"} <ArrowRight size={18} />
          </Link>
        )}
      </div>
    </div>
  </div>
</section>



      
      <section className="w-full bg-white">
        <div className="w-full max-w-[1920px] mx-auto px-6 lg:px-[120px] py-[90px] space-y-[90px]">
          {sec1 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className={sec1.imageSide === "left" ? "order-1" : "order-2 lg:order-2"}>
                <div className="w-full flex justify-center lg:justify-start">
                  <div className="relative w-[701px] h-[511px] scale-[0.48] sm:scale-[0.65] md:scale-[0.85] lg:scale-100 origin-top">
                    <div
                      className={`w-[701px] h-[511px] ${
                        sec1.overlay?.back.frameClass ??
                        "rounded-[24px] border-[10px] border-white bg-white shadow-[0_18px_36px_rgba(15,23,42,0.12)] overflow-hidden"
                      }`}
                    >
                      <ImageWithFallback
                        src={sec1.overlay?.back.src ?? sec1.image}
                        alt={sec1.overlay?.back.alt ?? sec1.imageAlt ?? sec1.title}
                        className={`w-full h-full ${sec1.overlay?.back.objectClass ?? "object-cover"}`}
                      />
                    </div>

                    {sec1.overlay?.front && (
                      <div
                        className={
                          `${sec1.overlay.front.positionClass ?? "absolute left-[183.5px] bottom-0"} ` +
                          `${sec1.overlay.front.frameClass ?? "rounded-[24px] bg-white shadow-[0_18px_36px_rgba(15,23,42,0.12)] overflow-hidden"} ` +
                          `${sec1.overlay.front.sizeClass}`
                        }
                      >
                        <ImageWithFallback
                          src={sec1.overlay.front.src}
                          alt={sec1.overlay.front.alt ?? sec1.imageAlt ?? sec1.title}
                          className={`w-full h-full ${sec1.overlay.front.objectClass ?? "object-cover"}`}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={sec1.imageSide === "left" ? "order-2" : "order-1 lg:order-1"}>
                <div className="text-gray-900 text-xl md:text-2xl font-bold mb-4">
                  {sec1.no}. {sec1.title}
                </div>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  {sec1.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {sec2 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className={sec2.imageSide === "left" ? "order-1" : "order-2 lg:order-2"}>
                <div className="w-full flex justify-center lg:justify-start">
                  <div className="relative w-[701px] h-[511px] scale-[0.48] sm:scale-[0.65] md:scale-[0.85] lg:scale-100 origin-top">
                    <div
                      className={`w-[701px] h-[511px] ${
                        sec2.overlay?.back.frameClass ??
                        "rounded-[24px] border-[10px] border-white bg-white shadow-[0_18px_36px_rgba(15,23,42,0.12)] overflow-hidden"
                      }`}
                    >
                      <ImageWithFallback
                        src={sec2.overlay?.back.src ?? sec2.image}
                        alt={sec2.overlay?.back.alt ?? sec2.imageAlt ?? sec2.title}
                        className={`w-full h-full ${sec2.overlay?.back.objectClass ?? "object-cover"}`}
                      />
                    </div>

                    {sec2.overlay?.front && (
                      <div
                        className={
                          `${sec2.overlay.front.positionClass ?? "absolute left-[183.5px] bottom-0"} ` +
                          `${sec2.overlay.front.frameClass ?? "rounded-[24px] bg-white shadow-[0_18px_36px_rgba(15,23,42,0.12)] overflow-hidden"} ` +
                          `${sec2.overlay.front.sizeClass}`
                        }
                      >
                        <ImageWithFallback
                          src={sec2.overlay.front.src}
                          alt={sec2.overlay.front.alt ?? sec2.imageAlt ?? sec2.title}
                          className={`w-full h-full ${sec2.overlay.front.objectClass ?? "object-cover"}`}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={sec2.imageSide === "left" ? "order-2" : "order-1 lg:order-1"}>
                <div className="text-gray-900 text-xl md:text-2xl font-bold mb-4">
                  {sec2.no}. {sec2.title}
                </div>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  {sec2.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {sec4 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className={sec4.imageSide === "left" ? "order-1" : "order-2 lg:order-2"}>
                <div className="w-full flex justify-center lg:justify-start">
                  <div className="relative w-[701px] h-[511px] scale-[0.48] sm:scale-[0.65] md:scale-[0.85] lg:scale-100 origin-top">
                    <div
                      className={`w-[701px] h-[511px] ${
                        sec4.overlay?.back.frameClass ??
                        "rounded-[24px] border-[10px] border-white bg-white shadow-[0_18px_36px_rgba(15,23,42,0.12)] overflow-hidden"
                      }`}
                    >
                      <ImageWithFallback
                        src={sec4.overlay?.back.src ?? sec4.image}
                        alt={sec4.overlay?.back.alt ?? sec4.imageAlt ?? sec4.title}
                        className={`w-full h-full ${sec4.overlay?.back.objectClass ?? "object-cover"}`}
                      />
                    </div>

                    {sec4.overlay?.front && (
                      <div
                        className={
                          `${sec4.overlay.front.positionClass ?? "absolute left-[183.5px] bottom-0"} ` +
                          `${sec4.overlay.front.frameClass ?? "rounded-[24px] bg-white shadow-[0_18px_36px_rgba(15,23,42,0.12)] overflow-hidden"} ` +
                          `${sec4.overlay.front.sizeClass}`
                        }
                      >
                        <ImageWithFallback
                          src={sec4.overlay.front.src}
                          alt={sec4.overlay.front.alt ?? sec4.imageAlt ?? sec4.title}
                          className={`w-full h-full ${sec4.overlay.front.objectClass ?? "object-cover"}`}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={sec4.imageSide === "left" ? "order-2" : "order-1 lg:order-1"}>
                <div className="text-gray-900 text-xl md:text-2xl font-bold mb-4">
                  {sec4.no}. {sec4.title}
                </div>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  {sec4.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {sec5 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className={sec5.imageSide === "left" ? "order-1" : "order-2 lg:order-2"}>
                <div className="w-full flex justify-center lg:justify-start">
                  <div className="relative w-[701px] h-[511px] scale-[0.48] sm:scale-[0.65] md:scale-[0.85] lg:scale-100 origin-top">
                    <div
                      className={`w-[701px] h-[511px] ${
                        sec5.overlay?.back.frameClass ??
                        "rounded-[24px] border-[10px] border-white bg-white shadow-[0_18px_36px_rgba(15,23,42,0.12)] overflow-hidden"
                      }`}
                    >
                      <ImageWithFallback
                        src={sec5.overlay?.back.src ?? sec5.image}
                        alt={sec5.overlay?.back.alt ?? sec5.imageAlt ?? sec5.title}
                        className={`w-full h-full ${sec5.overlay?.back.objectClass ?? "object-cover"}`}
                      />
                    </div>

                    {sec5.overlay?.front && (
                      <div
                        className={
                          `${sec5.overlay.front.positionClass ?? "absolute left-[183.5px] bottom-0"} ` +
                          `${sec5.overlay.front.frameClass ?? "rounded-[24px] bg-white shadow-[0_18px_36px_rgba(15,23,42,0.12)] overflow-hidden"} ` +
                          `${sec5.overlay.front.sizeClass}`
                        }
                      >
                        <ImageWithFallback
                          src={sec5.overlay.front.src}
                          alt={sec5.overlay.front.alt ?? sec5.imageAlt ?? sec5.title}
                          className={`w-full h-full ${sec5.overlay.front.objectClass ?? "object-cover"}`}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={sec5.imageSide === "left" ? "order-2" : "order-1 lg:order-1"}>
                <div className="text-gray-900 text-xl md:text-2xl font-bold mb-4">
                  {sec5.no}. {sec5.title}
                </div>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  {sec5.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="w-full bg-white">
        <div className="w-full max-w-[1920px] mx-auto px-6 lg:px-[120px] py-[90px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <h3 className="text-gray-900 text-2xl font-bold">{product.expandTitle}</h3>

              <div className="space-y-3">
                {product.expandBullets.map((b, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-[#0B78B8] mt-0.5" />
                    <span className="text-gray-700">{b}</span>
                  </div>
                ))}
              </div>

              <a
                href={product.expandCtaHref}
                className="inline-flex items-center gap-2 h-[44px] px-5 rounded-lg bg-[#2EABE2] text-white font-semibold hover:opacity-90 transition"
              >
                {product.expandCtaText} <ArrowRight size={18} />
              </a>
            </div>

            <div>
              <div className="rounded-2xl bg-white border border-gray-100 shadow-[0_14px_40px_rgba(0,0,0,0.08)] overflow-hidden">
                <div className="relative aspect-[16/9]">
                  <ImageWithFallback
                    src={product.expandImage}
                    alt={product.expandTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div id="demo" />
      <Consult />
    </div>
  );
}


export function generateStaticParams() {
  return productDetails.map((p) => ({ slug: p.slug }));
}
