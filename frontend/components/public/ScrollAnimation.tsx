"use client";

import { motion, useInView, Variant } from "framer-motion";
import { useRef, ReactNode, useState, useEffect } from "react";

type AnimationVariant =
    | "fade-up"
    | "fade-down"
    | "fade-in"
    | "scale-up"
    | "zoom-in"
    | "slide-right"
    | "slide-left"
    | "flip-up"
    | "blur-in"
    | "elastic-up"
    | "rotate-in";

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
    duration = 0.8, // Slower default duration for elegance
    threshold = 0.2,
    once = true, // Changed default to true for smoother experience
}: ScrollAnimationProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { amount: threshold, once });

    // Mobile detection
    const [isMobile, setIsMobile] = useState(false); // Default to false to match server side
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const getVariants = (): { hidden: Variant; visible: Variant } => {
        switch (variant) {
            case "fade-up":
                return {
                    hidden: { opacity: 0, y: 40 },
                    visible: { opacity: 1, y: 0 },
                };
            case "fade-down":
                return {
                    hidden: { opacity: 0, y: -40 },
                    visible: { opacity: 1, y: 0 },
                };
            case "fade-in":
                return {
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 },
                };
            case "scale-up":
                return {
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1 },
                };
            case "zoom-in":
                return {
                    hidden: { opacity: 0, scale: 0.6 },
                    visible: { opacity: 1, scale: 1 },
                };
            case "slide-right":
                return {
                    hidden: { opacity: 0, x: -60 },
                    visible: { opacity: 1, x: 0 },
                };
            case "slide-left":
                return {
                    hidden: { opacity: 0, x: 60 },
                    visible: { opacity: 1, x: 0 },
                };
            case "flip-up":
                return {
                    hidden: { opacity: 0, rotateX: 90 },
                    visible: { opacity: 1, rotateX: 0 },
                };
            case "blur-in":
                return {
                    hidden: { opacity: 0, filter: "blur(10px)" },
                    visible: { opacity: 1, filter: "blur(0px)" },
                };
            case "elastic-up":
                return {
                    hidden: { opacity: 0, y: 50 },
                    visible: {
                        opacity: 1,
                        y: 0,
                        transition: { type: "spring", stiffness: 300, damping: 20 }
                    },
                };
            case "rotate-in":
                return {
                    hidden: { opacity: 0, rotate: -15, scale: 0.9 },
                    visible: { opacity: 1, rotate: 0, scale: 1 },
                };
            default:
                return {
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 },
                };
        }
    };

    const variants = getVariants();

    // If on mobile, just render without motion attributes or forced visible
    if (isMounted && isMobile) {
        return <div className={className}>{children}</div>;
    }

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
