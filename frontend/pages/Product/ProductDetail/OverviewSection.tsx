import StepBadge from "@/components/product_detail_icon/StepBadge";
import { ProductDetail } from "./data";

interface OverviewSectionProps {
    product: ProductDetail;
}

export function OverviewSection({ product }: OverviewSectionProps) {
    return (
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
                                    background:
                                        "linear-gradient(237deg, rgba(128, 192, 228, 0.10) 7%, rgba(29, 143, 207, 0.10) 71.94%)",
                                }}
                            >
                                <div className="flex justify-center mb-3">
                                    <StepBadge step={c.step} />
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
