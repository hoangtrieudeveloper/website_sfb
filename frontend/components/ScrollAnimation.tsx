"use client";

import { motion, useInView, Variant } from "framer-motion";
import { useRef, ReactNode } from "react";

type AnimationVariant = "fade-up" | "fade-in" | "scale-up" | "slide-right" | "slide-left";

interface ScrollAnimationProps {
    children: ReactNode;
    className?: string;
    variant?: AnimationVariant;
    delay?: number;
    duration?: number;
    threshold?: number;
    once?: boolean;
}

export function ScrollAnimation({
    children,
    className = "",
    variant = "fade-up",
    delay = 0,
    duration = 0.5,
    threshold = 0.2,
    once = true,
}: ScrollAnimationProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { amount: threshold, once });

    const getVariants = (): { hidden: Variant; visible: Variant } => {
        switch (variant) {
            case "fade-up":
                return {
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 },
                };
            case "fade-in":
                return {
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 },
                };
            case "scale-up":
                return {
                    hidden: { opacity: 0, scale: 0.9 },
                    visible: { opacity: 1, scale: 1 },
                };
            case "slide-right":
                return {
                    hidden: { opacity: 0, x: -30 },
                    visible: { opacity: 1, x: 0 },
                };
            case "slide-left":
                return {
                    hidden: { opacity: 0, x: 30 },
                    visible: { opacity: 1, x: 0 },
                };
            default:
                return {
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 },
                };
        }
    };

    const variants = getVariants();

    return (
        <motion.div
            ref={ref}
            className={className}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={variants}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.1, 0.25, 1],
            }}
        >
            {children}
        </motion.div>
    );
}
