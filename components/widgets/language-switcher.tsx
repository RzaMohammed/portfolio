"use client";

import { Check, Globe } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import { usePathname } from "next/navigation";
import Link from "next/link";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function LanguageSwitcher() {
    const { language } = useLanguage();
    const pathname = usePathname();

    const getLocalizedPath = (targetLang: string) => {
        return pathname.replace(`/${language}`, `/${targetLang}`);
    };

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <button className="group relative flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-border/50 bg-background/50 backdrop-blur-md text-foreground transition-all duration-500 hover:bg-foreground hover:text-background hover:border-foreground/30 shadow-sm focus:outline-none">
                    <div className="absolute inset-0 flex h-full w-full justify-center -translate-x-full -skew-x-13 group-hover:duration-1000 group-hover:translate-x-full">
                        <div className="relative h-full w-4 bg-background/20 dark:bg-background/20" />
                    </div>
                    <span className="relative z-10 flex items-center justify-center">
                        <Globe className="h-4 w-4 transition-transform duration-500 group-hover:rotate-12" />
                    </span>
                    <span className="sr-only">Switch Language</span>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-120 bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl rounded-2xl min-w-[140px] p-2">
                <DropdownMenuItem asChild className="rounded-xl cursor-pointer my-0.5 focus:bg-secondary">
                    <Link href={getLocalizedPath("en")}>
                        <span className={cn("mr-2 flex h-3.5 w-3.5 items-center justify-center")}>
                            {language === "en" && <Check className="h-3.5 w-3.5" />}
                        </span>
                        <span className="text-xs tracking-widest uppercase">English</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-xl cursor-pointer my-0.5 focus:bg-secondary">
                    <Link href={getLocalizedPath("ur")}>
                        <span className={cn("mr-2 flex h-3.5 w-3.5 items-center justify-center")}>
                            {language === "ur" && <Check className="h-3.5 w-3.5" />}
                        </span>
                        <span className="text-xs tracking-widest uppercase">اردو</span>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
