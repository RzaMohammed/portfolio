import { useSyncExternalStore, useCallback } from "react";

export const BREAKPOINTS = {
    sm: "(min-width: 640px)",
    md: "(min-width: 768px)",
    lg: "(min-width: 1024px)",
    xl: "(min-width: 1280px)",
    "2xl": "(min-width: 1536px)",
} as const;

export function useMediaQuery(query: string): boolean {
    const subscribe = useCallback(
        (callback: () => void) => {
            const media = window.matchMedia(query);
            media.addEventListener("change", callback);
            return () => media.removeEventListener("change", callback);
        },
        [query],
    );

    const getSnapshot = () => window.matchMedia(query).matches;

    const getServerSnapshot = () => false;

    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}