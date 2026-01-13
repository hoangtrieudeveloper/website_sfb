import StepBadge from "@/components/product_detail_icon/StepBadge";
import { ProductDetail } from "./data";

interface OverviewSectionProps {
    product: ProductDetail;
}

export function OverviewSection({ product }: OverviewSectionProps) {
    return (
        <section className="w-full">
            <div className="w-full max-w-[1920px] mx-auto px-6 lg:px-[120px] py-[45px] flex justify-center">
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
                                    background:
                                        "linear-gradient(237deg, rgba(128, 192, 228, 0.10) 7%, rgba(29, 143, 207, 0.10) 71.94%)",
                                }}
                            >
                                <div className="flex justify-center mb-3">
                                    <div
                                        className="relative flex items-center justify-center flex-shrink-0"
                                        style={{
                                            width: '42px',
                                            padding: '6px 0',
                                            flexDirection: 'column',
                                            gap: '10px',
                                            borderRadius: '100px',
                                            border: '1.5px solid var(--Linear, #1D8FCF)',
                                        }}
                                    >
                                        <div
                                            className="absolute"
                                            style={{
                                                display: 'flex',
                                                padding: '3.771px',
                                                alignItems: 'center',
                                                gap: '6.857px',
                                                right: '-4.546px',
                                                top: '-5.455px',
                                                borderRadius: '685.714px',
                                                background: '#E5F2FA'
                                            }}
                                        >
                                            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '16.457px', height: '16.457px' }}>
                                                <path d="M1.60121 7.08803C1.38641 6.88939 1.50309 6.53028 1.79363 6.49584L5.91037 6.00755C6.02878 5.99351 6.13163 5.91915 6.18157 5.81087L7.91795 2.04645C8.0405 1.78078 8.41818 1.78072 8.54072 2.0464L10.2771 5.81079C10.327 5.91907 10.4292 5.99363 10.5476 6.00767L14.6646 6.49584C14.9551 6.53028 15.0715 6.88949 14.8567 7.08814L11.8134 9.90298C11.7259 9.98394 11.6869 10.1044 11.7101 10.2214L12.5178 14.2875C12.5748 14.5744 12.2694 14.7968 12.0141 14.6539L8.39677 12.6285C8.29272 12.5702 8.16631 12.5705 8.06226 12.6288L4.44451 14.6533C4.18922 14.7963 3.88326 14.5744 3.94028 14.2875L4.74808 10.2216C4.77132 10.1047 4.73244 9.98391 4.6449 9.90296L1.60121 7.08803Z" fill={`url(#paint0_linear_${idx})`} />
                                                <defs>
                                                    <linearGradient id={`paint0_linear_${idx}`} x1="7.57267" y1="15.598" x2="15.5458" y2="13.0224" gradientUnits="userSpaceOnUse">
                                                        <stop stopColor="#1D8FCF" />
                                                        <stop offset="1" stopColor="#2EABE2" />
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                        </div>
                                        <span
                                            style={{
                                                fontFeatureSettings: "'liga' off, 'clig' off",
                                                fontFamily: '"Plus Jakarta Sans"',
                                                fontSize: '20px',
                                                fontStyle: 'normal',
                                                fontWeight: 600,
                                                lineHeight: '30px',
                                                background: 'var(--Linear, linear-gradient(73deg, #1D8FCF 32.85%, #2EABE2 82.8%))',
                                                backgroundClip: 'text',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                            }}
                                        >
                                            {c.step}
                                        </span>
                                    </div>
                                </div>

                                <div className="text-[#0B78B8] font-semibold text-center">
                                    {c.title}
                                </div>
                                <div className="text-gray-600 text-sm leading-relaxed text-center">
                                    {c.desc}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

// Default export để tránh lỗi Next.js build (file này là component, không phải page)
export default function OverviewSectionPage() {
    return null;
}