"use client";

import { useLanguage } from "@/providers/language-provider";
import { NotFoundContent } from "@/components/sections/not-found-content";

export default function LangNotFound() {
    const { dict } = useLanguage();

    return (
        <NotFoundContent dict={dict} />
    );
}
