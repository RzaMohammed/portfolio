"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ThemeSwitcher() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button className="group relative flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-border/50 bg-background/50 backdrop-blur-md text-foreground transition-all duration-500 hover:bg-foreground hover:text-background hover:border-foreground/30 shadow-sm focus:outline-none">
          <div className="absolute inset-0 flex h-full w-full justify-center -translate-x-full -skew-x-13 group-hover:duration-1000 group-hover:translate-x-full">
            <div className="relative h-full w-4 bg-background/20 dark:bg-background/20" />
          </div>
          <span className="relative z-10 flex items-center justify-center">
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
          </span>
          <span className="sr-only">Toggle theme</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-120 bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl rounded-2xl min-w-[140px] p-2">
        <DropdownMenuItem onClick={() => setTheme("light")} className="rounded-xl cursor-pointer my-0.5 focus:bg-secondary">
          <Sun className="mr-2 h-3.5 w-3.5" />
          <span className="text-xs tracking-widest uppercase">Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="rounded-xl cursor-pointer my-0.5 focus:bg-secondary">
          <Moon className="mr-2 h-3.5 w-3.5" />
          <span className="text-xs tracking-widest uppercase">Dark</span>
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}
