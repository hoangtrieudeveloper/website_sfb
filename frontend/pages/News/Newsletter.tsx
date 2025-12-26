import { Tag } from "lucide-react";
import { newsletterData } from "./data";
import { motion } from "framer-motion";

export const Newsletter = () => {
    const Icon = newsletterData.icon;

    return (
        <section className="py-28 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]" />

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-3xl mx-auto text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 mb-8"
                    >
                        <Icon className="text-cyan-400" size={20} />
                        <span className="text-white font-semibold text-sm">
                            {newsletterData.badge}
                        </span>
                    </motion.div>

                    <h2 className="text-white mb-6 text-3xl md:text-4xl font-bold">{newsletterData.title}</h2>
                    <p className="text-xl text-blue-100 mb-10 leading-relaxed">
                        {newsletterData.description}
                    </p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
                    >
                        <input
                            type="email"
                            placeholder={newsletterData.emailPlaceholder}
                            className="flex-1 px-6 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:border-cyan-400 transition-all"
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-10 py-5 bg-white text-gray-900 rounded-xl hover:shadow-2xl transition-all font-semibold whitespace-nowrap"
                        >
                            {newsletterData.buttonText}
                        </motion.button>
                    </motion.div>

                    <p className="text-sm text-blue-200 mt-6">
                        {newsletterData.securityNote}
                    </p>
                </motion.div>
            </div>
        </section>
    );
};
