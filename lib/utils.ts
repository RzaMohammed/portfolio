import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function deepMerge<T extends Record<string, unknown>, S extends Record<string, unknown>>(
    target: T,
    source: S
): T & S {
    const result = { ...target } as unknown as Record<string, unknown>;
    const src = source as Record<string, unknown>;
    const tgt = target as Record<string, unknown>;

    for (const key of Object.keys(src)) {
        const s = src[key];
        const t = tgt[key];
        result[key] =
            s && t && typeof s === "object" && typeof t === "object" && !Array.isArray(s) && !Array.isArray(t)
                ? deepMerge(t as Record<string, unknown>, s as Record<string, unknown>)
                : s;
    }
    return result as unknown as T & S;
}

export function sanitizePhone(phone: string): string {
    return phone.replace(/\s+/g, "");
}
