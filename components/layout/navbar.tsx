"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { Menu, X } from "lucide-react";
import LanguageSwitcher from "@/components/widgets/language-switcher";
import ThemeSwitcher from "@/components/widgets/theme-switcher";
import { useLanguage } from "@/providers/language-provider";
import { useLenis } from "@/providers/smooth-scroll-provider";

export default function Navbar() {
  const { dict } = useLanguage();
  const lenis = useLenis();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [dimensions, setDimensions] = useState({
    screenWidth: 1920,
    containerWidth: 1280,
    scrollHeight: 800,
  });

  const dummyRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  const { scrollY } = useScroll();

  const bgOpacity = useTransform(scrollY, [0, dimensions.scrollHeight], [0, 1]);
  const backdropBlur = useTransform(scrollY, [0, dimensions.scrollHeight], [0, 16]);
  const backdropFilter = useMotionTemplate`blur(${backdropBlur}px)`;

  const py = useTransform(scrollY, [0, dimensions.scrollHeight], [24, 12]);

  const startWidth = Math.max(dimensions.screenWidth, dimensions.containerWidth);
  const navMaxWidth = useTransform(scrollY, [0, dimensions.scrollHeight], [startWidth, dimensions.containerWidth]);

  const navLinks = useMemo(() => [
    { name: dict.nav.home, href: "#home" },
    { name: dict.nav.about, href: "#about" },
    { name: dict.nav.stack, href: "#stack" },
    { name: dict.nav.projects, href: "#projects" },
    { name: dict.nav.roadmap, href: "#roadmap" },
    { name: dict.nav.contact, href: "#contact" },
  ], [dict.nav]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateDimensions = () => {
      setDimensions({
        screenWidth: window.innerWidth,
        scrollHeight: window.innerHeight,
        containerWidth: dummyRef.current ? dummyRef.current.getBoundingClientRect().width : 1280,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    const overflowVal = isMobileMenuOpen ? "hidden" : "";
    document.body.style.overflow = overflowVal;
    document.documentElement.style.overflow = overflowVal;

    if (isMobileMenuOpen) {
      lenis?.stop();
    } else {
      lenis?.start();
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      lenis?.start();
    };
  }, [isMobileMenuOpen, lenis]);

  const scrollToSection = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const elem = document.getElementById(targetId);

    if (elem || targetId === "home") {
      setIsMobileMenuOpen(false);

      setTimeout(() => {
        let navbarHeight = 80;
        if (headerRef.current) {
          const currentHeight = headerRef.current.offsetHeight;
          const currentScroll = window.scrollY;
          const currentPy = currentScroll >= dimensions.scrollHeight
            ? 12
            : 24 - (currentScroll / dimensions.scrollHeight) * 12;
          const heightDifference = (currentPy - 12) * 2;
          navbarHeight = Math.max(currentHeight - heightDifference, 0);
        }

        const isDesktop = dimensions.screenWidth >= 1280;
        const isAboutOnDesktop = targetId === "about" && isDesktop;

        if (lenis) {
          lenis.scrollTo(targetId === "home" ? 0 : elem!, {
            offset: targetId === "home" ? 0 : isAboutOnDesktop ? 0 : -navbarHeight,
            duration: 1.5,
          });
        } else {
          if (targetId === "home") {
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else if (elem) {
            const rect = elem.getBoundingClientRect();
            const offsetPosition = rect.top + window.scrollY - (isAboutOnDesktop ? 0 : navbarHeight);
            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
          }
        }
      }, 100);
    }
  }, [lenis, dimensions.scrollHeight, dimensions.screenWidth]);

  return (
    <motion.header
      ref={headerRef}
      style={{
        paddingTop: py,
        paddingBottom: py,
      }}
      className="fixed top-0 left-0 right-0 z-100 transition-colors duration-300"
    >
      <div ref={dummyRef} className="container invisible absolute pointer-events-none -z-50" />

      <motion.div
        style={{
          opacity: bgOpacity,
          backdropFilter,
          WebkitBackdropFilter: backdropFilter,
        }}
        className="absolute inset-0 bg-background/75 border-b border-border/40 -z-10 pointer-events-none"
      />

      <motion.nav
        style={{
          maxWidth: navMaxWidth,
        }}
        className="mx-auto px-container flex items-center justify-between w-full"
      >
        <Link
          href="#home"
          onClick={(e) => scrollToSection(e, "#home")}
          className="relative z-110 flex items-center gap-2 group"
        >
          <span className="text-xl sm:text-2xl font-black tracking-tighter uppercase text-foreground transition-all duration-300 group-hover:opacity-70">
            rza mohammed
          </span>
        </Link>

        <div className="hidden xl:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="relative text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground group py-2"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>

        <div className="flex xl:hidden items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            className="relative z-110 p-2 text-foreground focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-90 bg-background xl:hidden flex flex-col h-dvh w-screen"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.05),transparent)] pointer-events-none" />
            <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />

            <div className="flex flex-col flex-1 pt-24 sm:pt-32 pb-24 sm:pb-12 px-container overflow-y-auto relative z-10">
              <ul className="flex flex-col gap-6 sm:gap-8">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.1 + (i * 0.05),
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={(e) => scrollToSection(e, link.href)}
                      className="group flex items-baseline"
                    >
                      <span className="text-4xl font-black tracking-tighter uppercase text-foreground transition-all duration-300 group-hover:pl-4 group-hover:text-primary">
                        {link.name}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <LanguageSwitcher />
                  <ThemeSwitcher />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
