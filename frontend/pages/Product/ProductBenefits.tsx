"use client";

import { benefits } from "./data";
import { motion } from "framer-motion";

export function ProductBenefits() {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-2xl p-8 text-center shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-gray-100
          hover:shadow-[0_16px_40px_rgba(0,0,0,0.10)] transition-all duration-300"
                        >
                            {/* Icon box */}
                            <div className="flex justify-center mb-5">
                                <div
                                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${benefit.gradient}
              flex items-center justify-center shadow-md`}
                                >
                                    <img
                                        src={benefit.icon}
                                        alt={benefit.title}
                                        className="w-8 h-8"
                                    />
                                </div>
                            </div>

                            <h4 className="text-gray-900 font-bold text-base mb-2">
                                {benefit.title}
                            </h4>

                            <p className="text-gray-500 text-sm leading-relaxed">
                                {benefit.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
