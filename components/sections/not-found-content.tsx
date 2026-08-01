import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { InteractiveParticles } from "@/components/effects/interactive-particles";

interface NotFoundContentProps {
    dict: {
        notFound: {
            title: string;
            description: string;
            goHome: string;
        }
    };
}

export function NotFoundContent({ dict }: NotFoundContentProps) {
    return (
        <div className="relative w-full h-screen flex flex-col justify-center items-center text-center px-container overflow-hidden bg-background">
            <InteractiveParticles />

            <div className="relative z-20 flex flex-col items-center justify-center max-w-2xl px-4">

                <div className="relative select-none flex items-center justify-center">
                    <h1 className="text-[9rem] sm:text-[12rem] md:text-[15rem] font-black tracking-tighter leading-none text-foreground/5 dark:text-foreground/5 font-sans">
                        404
                    </h1>

                    <span className="absolute text-2xl sm:text-3xl md:text-4xl font-black tracking-[0.25em] text-foreground uppercase drop-shadow-sm font-sans animate-pulse">
                        {dict.notFound.title}
                    </span>
                </div>

                <p className="text-muted-foreground text-sm sm:text-base font-light leading-relaxed max-w-md mb-8 select-none">
                    {dict.notFound.description}
                </p>

                <div>
                    <Link
                        href="/"
                        className="w-fit group relative flex h-12 sm:h-14 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-border/50 bg-foreground px-6 sm:px-8 text-background transition-all duration-500 ease-out hover:bg-background hover:border-foreground/30 hover:text-foreground shadow-2xl hover:-translate-y-0.5"
                    >
                        <div className="absolute inset-0 flex h-full w-full justify-center -translate-x-full -skew-x-12 group-hover:duration-1000 group-hover:translate-x-full">
                            <div className="relative h-full w-8 bg-background/20 dark:bg-foreground/10" />
                        </div>
                        <span className="relative z-10 flex items-center gap-2 text-xs font-bold tracking-[0.15em] uppercase">
                            {dict.notFound.goHome}
                            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-500 group-hover:translate-x-1" />
                        </span>
                    </Link>
                </div>
            </div>

        </div>
    );
}
