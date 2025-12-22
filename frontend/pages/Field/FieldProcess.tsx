"use client";

import { Sparkles, CheckCircle2, ArrowRight, Phone, FileText } from "lucide-react";
import { processSteps } from "./data";

export function FieldProcess() {
    return (
        <section className="py-24 bg-gradient-to-b from-white via-slate-50 to-blue-50/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a06_1px,transparent_1px),linear-gradient(to_bottom,#0f172a06_1px,transparent_1px)] bg-[size:24px_24px]" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-20 max-w-3xl mx-auto">
                    <div className="inline-block mb-4">
                        <span className="text-sm font-bold text-blue-500 uppercase tracking-wider">
                            LỘ TRÌNH ĐỒNG HÀNH CÙNG SFB
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                        Vì sao SFB phù hợp cho <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">nhiều</span> <br />
                        <span className="text-gray-900">lĩnh vực khác nhau</span>
                    </h2>
                </div>

                {/* Steps */}
                <div className="flex flex-col gap-24">
                    {processSteps.map((step, index) => {
                        const isEven = index % 2 !== 0; // 0 (odd visual) -> Image Left, 1 (even visual) -> Image Right? 
                        // Wait, screenshot: 
                        // Item 1: Image Left
                        // Item 2: Image Right
                        // Item 3: Image Left
                        // So index 0 (Item 1) -> Image Left. index 1 (Item 2) -> Image Right.

                        return (
                            <div
                                key={step.id}
                                className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
                            >
                                {/* Image Column */}
                                <div className="w-full lg:w-1/2">
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-blue-500/5 rounded-[2rem] transform rotate-3 scale-105 transition-transform group-hover:rotate-6 duration-500" />
                                        <div className="relative rounded-[2rem] overflow-hidden bg-white p-3 shadow-2xl border border-gray-100">
                                            <div className="relative aspect-[4/3] rounded-[1.5rem] overflow-hidden bg-gray-100">
                                                {/* Placeholder for images since generation failed */}
                                                <img
                                                    src={`/images/field_process_${index + 1}.png`}
                                                    alt={step.title}
                                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-duration-700"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                        e.currentTarget.parentElement?.classList.add('bg-gradient-to-br', 'from-gray-100', 'to-gray-200', 'flex', 'items-center', 'justify-center');
                                                        // Fallback content
                                                        const span = document.createElement('span');
                                                        span.className = "text-gray-400 font-medium";
                                                        span.innerText = "Illustration Image";
                                                        e.currentTarget.parentElement?.appendChild(span);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Column */}
                                <div className="w-full lg:w-1/2">
                                    <h3 className="text-3xl font-bold text-gray-900 mb-6">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600 text-lg leading-relaxed mb-8">
                                        {step.description}
                                    </p>

                                    <ul className="space-y-4 mb-10">
                                        {step.points.map((point, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <div className="flex-shrink-0 mt-1">
                                                    <div className="w-5 h-5 rounded-full bg-[#008CCB] flex items-center justify-center">
                                                        <CheckCircle2 size={12} className="text-white" />
                                                    </div>
                                                </div>
                                                <span className="text-gray-700 font-medium">{point}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Buttons based on index */}
                                    <div>
                                        {index === 0 && (
                                            <a href="/contact" className="inline-flex items-center gap-2 px-8 py-3 bg-[#2EABE2] hover:bg-[#1D8FCF] text-white rounded-lg font-semibold transition-colors shadow-lg shadow-blue-500/20">
                                                Liên hệ với chúng tôi
                                                <ArrowRight size={18} />
                                            </a>
                                        )}
                                        {index === 1 && (
                                            <a href="/experts" className="inline-flex items-center gap-2 px-8 py-3 bg-[#2EABE2] hover:bg-[#1D8FCF] text-white rounded-lg font-semibold transition-colors shadow-lg shadow-blue-500/20">
                                                <Phone size={18} />
                                                Kết nối với chuyên gia
                                            </a>
                                        )}
                                        {index === 2 && (
                                            <a href="/process" className="inline-flex items-center gap-2 px-8 py-3 bg-[#2EABE2] hover:bg-[#1D8FCF] text-white rounded-lg font-semibold transition-colors shadow-lg shadow-blue-500/20">
                                                <FileText size={18} />
                                                Tìm hiểu quy trình, nghiệp vụ
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
