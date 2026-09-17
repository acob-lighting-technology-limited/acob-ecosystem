"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Platform } from "./platform-card";

export interface LaunchState {
  platform: Platform;
  /** Viewport rect of the card that was clicked, used as the flight origin. */
  rect: { top: number; left: number; width: number; height: number };
}

/**
 * Size of the centred "modal" card the clicked card flies into. Deliberately
 * much larger than a grid card so the flight reads as a real zoom, and clamped
 * to the viewport so it still fits on phones.
 */
const CARD_MAX_W = 420;
const CARD_MAX_H = 520;

const ZOOM_MS = 720;
const HOLD_MS = 260;
const EXIT_MS = 560;

type Phase = "enter" | "zoom" | "exit";

/**
 * Launch transition: the clicked card lifts off the grid and flies to the
 * centre of the screen (`zoom`), holds for a beat, then rushes toward the
 * viewer and dissolves (`exit`) — at which point `onDone` fires and the caller
 * navigates.
 */
export function LaunchOverlay({
  launch,
  onDone,
}: {
  launch: LaunchState;
  onDone: () => void;
}) {
  const { platform, rect } = launch;
  const Icon = platform.icon;
  const [phase, setPhase] = useState<Phase>("enter");

  // Computed once, on the click that mounts this overlay.
  const [card] = useState(() => ({
    w: Math.min(CARD_MAX_W, window.innerWidth * 0.86),
    h: Math.min(CARD_MAX_H, window.innerHeight * 0.68),
  }));

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Offset/scale that place the centred card exactly over the clicked card, so
  // the opening frame is seamless and Framer animates the delta back to zero.
  const centerX = typeof window !== "undefined" ? window.innerWidth / 2 : 0;
  const centerY = typeof window !== "undefined" ? window.innerHeight / 2 : 0;
  const fromX = rect.left + rect.width / 2 - centerX;
  const fromY = rect.top + rect.height / 2 - centerY;
  // Capped so the flight always reads as a zoom *in*. On one-column layouts the
  // grid card can be wider than the modal, which would otherwise start above
  // 1 and shrink inward.
  const fromScale = Math.min(rect.width / card.w, 0.85);

  useEffect(() => {
    if (reduceMotion) {
      const t = window.setTimeout(onDone, 120);
      return () => window.clearTimeout(t);
    }

    // Hold one painted frame at the card's own position/size before animating
    // to centre. Relying on Framer's mount-time `initial` alone let the card
    // land centred with no visible flight; driving a real state change from
    // "enter" -> "zoom" guarantees there is something to animate between.
    const timers: number[] = [];
    let started = false;

    const start = () => {
      if (started) return;
      started = true;
      setPhase("zoom");
      timers.push(
        window.setTimeout(() => setPhase("exit"), ZOOM_MS + HOLD_MS),
        window.setTimeout(onDone, ZOOM_MS + HOLD_MS + EXIT_MS)
      );
    };

    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(start);
    });
    // rAF never fires in a hidden/background tab, which would otherwise strand
    // the overlay and never navigate. Timers still fire there, so this both
    // rescues that case and caps how long the "enter" frame can linger.
    timers.push(window.setTimeout(start, 120));

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      timers.forEach(window.clearTimeout);
    };
  }, [reduceMotion, onDone]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "exit" ? 1 : 0.88 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      />

      <motion.div
        className="relative flex flex-col overflow-hidden rounded-2xl border border-glow/35 bg-panel p-7 shadow-[0_30px_80px_-20px_var(--panel-shadow)]"
        style={{ width: card.w, height: card.h }}
        initial={{ x: fromX, y: fromY, scale: fromScale, opacity: 1 }}
        animate={
          phase === "enter"
            ? { x: fromX, y: fromY, scale: fromScale, opacity: 1 }
            : phase === "zoom"
              ? { x: 0, y: 0, scale: 1, opacity: 1 }
              : {
                  x: 0,
                  y: 0,
                  // Dip slightly before rushing the viewer, and hold opacity
                  // until the end so this reads as the card flying past rather
                  // than simply fading away.
                  scale: [1, 0.94, 5.5],
                  opacity: [1, 1, 0],
                }
        }
        transition={
          phase === "enter"
            ? { duration: 0 }
            : phase === "zoom"
              ? { duration: ZOOM_MS / 1000, ease: [0.22, 1, 0.36, 1] }
              : { duration: EXIT_MS / 1000, times: [0, 0.28, 1], ease: [0.4, 0, 0.9, 0.4] }
        }
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-glow/14 via-transparent to-transparent"
        />

        <div className="relative flex items-start justify-between gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 text-accent">
            {platform.logo ? (
              <Image
                src={platform.logo.src}
                alt=""
                width={platform.logo.width}
                height={platform.logo.height}
                sizes="64px"
                className="h-8 w-8 object-contain"
              />
            ) : Icon ? (
              <Icon className="h-6 w-6" strokeWidth={2} />
            ) : null}
          </div>
          <span className="rounded-full border border-line-strong bg-chip px-2.5 py-1 text-[10px] font-bold tracking-wider text-muted uppercase">
            {platform.tag}
          </span>
        </div>

        <div className="relative mt-6 flex-1">
          <h3 className="text-xl font-extrabold tracking-tight text-foreground">{platform.name}</h3>
          <p className="mt-1 font-mono text-[11px] break-all text-accent-muted">
            {platform.domain}
          </p>
          <p className="mt-3 text-[13px] leading-relaxed text-muted">{platform.description}</p>
        </div>

        <div className="relative flex items-center gap-1.5 text-[13px] font-semibold text-accent">
          <span>Opening</span>
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </motion.div>
    </div>
  );
}

export default LaunchOverlay;
