"use client";

import { motion, useInView, UseInViewOptions, HTMLMotionProps, Variants } from "framer-motion";
import { useRef, ReactNode } from "react";

// --- Variants ---

export const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1] // Custom refined bezier
        }
    }
};

export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1
        }
    }
};

export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

export const slideInLeft: Variants = {
    hidden: { opacity: 0, x: -60 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.8, ease: "easeOut" }
    }
};

export const slideInRight: Variants = {
    hidden: { opacity: 0, x: 60 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.8, ease: "easeOut" }
    }
};

export const zoomInVariant: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

// --- Components ---

interface MotionProps extends HTMLMotionProps<"div"> {
    children: ReactNode;
    delay?: number;
    viewport?: UseInViewOptions;
}

interface SlideInProps extends MotionProps {
    direction?: "left" | "right" | "up" | "down";
}

export function FadeIn({ children, delay = 0, className, ...props }: MotionProps) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-100px" }}
            variants={{
                hidden: { opacity: 0, y: 20, filter: "blur(5px)" },
                visible: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: {
                        duration: 0.7,
                        delay: delay,
                        ease: "easeOut"
                    }
                }
            }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export function SlideIn({ children, className, direction = "left", delay = 0, ...props }: SlideInProps) {
    const variants: Variants = {
        hidden: {
            opacity: 0,
            x: direction === "left" ? -60 : direction === "right" ? 60 : 0,
            y: direction === "up" ? 60 : direction === "down" ? -60 : 0
        },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" as const, delay: delay }
        }
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-100px" }}
            variants={variants}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export function ZoomIn({ children, className, delay = 0, ...props }: MotionProps) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-100px" }}
            variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: {
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 0.6, ease: "easeOut", delay: delay }
                }
            }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export function StaggerContainer({ children, className, delay = 0, ...props }: MotionProps) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-100px" }}
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.1,
                        delayChildren: delay
                    }
                }
            }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export function TechBorderReveal({ children, className }: { children: ReactNode, className?: string }) {
    return (
        <div className={`relative group ${className}`}>
            {/* Corner borders - Techno feel */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-transparent group-hover:border-cyan-500 transition-colors duration-300" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-transparent group-hover:border-cyan-500 transition-colors duration-300" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-transparent group-hover:border-blue-500 transition-colors duration-300" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-transparent group-hover:border-blue-500 transition-colors duration-300" />

            {/* Glowing line overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </div>

            {children}
        </div>
    );
}

// Draw Line Animation (for timelines or separators)
export function DrawLine({ className }: { className?: string }) {
    return (
        <motion.div
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className={className}
        >
            <svg width="100%" height="2">
                <motion.line
                    x1="0" y1="0" x2="100%" y2="0"
                    stroke="currentColor"
                    strokeWidth="2"
                />
            </svg>
        </motion.div>
    );
}
