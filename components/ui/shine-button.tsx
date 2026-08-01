import React from "react";
import { cn } from "@/lib/utils";

interface ShineButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    className?: string;
    children: React.ReactNode;
    shineClassName?: string;
}

export function ShineButton({
    href,
    className,
    children,
    shineClassName = "w-6 bg-background/20 dark:bg-background/20",
    target = "_blank",
    rel = "noopener noreferrer",
    ...props
}: ShineButtonProps) {
    return (
        <a
            href={href}
            target={target}
            rel={target === "_blank" ? rel : undefined}
            className={cn(
                "group relative flex items-center justify-center overflow-hidden rounded-full border border-border/50 bg-background text-foreground transition-all duration-500 hover:bg-foreground hover:text-background hover:border-foreground/30 shadow-sm",
                className
            )}
            {...props}
        >
            <div className="absolute inset-0 flex h-full w-full justify-center -translate-x-full -skew-x-13 group-hover:duration-1000 group-hover:translate-x-full">
                <div className={cn("relative h-full", shineClassName)} />
            </div>
            {children}
        </a>
    );
}
