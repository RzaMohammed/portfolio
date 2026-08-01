"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function Preloader() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
            document.body.style.overflow = "";
        }, 1200);

        document.body.style.overflow = "hidden";

        return () => {
            clearTimeout(timer);
            document.body.style.overflow = "";
        };
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    key="preloader"
                    initial={{ y: 0 }}
                    exit={{
                        y: "-100%",
                        transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] }
                    }}
                    className="fixed inset-0 z-99999 flex flex-col items-center justify-center bg-background pointer-events-auto"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)", transition: { duration: 0.4 } }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="relative z-10 flex flex-col items-center gap-8"
                    >
                        <div className="relative flex items-center justify-center w-36 h-36">
                            <motion.svg
                                animate={{ rotate: 360 }}
                                transition={{ duration: 12, ease: "linear", repeat: Infinity }}
                                viewBox="0 0 100 100"
                                className="absolute inset-0 w-full h-full opacity-40"
                            >
                                <circle
                                    cx="50" cy="50" r="48"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="0.5"
                                    strokeDasharray="2 6"
                                    className="text-muted-foreground"
                                />
                            </motion.svg>

                            <motion.svg
                                viewBox="0 0 100 100"
                                className="absolute inset-0 w-full h-full -rotate-90"
                            >
                                <circle
                                    cx="50" cy="50" r="46"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                    className="text-border/30"
                                />
                                <motion.circle
                                    cx="50" cy="50" r="46"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeDasharray="289"
                                    initial={{ strokeDashoffset: 289 }}
                                    animate={{ strokeDashoffset: 0 }}
                                    transition={{ duration: 2, ease: [0.65, 0, 0.35, 1] }}
                                    className="text-primary"
                                />
                            </motion.svg>

                            <div className="absolute inset-3 rounded-full border border-border/50 bg-secondary/5 backdrop-blur-md" />

                            <Image
                                src="/logo.png?v=2"
                                alt="Logo"
                                width={56}
                                height={56}
                                className="object-contain z-10"
                                priority
                                unoptimized
                            />
                        </div>

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
