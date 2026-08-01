"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export function CustomCursor() {
    const isVisibleRef = useRef(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [isEnabled, setIsEnabled] = useState(false);

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        if (window.matchMedia("(pointer: coarse)").matches) return;
        
        const frameId = requestAnimationFrame(() => {
            setIsEnabled(true);
        });

        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            if (!isVisibleRef.current) {
                isVisibleRef.current = true;
                setIsVisible(true);
            }
        };

        const isInteractive = (el: HTMLElement): boolean => {
            const tag = el.tagName.toLowerCase();
            if (tag === "button" || tag === "a" || tag === "input" || tag === "select" || tag === "textarea") return true;
            if (el.closest("button") || el.closest("a")) return true;
            if (el.getAttribute("role") === "button") return true;
            if (el.classList.contains("cursor-pointer")) return true;
            if (el.dataset.cursor === "pointer") return true;
            return false;
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            setIsHovering(isInteractive(target));
        };

        const handleMouseLeave = () => {
            isVisibleRef.current = false;
            setIsVisible(false);
        };
        const handleMouseEnter = () => {
            isVisibleRef.current = true;
            setIsVisible(true);
        };

        window.addEventListener("mousemove", moveCursor);
        window.addEventListener("mouseover", handleMouseOver);
        document.addEventListener("mouseleave", handleMouseLeave);
        document.addEventListener("mouseenter", handleMouseEnter);

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("mouseover", handleMouseOver);
            document.removeEventListener("mouseleave", handleMouseLeave);
            document.removeEventListener("mouseenter", handleMouseEnter);
        };
    }, [cursorX, cursorY]);

    if (!isEnabled) return null;

    return (
        <motion.div
            className="fixed top-0 left-0 pointer-events-none hidden md:flex items-center justify-center mix-blend-difference"
            style={{
                x: cursorXSpring,
                y: cursorYSpring,
                translateX: "-50%",
                translateY: "-50%",
                opacity: isVisible ? 1 : 0,
                zIndex: 999999,
            }}
        >
            <motion.div
                className={cn(
                    "rounded-full flex items-center justify-center transition-colors duration-300",
                    isHovering ? "bg-white" : "bg-transparent border border-white/50"
                )}
                animate={{
                    width: isHovering ? 64 : 32,
                    height: isHovering ? 64 : 32,
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-white"
                    animate={{
                        scale: isHovering ? 0 : 1,
                        opacity: isHovering ? 0 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                />
            </motion.div>
        </motion.div>
    );
}
