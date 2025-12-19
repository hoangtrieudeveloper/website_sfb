"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function ProductCTA() {
    return (
        <section id="contact" className="py-[60px] bg-white">
            <div className="container mx-auto px-6">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="bg-[#2EABE2] rounded-2xl px-6 py-[120px] text-center flex flex-col items-center gap-[40px]"
                    >
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-white text-3xl md:text-4xl font-extrabold"
                        >
                            Miễn phí tư vấn
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-white/90 text-sm md:text-base leading-relaxed max-w-2xl mx-auto"
                        >
                            Đặt lịch tư vấn miễn phí với chuyên gia của SFB và khám phá cách
                            chúng tôi có thể đồng hành cùng doanh nghiệp bạn trong hành trình
                            chuyển đổi số.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex items-center justify-center gap-3"
                        >
                            <motion.a
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                href="/case-studies"
                                className="px-5 py-2.5 rounded-md border border-white/60 text-white text-xs font-semibold hover:bg-white/10 transition"
                            >
                                Xem case studies
                            </motion.a>

                            <motion.a
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                href="/contact"
                                className="px-5 py-2.5 rounded-md border border-white/60 text-white text-xs font-semibold hover:bg-white/10 transition inline-flex items-center gap-2"
                            >
                                Tư vấn miễn phí ngay
                                <ArrowRight size={16} />
                            </motion.a>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
