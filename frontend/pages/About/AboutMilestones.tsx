"use client";

import { TrendingUp } from "lucide-react";
import { milestones } from "./data";
import { FadeIn, InViewSection } from "../../components/ui/motion";
import { motion, Variants } from "framer-motion";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { getLocalizedText } from "@/lib/utils/i18n";

interface AboutMilestonesProps {
    data?: any;
    locale?: 'vi' | 'en' | 'ja';
}

const cardVariants: Variants = {
    hidden: (isLeft: boolean) => ({
        opacity: 0,
        x: isLeft ? -50 : 50,
        transition: { duration: 0.2 }
    }),
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }
};

const badgeVariants: Variants = {
    hidden: { scale: 0, opacity: 0, transition: { duration: 0.2 } },
    visible: {
        scale: 1,
        opacity: 1,
        transition: { type: "spring", stiffness: 200, damping: 20 }
    }
};

const lineContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
};

const lineFillVariants: Variants = {
    hidden: { height: "0%", transition: { duration: 0.1 } },
    visible: {
        height: "100%",
        transition: { duration: 1.0, ease: "linear" }
    }
};

export function AboutMilestones({ data, locale: propLocale }: AboutMilestonesProps) {
    const { locale: contextLocale } = useLocale();
    const locale = (propLocale || contextLocale || 'vi') as 'vi' | 'en' | 'ja';

    // Use data from props if available, otherwise fallback to static data
    const displayData = data?.data || { items: milestones };
    const headerTitleRaw = displayData.headerTitle || "Hành trình phát triển";
    const headerDescriptionRaw = displayData.headerDescription || "Từ năm 2017 đến nay, SFB liên tục mở rộng đội ngũ, nâng cấp sản phẩm và chuẩn hóa dịch vụ để đồng hành cùng khách hàng lâu dài";
    const items = displayData.items || milestones;

    // Localize fields
    const headerTitle = typeof headerTitleRaw === 'string' ? headerTitleRaw : getLocalizedText(headerTitleRaw, locale);
    const headerDescription = typeof headerDescriptionRaw === 'string' ? headerDescriptionRaw : getLocalizedText(headerDescriptionRaw, locale);

    return (
        <section
            className="mx-auto w-full max-w-[1920px] flex justify-center items-start gap-[10px] py-10 lg:py-[120px] px-[10px] overflow-hidden"
            style={{
                background: "linear-gradient(254deg, rgba(128, 192, 228, 0.10) 1.7%, rgba(29, 143, 207, 0.10) 42.26%)"
            }}
        >
            <div className="mx-auto w-full max-w-[1920px] px-6 lg:px-[clamp(24px,7.8125vw,150px)]">
                <InViewSection className="mx-auto w-full max-w-[1340px]">
                    {/* Header */}
                    <FadeIn className="text-center mb-8 sm:mb-24 max-w-4xl mx-auto">
                        {headerTitle && (
                            <h2 className="text-[#0F172A] text-2xl sm:text-4xl md:text-5xl font-bold mb-4">
                                {headerTitle}
                            </h2>
                        )}
                        {headerDescription && (
                            <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                                {headerDescription}
                            </p>
                        )}
                    </FadeIn>

                    <div className="max-w-5xl mx-auto relative lg:min-h-[800px]">
                        <div className="space-y-12 lg:space-y-0 relative">
                            {items.filter((item: any) => item.isActive !== false).map((item: any, index: number) => {
                                const isLeft = index % 2 === 0;

                                // Localize item fields
                                const itemTitle = typeof item.title === 'string' ? item.title : getLocalizedText(item.title, locale);
                                const itemDescription = typeof item.description === 'string' ? item.description : getLocalizedText(item.description, locale);

                                return (
                                    <div key={index} className="relative lg:min-h-[300px] flex flex-col lg:flex-row items-center justify-center">
                                        {/* Mobile Year Badge */}
                                        <div className="lg:hidden mb-6 bg-[#2CA4E0] text-white px-6 py-2 rounded-full text-lg sm:text-xl font-bold shadow-lg">
                                            {item.year}
                                        </div>

                                        {/* Left Side */}
                                        <div className={`flex-1 w-full lg:w-auto flex ${isLeft ? 'justify-end lg:pr-[clamp(24px,8.333vw,160px)]' : 'justify-start lg:pl-[clamp(24px,8.333vw,160px)] order-last'}`}>
                                            <motion.div
                                                custom={isLeft}
                                                variants={cardVariants}
                                                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -10px rgba(44, 164, 224, 0.15)" }}
                                                className={`
                                                    relative z-10 transition-all duration-300 cursor-default flex flex-col
                                                    ${isLeft
                                                        ? 'bg-white rounded-[24px] border border-gray-200 lg:border-white lg:w-[402.667px] lg:p-[45px] lg:items-end lg:gap-[18px] lg:shadow-[0_12px_36px_0_rgba(59,90,136,0.12)] text-left lg:text-right p-5 sm:p-8 w-full max-w-lg'
                                                        : 'bg-white rounded-[24px] p-5 sm:p-8 shadow-none sm:shadow-sm max-w-lg w-full border border-gray-200 sm:border-transparent hover:border-blue-100 text-left lg:border-white lg:w-[402.667px] lg:p-[45px] lg:justify-center lg:items-start lg:gap-[18px] lg:shrink-0 lg:shadow-[0_12px_36px_0_rgba(59,90,136,0.12)]'
                                                    }
                                                `}
                                            >
                                                <div className="w-12 h-12 mb-4 flex items-center justify-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                                                        <g clipPath="url(#clip0_159_544)">
                                                            <path d="M0.000244141 36.6405C0.219336 36.3588 0.51146 36.2754 0.855748 36.2858C1.54432 36.2962 2.2329 36.2858 2.98407 36.2858C2.98407 36.1084 2.98407 35.9624 2.98407 35.8059C2.98407 33.0412 2.98407 30.2869 2.98407 27.5221C2.98407 26.8335 3.17187 26.6457 3.87088 26.6457C5.80097 26.6457 7.72064 26.6457 9.65074 26.6457C10.308 26.6457 10.4854 26.8231 10.4958 27.4699C10.4958 30.2347 10.4958 32.989 10.4958 35.7537C10.4958 35.9102 10.4958 36.0667 10.4958 36.2441C10.9444 36.2441 11.3722 36.2441 11.8312 36.2441C11.8312 36.0772 11.8312 35.9207 11.8312 35.7642C11.8312 31.7788 11.8312 27.7934 11.8312 23.8184C11.8312 23.0255 11.9773 22.8794 12.7493 22.8794C14.6586 22.8794 16.5782 22.8794 18.4875 22.8794C19.176 22.8794 19.343 23.0464 19.343 23.7245C19.343 27.7203 19.343 31.7162 19.343 35.712C19.343 35.8789 19.343 36.0459 19.343 36.2754C19.7499 36.2754 20.1254 36.2858 20.4906 36.2649C20.5532 36.2649 20.6367 36.1397 20.6575 36.0667C20.6888 35.9624 20.668 35.8372 20.668 35.712C20.668 30.1825 20.668 24.6426 20.668 19.1131C20.668 18.2576 20.8036 18.122 21.6695 18.122C23.5579 18.122 25.4463 18.122 27.3346 18.122C27.9919 18.122 28.1901 18.3202 28.1901 18.9879C28.1901 24.5592 28.1901 30.1304 28.1901 35.7016C28.1901 35.8685 28.1901 36.0354 28.1901 36.2336C28.6387 36.2336 29.0561 36.2336 29.5255 36.2336C29.5255 36.0563 29.5255 35.8894 29.5255 35.7224C29.5255 29.1497 29.5255 22.5769 29.5255 16.0041C29.5255 15.8476 29.5151 15.6911 29.536 15.5346C29.5673 15.1799 29.7551 14.9817 30.1098 14.9817C32.2173 14.9817 34.3247 14.9713 36.4322 14.9817C36.7973 14.9817 37.006 15.2216 37.0164 15.6181C37.0268 15.9311 37.0164 16.2441 37.0164 16.5571C37.0164 19.1131 37.0164 21.6588 37.0164 24.2149C37.0164 24.6948 36.8286 24.9556 36.4739 24.9869C36.14 25.0078 35.921 24.8721 35.8375 24.5383C35.8062 24.3922 35.8062 24.2253 35.8062 24.0688C35.8062 21.5962 35.8062 19.1236 35.8062 16.651C35.8062 16.4945 35.8062 16.3484 35.8062 16.171C34.0952 16.171 32.4155 16.171 30.7253 16.171C30.7253 22.8586 30.7253 29.5461 30.7253 36.2441C32.4155 36.2441 34.0848 36.2441 35.8062 36.2441C35.8062 36.0667 35.8062 35.9207 35.8062 35.7642C35.8062 33.0516 35.8062 30.3494 35.8062 27.6369C35.8062 27.5325 35.8062 27.4282 35.8062 27.3239C35.8166 26.8127 36.0357 26.531 36.4217 26.5414C36.8078 26.5518 37.0164 26.8335 37.0164 27.3448C37.0164 30.1408 37.0164 32.9473 37.0164 35.7433C37.0164 35.8998 37.0164 36.0563 37.0164 36.2649C37.6215 36.2649 38.2058 36.2649 38.79 36.2649C39.0091 36.2649 39.2386 36.2545 39.4577 36.2754C39.802 36.3171 40.0002 36.5153 40.0002 36.8701C40.0002 37.7047 40.0107 38.5393 40.0002 39.374C40.0002 39.76 39.7707 39.9582 39.3847 39.9686C39.3117 39.9686 39.2282 39.9686 39.1552 39.9686C29.4212 39.9686 19.6873 39.9686 9.9533 39.9686C9.8281 39.9686 9.69247 39.9895 9.56728 39.9582C9.26472 39.8852 9.08736 39.6974 9.09779 39.374C9.09779 39.0505 9.27515 38.8628 9.57771 38.8002C9.71334 38.7689 9.8594 38.7897 10.0055 38.7897C19.4369 38.7897 28.8787 38.7897 38.3101 38.7897C38.477 38.7897 38.644 38.7897 38.8213 38.7897C38.8213 38.3411 38.8213 37.9238 38.8213 37.4856C26.3018 37.4856 13.7718 37.4856 1.2209 37.4856C1.2209 37.9029 1.2209 38.3202 1.2209 38.7897C1.35653 38.7897 1.50259 38.7897 1.63822 38.7897C3.35966 38.7897 5.07067 38.7897 6.79211 38.7897C7.26159 38.7897 7.51198 38.9879 7.52241 39.3635C7.53285 39.7496 7.27202 39.9686 6.78167 39.9686C4.83071 39.9686 2.87974 39.9582 0.928778 39.9791C0.574057 39.9791 0.271501 39.9269 0.0211101 39.6557C0.000244141 38.6645 0.000244141 37.6525 0.000244141 36.6405ZM21.8782 19.3531C21.8782 24.9973 21.8782 30.6207 21.8782 36.2441C23.5788 36.2441 25.2585 36.2441 26.9382 36.2441C26.9382 30.5894 26.9382 24.9765 26.9382 19.3531C25.2376 19.3531 23.5579 19.3531 21.8782 19.3531ZM13.0519 24.0688C13.0519 28.1585 13.0519 32.2065 13.0519 36.2545C14.7525 36.2545 16.4217 36.2545 18.091 36.2545C18.091 32.1752 18.091 28.1272 18.091 24.0688C16.4113 24.0688 14.742 24.0688 13.0519 24.0688ZM4.2256 27.8873C4.2256 30.7042 4.2256 33.4793 4.2256 36.2649C5.9366 36.2649 7.60588 36.2649 9.27515 36.2649C9.27515 33.4585 9.27515 30.6833 9.27515 27.8873C7.58501 27.8873 5.91574 27.8873 4.2256 27.8873Z" fill="url(#paint0_linear_159_544)" />
                                                            <path d="M35.5347 0C36.6197 0.375587 37.0371 1.14763 37.0162 2.27439C36.9745 4.12102 37.0058 5.96766 37.0058 7.82473C37.0058 8.59677 36.8493 8.75326 36.0668 8.75326C35.3678 8.75326 34.6583 8.75326 33.9593 8.75326C33.5107 8.75326 33.2916 8.53417 33.2812 8.08555C33.2708 7.54304 33.2812 7.00052 33.2812 6.37454C33.1247 6.52061 33.0204 6.60407 32.9265 6.69797C31.1216 8.50287 29.3062 10.2973 27.5222 12.1127C27.0005 12.6448 26.4163 12.8847 25.6756 12.8743C24.2462 12.8534 22.8169 12.8638 21.3772 12.8847C21.1894 12.8847 20.9494 12.989 20.8138 13.1247C18.6124 15.5034 16.4007 17.8717 14.2515 20.2921C13.5629 21.0642 12.8221 21.4189 11.7788 21.398C9.11844 21.3563 6.46847 21.3876 3.80806 21.3876C3.06732 21.3876 2.90039 21.2102 2.90039 20.4591C2.90039 19.7913 2.90039 19.1341 2.90039 18.4664C2.90039 17.8717 3.10905 17.6526 3.6933 17.6526C4.85136 17.6526 6.00942 17.6526 7.16747 17.6526C7.57436 17.6526 7.84562 17.903 7.85605 18.2473C7.85605 18.602 7.60566 18.8211 7.17791 18.8419C7.08401 18.8419 7.00055 18.8419 6.90665 18.8419C6.12418 18.8419 5.34171 18.8419 4.55923 18.8419C4.43404 18.8419 4.29841 18.8419 4.14191 18.8419C4.14191 19.2801 4.14191 19.6974 4.14191 20.1565C4.26711 20.1669 4.40274 20.1774 4.53837 20.1774C7.07358 20.1774 9.61922 20.1774 12.1544 20.1878C12.5509 20.1878 12.8326 20.073 13.1038 19.7705C15.4408 17.204 17.7987 14.6479 20.1357 12.0814C20.4173 11.7788 20.7095 11.6536 21.1268 11.6536C22.6709 11.6745 24.2254 11.6536 25.7695 11.6641C26.1242 11.6641 26.385 11.5597 26.6354 11.3093C28.8159 9.10798 31.0068 6.92749 33.1977 4.73657C33.2708 4.66354 33.3334 4.55921 33.4168 4.52791C33.6359 4.45488 33.9072 4.30882 34.0741 4.38185C34.2515 4.45488 34.4288 4.73657 34.4393 4.94523C34.481 5.67553 34.4601 6.40584 34.4601 7.13615C34.4601 7.27178 34.4601 7.41784 34.4601 7.57433C34.9192 7.57433 35.3261 7.57433 35.7642 7.57433C35.7747 7.43871 35.7851 7.31351 35.7851 7.18832C35.7851 5.49817 35.7851 3.80803 35.7851 2.10746C35.7851 1.39802 35.5765 1.18936 34.8566 1.18936C33.1873 1.18936 31.5285 1.18936 29.8592 1.18936C29.734 1.18936 29.5984 1.18936 29.4523 1.18936C29.4523 1.63798 29.4523 2.05529 29.4523 2.52478C30.2035 2.52478 30.9338 2.52478 31.6745 2.52478C31.8206 2.52478 31.9875 2.48305 32.1023 2.53521C32.3005 2.62911 32.5405 2.7543 32.6135 2.93166C32.6865 3.08816 32.5718 3.33855 32.4987 3.53678C32.4674 3.64111 32.3422 3.7037 32.2588 3.78717C30.193 5.8529 28.1377 7.90819 26.0824 9.97392C25.8216 10.2347 25.5504 10.3495 25.1852 10.3495C23.6098 10.3391 22.0345 10.3495 20.4591 10.3391C20.0939 10.3391 19.8227 10.4538 19.5723 10.7251C17.2144 13.3125 14.8461 15.8894 12.4883 18.4768C12.2379 18.748 11.9771 18.8837 11.6119 18.8732C11.0903 18.8524 10.5686 18.8732 10.047 18.8628C9.65052 18.8524 9.40013 18.6228 9.37926 18.289C9.36883 17.9551 9.65052 17.6839 10.047 17.6734C10.3182 17.663 10.5999 17.6421 10.8607 17.6734C11.4137 17.7465 11.758 17.517 12.1231 17.1101C14.3036 14.6896 16.5154 12.3109 18.7063 9.90089C19.1863 9.36881 19.7496 9.12885 20.4591 9.13928C21.9406 9.16015 23.422 9.14971 24.914 9.13928C25.0704 9.13928 25.2791 9.06625 25.3939 8.96192C27.0736 7.30308 28.7324 5.6338 30.4017 3.96453C30.4539 3.91236 30.4956 3.84977 30.6208 3.71414C30.0678 3.71414 29.5879 3.71414 29.1184 3.71414C28.3986 3.71414 28.2316 3.54721 28.2316 2.8482C28.2316 2.18049 28.2421 1.52321 28.2316 0.855503C28.2212 0.511215 28.3047 0.219092 28.5864 0.010433C30.9025 0 33.2186 0 35.5347 0Z" fill="url(#paint1_linear_159_544)" />
                                                        </g>
                                                        <defs>
                                                            <linearGradient id="paint0_linear_159_544" x1="18.0543" y1="41.7292" x2="39.0832" y2="31.3644" gradientUnits="userSpaceOnUse">
                                                                <stop stopColor="#1D8FCF" />
                                                                <stop offset="1" stopColor="#2EABE2" />
                                                            </linearGradient>
                                                            <linearGradient id="paint1_linear_159_544" x1="18.2971" y1="22.8968" x2="36.256" y2="14.0769" gradientUnits="userSpaceOnUse">
                                                                <stop stopColor="#1D8FCF" />
                                                                <stop offset="1" stopColor="#2EABE2" />
                                                            </linearGradient>
                                                            <clipPath id="clip0_159_544">
                                                                <rect width="39.9896" height="40" fill="white" />
                                                            </clipPath>
                                                        </defs>
                                                    </svg>
                                                </div>
                                                {item.year && (
                                                    <div className="mb-2 lg:hidden">
                                                        <span className="text-[#2CA4E0] font-bold text-lg">{item.year}</span>
                                                    </div>
                                                )}
                                                <h3 className={`text-[#0F172A] font-bold text-lg mb-3 ${isLeft ? 'lg:text-right' : 'lg:text-left'} lg:w-[236px] [font-feature-settings:'liga'_off,'clig'_off] font-['Plus_Jakarta_Sans'] lg:text-[20px] lg:font-semibold lg:leading-[30px]`}>
                                                    {itemTitle}
                                                </h3>
                                                <p className={`text-gray-500 text-sm leading-relaxed ${isLeft ? 'lg:text-right' : 'lg:text-left'} lg:w-[322px] lg:text-[#0F172A] lg:text-[16px] lg:font-normal lg:leading-[26px] lg:font-['Plus_Jakarta_Sans']`}>
                                                    {itemDescription}
                                                </p>
                                            </motion.div>
                                        </div>

                                        {/* Center Year Badge (Desktop only) */}
                                        <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center justify-center z-20 flex-col">
                                            <div style={{ transform: index === 1 || index === 3 ? 'translateX(-80px)' : index === 2 ? 'translateX(80px)' : 'none' }}>
                                                <motion.div
                                                    variants={badgeVariants}
                                                    className="flex h-[65px] px-[15px] py-[12px] justify-center items-center gap-[8px] rounded-[100px] bg-[linear-gradient(73deg,#1D8FCF_32.85%,#2EABE2_82.8%)] text-[#EFF6FF] text-[32px] sm:text-[40px] lg:text-[56px] font-[300] font-['Plus_Jakarta_Sans'] [font-feature-settings:'liga'_off,'clig'_off] leading-normal shadow-md whitespace-nowrap relative z-20"
                                                >
                                                    {item.year}
                                                </motion.div>
                                            </div>

                                            {/* Connecting Line to next item */}
                                            {index < items.filter((i: any) => i.isActive !== false).length - 1 && (
                                                <motion.div
                                                    variants={lineContainerVariants}
                                                    className="absolute top-full left-1/2 -translate-x-1/2 w-[2px] h-[285px] z-10"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="2" height="285" viewBox="0 0 2 285" fill="none">
                                                        <motion.path
                                                            d="M0.75 0L0.749988 285"
                                                            stroke={`url(#paint0_linear_159_476_${index})`}
                                                            strokeWidth="1.5"
                                                            initial={{ pathLength: 0 }}
                                                            whileInView={{ pathLength: 1 }}
                                                            viewport={{ once: true, margin: "-100px" }}
                                                            transition={{ duration: 1.0, ease: "linear" }}
                                                        />
                                                        <defs>
                                                            <linearGradient id={`paint0_linear_159_476_${index}`} x1="1.20129" y1="304.95" x2="1.85465" y2="304.949" gradientUnits="userSpaceOnUse">
                                                                <stop stopColor="#1D8FCF" />
                                                                <stop offset="1" stopColor="#2EABE2" />
                                                            </linearGradient>
                                                        </defs>
                                                    </svg>
                                                </motion.div>
                                            )}
                                        </div>

                                        {/* Right Side Spacer/Content */}
                                        <div className={`flex-1 hidden lg:block ${isLeft ? 'pl-[clamp(24px,8.333vw,160px)]' : 'pr-[clamp(24px,8.333vw,160px)]'}`}></div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </InViewSection>
            </div>
        </section>
    );
}

// Default export để tránh lỗi Next.js build
export default AboutMilestones;
