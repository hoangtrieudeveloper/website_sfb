"use client";

import { ArrowRight } from "lucide-react";
import { successMetrics } from "./data";

export function FieldHero() {
    return (
        <section
            className="relative overflow-hidden"
            style={{
                width: '100%',
                height: '847px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'linear-gradient(31deg, #0870B4 51.21%, #2EABE2 97.73%)',
                paddingTop: '87px'
            }}
        >
            {/* Background patterns */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />

            {/* Glow effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-400/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[0%] right-[0%] w-[40%] h-[40%] bg-cyan-400/20 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10 h-full flex items-center justify-center">
                <div
                    className="flex flex-col lg:flex-row items-center justify-center w-full"
                    style={{ gap: '0' }}
                >
                    {/* Left Column: Image */}
                    <div className="relative order-2 lg:order-1 flex justify-center lg:justify-start lg:mr-[-55px] z-10">
                        <div className="relative" style={{ width: '991px', height: '782px', flexShrink: 0 }}>
                            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-full filter blur-3xl opacity-30 transform scale-75" />
                            {/* Responsive Image Placeholders */}
                            <div className="relative z-10 w-full h-full flex items-center justify-center">
                                <img
                                    src="/images/fieldhero.png"
                                    alt="Optimizing Business Operations"
                                    className="w-full h-full object-cover drop-shadow-2xl"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.parentElement?.classList.add('bg-white/5', 'border-2', 'border-dashed', 'border-white/20', 'rounded-xl');
                                        if (e.currentTarget.parentElement) e.currentTarget.parentElement.innerText = 'Illustration Space';
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Content */}
                    <div className="order-1 lg:order-2 text-white">
                        <h1
                            className="text-white mb-6"
                            style={{
                                width: '543px',
                                fontFamily: '"Plus Jakarta Sans", sans-serif',
                                fontSize: '56px',
                                lineHeight: 'normal',
                                fontFeatureSettings: "'liga' off, 'clig' off"
                            }}
                        >
                            <span className="font-bold">Giải pháp công nghệ tối ưu </span>
                            <span className="font-normal">vận hành doanh nghiệp</span>
                        </h1>

                        <p
                            className="mb-10"
                            style={{
                                width: '486px',
                                color: '#FFF',
                                fontFamily: '"Plus Jakarta Sans", sans-serif',
                                fontSize: '16px',
                                fontWeight: 400,
                                lineHeight: '26px'
                            }}
                        >
                            Hơn 8 năm xây dựng và phát triển, SFBTECH.,JSC đồng hành cùng nhiều
                            cơ quan Nhà nước và doanh nghiệp trong hành trình chuyển đổi số với
                            hàng trăm dự án triển khai thực tế.
                        </p>

                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-8 mb-12 border-t border-white/10 pt-8">
                            {successMetrics.slice(0, 3).map((metric, index) => (
                                <div key={index}>
                                    <div
                                        className="mb-2"
                                        style={{
                                            color: '#FFF',
                                            textAlign: 'center',
                                            fontFamily: '"Plus Jakarta Sans", sans-serif',
                                            fontSize: '26px',
                                            fontStyle: 'normal',
                                            fontWeight: 700,
                                            lineHeight: '38px',
                                            fontFeatureSettings: "'liga' off, 'clig' off"
                                        }}
                                    >
                                        {metric.value}
                                    </div>
                                    <div
                                        style={{
                                            color: '#FFF',
                                            textAlign: 'center',
                                            fontFamily: '"Plus Jakarta Sans", sans-serif',
                                            fontSize: '14px',
                                            fontStyle: 'normal',
                                            fontWeight: 400,
                                            lineHeight: '35px'
                                        }}
                                    >
                                        {metric.label === "Cơ quan Nhà nước & doanh nghiệp"
                                            ? "Cơ quan Nhà nước & DN"
                                            : metric.label}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <a
                            href="/solutions"
                            className="inline-flex items-center gap-3 transition-all hover:scale-105"
                            style={{
                                display: 'inline-flex',
                                height: '56px',
                                padding: '7px 30px',
                                alignItems: 'center',
                                gap: '12px',
                                borderRadius: '12px',
                                border: '1px solid #FFF',
                                background: 'linear-gradient(73deg, #1D8FCF 32.85%, #2EABE2 82.8%)',
                                color: '#FFF',
                                fontWeight: 700,
                            }}
                        >
                            KHÁM PHÁ GIẢI PHÁP
                            <ArrowRight size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
