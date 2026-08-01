"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export function HangingProfile() {
  const boxRef = useRef<HTMLDivElement>(null);
  const ropeRef = useRef<SVGLineElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const gravity = 1.2;
  const ropeLength = 180;
  const damping = 0.995;

  const state = useRef({
    angle: 0,
    velocity: 0,
    isDragging: false,
    dragX: 0,
    dragY: 0,
    currentLength: ropeLength,
    // Smooth 3D tilt tracking
    pointerX: 50,
    pointerY: 50,
    targetRotateX: 0,
    targetRotateY: 0,
    currentRotateX: 0,
    currentRotateY: 0,
    isHovered: false,
  });

  useEffect(() => {
    let animationFrameId = 0;
    let isVisible = false;

    const updatePhysics = () => {
      if (!isVisible) {
        animationFrameId = 0;
        return;
      }

      // Pendulum Physics
      if (!state.current.isDragging) {
        state.current.currentLength += (ropeLength - state.current.currentLength) * 0.1;
        const acceleration = (-gravity / state.current.currentLength) * Math.sin(state.current.angle);
        state.current.velocity += acceleration;
        state.current.velocity *= damping;
        state.current.angle += state.current.velocity;
      } else {
        const dx = state.current.dragX;
        const dy = Math.max(state.current.dragY, 10);
        const targetAngle = Math.atan2(dx, dy);
        let targetLength = Math.sqrt(dx * dx + dy * dy);

        if (targetLength > ropeLength) {
          targetLength = ropeLength + (targetLength - ropeLength) * 0.2;
        } else if (targetLength < ropeLength * 0.3) {
          targetLength = ropeLength * 0.3;
        }

        state.current.angle += (targetAngle - state.current.angle) * 0.4;
        state.current.currentLength += (targetLength - state.current.currentLength) * 0.4;
        state.current.velocity = 0;
      }

      // Ultra-smooth 3D Tilt Lerp
      const lerpSpeed = 0.1;
      state.current.currentRotateX += (state.current.targetRotateX - state.current.currentRotateX) * lerpSpeed;
      state.current.currentRotateY += (state.current.targetRotateY - state.current.currentRotateY) * lerpSpeed;

      if (boxRef.current && ropeRef.current) {
        const x = state.current.currentLength * Math.sin(state.current.angle);
        const y = state.current.currentLength * Math.cos(state.current.angle);

        ropeRef.current.setAttribute("x2", (150 + x).toString());
        ropeRef.current.setAttribute("y2", y.toString());

        const rotZ = -state.current.angle * (180 / Math.PI);
        const rotX = state.current.currentRotateX;
        const rotY = state.current.currentRotateY;
        const scale = state.current.isHovered ? 1.04 : 1;

        boxRef.current.style.transform = `translate(${x}px, ${y}px) rotateZ(${rotZ}deg) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(${scale}, ${scale}, 1)`;
        boxRef.current.style.setProperty("--pointer-x", `${state.current.pointerX}%`);
        boxRef.current.style.setProperty("--pointer-y", `${state.current.pointerY}%`);
      }

      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    const startLoop = () => {
      if (animationFrameId) return;
      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    const stopLoop = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = 0;
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          startLoop();
        } else {
          stopLoop();
        }
      },
      { threshold: 0 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      stopLoop();
      observer.disconnect();
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    state.current.isDragging = true;
    state.current.targetRotateX = 0;
    state.current.targetRotateY = 0;
    if (boxRef.current) {
      boxRef.current.style.cursor = "grabbing";
    }

    const updateMousePos = (ev: PointerEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const originX = rect.width / 2;
      const originY = 0;

      state.current.dragX = ev.clientX - rect.left - originX;
      state.current.dragY = ev.clientY - rect.top - originY;
    };

    const handlePointerUp = () => {
      state.current.isDragging = false;
      if (boxRef.current) {
        boxRef.current.style.cursor = "grab";
      }
      window.removeEventListener("pointermove", updateMousePos);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    updateMousePos(e.nativeEvent as PointerEvent);
    window.addEventListener("pointermove", updateMousePos);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current || state.current.isDragging) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cardWidth = 165;
    const cardHeight = 220;

    // Use static container coordinate reference to prevent 3D feedback jitter
    const cardCenterX = rect.width / 2 + state.current.currentLength * Math.sin(state.current.angle);
    const cardCenterY = state.current.currentLength * Math.cos(state.current.angle) + cardHeight / 2;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const diffX = mouseX - cardCenterX;
    const diffY = mouseY - cardCenterY;

    const percentX = Math.min(Math.max(((diffX + cardWidth / 2) / cardWidth) * 100, 0), 100);
    const percentY = Math.min(Math.max(((diffY + cardHeight / 2) / cardHeight) * 100, 0), 100);

    state.current.pointerX = percentX;
    state.current.pointerY = percentY;

    // Clamp tilt angles to gentle, smooth range
    state.current.targetRotateX = Math.min(Math.max(-(diffY / 12), -12), 12);
    state.current.targetRotateY = Math.min(Math.max(diffX / 12, -12), 12);
  };

  const handlePointerEnter = () => {
    state.current.isHovered = true;
  };

  const handlePointerLeave = () => {
    state.current.isHovered = false;
    state.current.targetRotateX = 0;
    state.current.targetRotateY = 0;
    state.current.pointerX = 50;
    state.current.pointerY = 50;
  };

  return (
    <div ref={containerRef} className="relative w-[300px] h-[360px] flex justify-center -mt-4 [perspective:1000px]">
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible z-10">
        <line
          ref={ropeRef}
          x1="150"
          y1="0"
          x2="150"
          y2="180"
          stroke="currentColor"
          strokeWidth="3"
          className="text-foreground/30 group-hover:text-primary/60 transition-colors duration-500"
          strokeLinecap="round"
        />
        <circle cx="150" cy="0" r="5" fill="currentColor" className="text-foreground/50" />
        <circle cx="150" cy="0" r="2" fill="currentColor" className="text-background" />
      </svg>

      <div
        ref={boxRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        className="absolute top-0 flex flex-col items-center justify-center p-5 w-[165px] rounded-3xl bg-background/60 backdrop-blur-xl border border-foreground/15 cursor-grab shadow-2xl select-none group overflow-hidden [transform-style:preserve-3d] will-change-transform hover:border-primary/50 hover:shadow-primary/20"
        style={{
          left: "50%",
          marginLeft: "-82.5px",
          transformOrigin: "center top",
          touchAction: "none",
        }}
      >
        {/* Holographic Dynamic Glare Overlay */}
        <div
          className="absolute inset-0 pointer-events-none rounded-3xl transition-opacity duration-300 opacity-0 group-hover:opacity-100 z-20"
          style={{
            background: `radial-gradient(circle at var(--pointer-x, 50%) var(--pointer-y, 50%), rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.05) 45%, transparent 70%), linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 100%)`,
            mixBlendMode: "overlay",
          }}
        />

        {/* Animated Border Accent */}
        <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-primary/30 via-foreground/10 to-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-[1px]" />

        {/* Profile Avatar Container with 3D Depth */}
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-foreground/20 mb-3.5 bg-foreground/5 flex items-center justify-center pointer-events-none group-hover:border-primary/60 transition-all duration-500 relative z-30 shadow-lg group-hover:scale-105 group-hover:shadow-primary/30 [transform:translateZ(24px)]">
          <Image
            src="/hero-slider/black_white_photo1.webp"
            alt="Rza Mohammed"
            fill
            className="object-cover object-center grayscale contrast-[1.08] group-hover:grayscale-0 transition-all duration-700"
          />
        </div>

        {/* Text Details with 3D Depth */}
        <div className="flex flex-col items-center gap-1.5 pointer-events-none z-30 [transform:translateZ(18px)]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="text-xs font-black tracking-[0.25em] text-foreground/90 uppercase group-hover:text-primary transition-colors">
              RZA MOHAMMED
            </span>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground bg-foreground/5 px-2.5 py-0.5 rounded-full border border-foreground/10">
            Web Developer
          </span>
        </div>

        {/* Top Ring Pin */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-1 w-3 h-3 rounded-full border-2 border-foreground/30 bg-background z-40 shadow-sm group-hover:border-primary/50 transition-colors" />
      </div>
    </div>
  );
}
