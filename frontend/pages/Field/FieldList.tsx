
import { Sparkles, CheckCircle2 } from "lucide-react";
import { fields } from "./data";

export function FieldList() {
    return (
        <section className="py-28 bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full border border-blue-200 mb-4">
                        <Sparkles className="text-blue-600" size={18} />
                        <span className="text-sm font-semibold text-blue-700">
                            Lĩnh vực
                        </span>
                    </div>
                    <h2 className="text-gray-900 mb-6">
                        Các lĩnh vực hoạt động & dịch vụ
                    </h2>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        Những mảng chuyên môn chính mà SFB đang cung cấp giải pháp và dịch
                        vụ công nghệ thông tin cho cơ quan Nhà nước & doanh nghiệp
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {fields.map((field) => (
                        <div
                            key={field.id}
                            className="bg-white rounded-3xl p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 group"
                        >
                            <div className="flex items-start gap-4 mb-6">
                                <div className="flex-shrink-0 w-12 h-12 bg-[#008CCB] rounded-xl flex items-center justify-center text-white text-xl font-bold">
                                    {field.id}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 pt-1 leading-snug">
                                    {field.title}
                                </h3>
                            </div>

                            <p className="text-gray-600 text-sm leading-relaxed mb-6 min-h-[40px]">
                                {field.short}
                            </p>

                            <ul className="space-y-3">
                                {field.points.map((point, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <div className="flex-shrink-0 mt-0.5">
                                            <div className="w-5 h-5 rounded-full bg-[#008CCB] flex items-center justify-center">
                                                <CheckCircle2 size={12} className="text-white" />
                                            </div>
                                        </div>
                                        <span className="text-sm text-gray-600 leading-snug">
                                            {point}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
