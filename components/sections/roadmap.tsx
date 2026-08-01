"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { BlurReveal } from "@/components/effects/blur-reveal";
import { useLanguage } from "@/providers/language-provider";
import type { RoadmapItem } from "@/types/roadmap";

export default function Roadmap() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { content, dict } = useLanguage();
    const roadmapItems: RoadmapItem[] = content.roadmap || [];

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });

    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    return (
        <section ref={containerRef} className="relative container-void overflow-hidden py-32 xl:py-48 border-t border-border/50">
            <div className="absolute top-1/4 left-0 w-full max-w-lg h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -translate-x-1/2" />
            <div className="absolute bottom-1/4 right-0 w-full max-w-lg h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none translate-x-1/2" />

            <motion.div
                style={{ y: yBackground }}
                className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none flex items-center justify-center opacity-[0.02] z-0 overflow-hidden"
            >
                <div className="text-[20vw] font-black tracking-tighter uppercase whitespace-nowrap">
                    {dict.title.roadmap}
                </div>
            </motion.div>

            <div className="container mx-auto px-container max-w-6xl relative z-10">

                <div className="flex flex-col md:items-center mb-24 md:mb-40 gap-4 text-center">
                    <BlurReveal>
                        <span className="title-counter">
                            [004]
                        </span>
                    </BlurReveal>

                    <BlurReveal>
                        <h2 className="title">
                            {dict.title.roadmap}
                        </h2>
                    </BlurReveal>

                    <BlurReveal>
                        <p className="text-lg mt-3 max-w-xl italic font-medium tracking-tight text-foreground/60">
                            {dict.roadmapDescription}
                        </p>
                    </BlurReveal>
                </div>

                <div className="relative">
                    <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border/40 -translate-x-1/2" />

                    <motion.div
                        style={{ scaleY, originY: 0 }}
                        className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-linear-to-b from-primary via-primary to-transparent shadow-[0_0_10px_rgba(var(--primary),0.5)] -translate-x-1/2 z-10"
                    />

                    <div className="flex flex-col w-full gap-8 md:gap-24 relative z-20">
                        {roadmapItems.map((item: RoadmapItem, index: number) => (
                            <TimelineNode
                                key={item.id}
                                item={item}
                                isEven={index % 2 === 0}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

const TimelineNode = ({ item, isEven }: { item: RoadmapItem, isEven: boolean }) => {
    return (
        <div className={cn("relative flex items-center justify-between w-full", isEven ? "flex-row" : "flex-row-reverse")}>

            <div className="w-[calc(50%-3rem)] hidden md:block" />

            <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full border border-border/50 bg-background z-20 flex items-center justify-center shadow-lg group-hover:border-primary/50 transition-colors duration-500">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
            </div>

            <div
                className={cn(
                    "w-full md:w-[calc(50%-3rem)] pl-16 md:pl-0 relative group",
                )}
            >
                <BlurReveal>
                    <div className={cn(
                        "relative p-8 md:p-10 border border-border/50 bg-secondary/5 backdrop-blur-md overflow-hidden transition-all duration-700 ease-out",
                        "hover:bg-secondary/20 hover:border-border hover:shadow-2xl",
                        isEven ? "md:text-right" : "md:text-left"
                    )}>

                        <span className={cn(
                            "max-sm:hidden text-xs font-mono tracking-widest text-muted-foreground uppercase flex mb-4",
                            isEven ? "md:justify-end" : "md:justify-start"
                        )}>
                            {item.id}
                        </span>

                        <div className="flex flex-col gap-3 relative z-10">
                            <h3 className="text-4xl md:text-5xl lg:text-6xl tracking-tighter font-serif italic font-semibold text-foreground uppercase mt-2 group-hover:text-primary transition-colors duration-500">
                                {item.year}
                            </h3>

                            <p className="text-muted-foreground text-sm md:text-base leading-relaxed mt-2 max-w-sm ml-0 md:max-w-md"
                                style={{ marginLeft: isEven ? 'auto' : '0' }}>
                                {item.description}
                            </p>

                            <div className={cn("flex flex-wrap gap-2 mt-6", isEven ? "md:justify-end" : "justify-start")}>
                                {item.stack.map((tag: string) => (
                                    <span
                                        key={tag}
                                        className="text-xs uppercase tracking-wider text-muted-foreground font-medium px-3 py-1 rounded-full border border-border/40 bg-background/50 shadow-sm"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className={cn(
                            "absolute top-1/2 -translate-y-1/2 text-[10rem] font-black italic text-foreground/3 select-none pointer-events-none transition-all duration-700",
                            isEven ? "-left-12" : "-right-12 text-right"
                        )}>
                            {item.year.slice(2)}
                        </div>

                    </div>
                </BlurReveal>
            </div>
        </div>
    )
}