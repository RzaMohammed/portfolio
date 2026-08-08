"use client";

import React, { useState } from "react";
import Image from "next/image";
import { BlurReveal } from "@/components/effects/blur-reveal";
import { useLanguage } from "@/providers/language-provider";
import type { AchievementItem } from "@/types/achievement";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { useLenisModal } from "@/hooks/use-lenis-modal";


export default function Achievements() {
    const { content, dict } = useLanguage();
    const achievements: AchievementItem[] = content.achievements || [];
    const [selectedAchievement, setSelectedAchievement] = useState<AchievementItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (achievements.length === 0) return null;

    const handleOpen = (item: AchievementItem) => {
        setSelectedAchievement(item);
        setIsModalOpen(true);
    };

    return (
        <section className="w-full bg-background text-foreground overflow-hidden relative py-16 md:py-24 lg:py-32 xl:py-40">

            <div className="h-full flex flex-col px-container container mx-auto">

                <div className="flex flex-col gap-4 mb-16 md:mb-24">
                    <BlurReveal>
                        <span className="title-counter">
                            [003]
                        </span>
                    </BlurReveal>

                    <BlurReveal>
                        <h2 className="title">
                            {dict.title.achievements}
                        </h2>
                    </BlurReveal>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {achievements.map((item: AchievementItem) => (
                        <AchievementCard
                            key={item.id}
                            item={item}
                            onClick={() => handleOpen(item)}
                        />
                    ))}
                </div>

            </div>

            <AchievementModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                achievement={selectedAchievement}
            />
        </section>
    );
}

const AchievementCard = React.memo(function AchievementCard({
    item,
    onClick,
}: {
    item: AchievementItem;
    onClick?: () => void;
}) {
    return (
        <BlurReveal>
            <div
                onClick={onClick}
                className="group relative w-full aspect-4/3 cursor-pointer overflow-hidden"
            >
                <div className="relative w-full h-full overflow-hidden bg-muted border border-border/50 transition-all duration-700 ease-out group-hover:border-foreground/20">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            unoptimized
                            sizes="(max-width: 768px) 100vw, 50vw"
                            loading="lazy"
                            className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 grayscale group-hover:grayscale-0"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent pointer-events-none" />
                    </div>

                    <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 xl:p-10">
                        <div className="flex justify-between items-start">
                            <div className="overflow-hidden">
                                <span className="block text-xs xl:text-sm font-mono tracking-widest text-muted-foreground uppercase transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 delay-100">
                                    {item.category}
                                </span>
                            </div>
                            <div className="overflow-hidden">
                                <span className="block text-xs xl:text-sm font-mono text-muted-foreground transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 delay-200">
                                    {item.year}
                                </span>
                            </div>
                        </div>

                        <h3 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tighter uppercase text-foreground opacity-10 group-hover:opacity-100 transition-opacity duration-500 delay-100 pointer-events-none">
                            {item.title}
                        </h3>
                    </div>
                </div>
            </div>
        </BlurReveal>
    );
});

function AchievementModal({
    open,
    onOpenChange,
    achievement,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    achievement: AchievementItem | null;
}) {
    useLenisModal(open);
    const { dict } = useLanguage();

    if (!achievement) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={true}
                className="flex flex-col sm:max-w-[800px] w-[95vw] max-h-[90vh] p-0 gap-0 border-border/50 bg-background/95 backdrop-blur-xl shrink-0"
            >
                <DialogHeader className="sr-only">
                    <DialogTitle>{achievement.title}</DialogTitle>
                    <DialogDescription>{dict.projectDetails} {achievement.title}</DialogDescription>
                </DialogHeader>

                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent z-10" />

                <div className="overflow-y-auto w-full h-full flex-1" data-lenis-prevent="true">

                    <div className="relative w-full h-[40vh] sm:h-[50vh] shrink-0">
                        <Image
                            src={achievement.image}
                            alt={achievement.title}
                            fill
                            unoptimized
                            className="object-cover rounded-t-lg"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent pointer-events-none" />

                        <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10">
                            <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter text-foreground mb-2">
                                {achievement.title}
                            </h2>
                            <div className="flex items-center gap-3 text-sm font-mono tracking-widest text-muted-foreground uppercase">
                                <span>{achievement.category}</span>
                                <span className="w-1 h-1 rounded-full bg-border" />
                                <span>{achievement.year}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 sm:p-10 flex flex-col gap-8">
                        <div>
                            <h3 className="text-sm tracking-widest text-muted-foreground uppercase mb-4">{dict.aboutProject}</h3>
                            <p className="text-lg text-foreground/80 leading-relaxed font-light">
                                {achievement.description}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent z-10" />
            </DialogContent>
        </Dialog>
    );
}

