import React from "react";

const HIGHLIGHT_MAP: Record<"bold" | "italic", string> = {
    bold: "text-foreground font-semibold",
    italic: "text-foreground/80 italic font-serif font-light",
};


function parseInline(text: string): React.ReactNode {
    const regex = /\*{2}(.+?)\*{2}|\*(.+?)\*/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));

        const isBold = match[1] !== undefined;
        const styleKey = isBold ? "bold" : "italic";
        const matchedText = isBold ? match[1] : match[2];

        parts.push(
            <span key={match.index} className={HIGHLIGHT_MAP[styleKey]}>
                {matchedText}
            </span>
        );

        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) parts.push(text.slice(lastIndex));
    if (parts.length <= 1) return parts[0] ?? text;
    return <>{parts}</>;
}

export function parseMarkdown<T>(data: T): T {
    if (typeof data === "string") {
        if (!/\*{1,2}[^*]+\*{1,2}/.test(data) && !data.includes("\n\n")) return data;

        const paragraphs = data.split("\n\n");
        if (paragraphs.length === 1) return parseInline(data) as unknown as T;

        return (
            <>
                {paragraphs.map((p: string, i: number) => (
                    <React.Fragment key={i}>
                        {i > 0 && <><br /><br /></>}
                        {parseInline(p)}
                    </React.Fragment>
                ))}
            </>
        ) as unknown as T;
    }

    if (Array.isArray(data)) {
        return data.map((item) => parseMarkdown(item)) as unknown as T;
    }

    if (typeof data === "object" && data !== null) {
        const result = {} as Record<string, unknown>;
        const obj = data as Record<string, unknown>;
        for (const key in obj) {
            result[key] = parseMarkdown(obj[key]);
        }
        return result as unknown as T;
    }

    return data;
}
