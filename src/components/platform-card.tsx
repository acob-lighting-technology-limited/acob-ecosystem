"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Platform {
  name: string;
  domain: string;
  href: string;
  description: string;
  tag: string;
  /** Brand mark for the platform. Falls back to `icon` when absent. */
  logo?: { src: string; width: number; height: number };
  icon?: LucideIcon;
}

export function PlatformCard({
  platform,
  index,
  onLaunch,
}: {
  platform: Platform;
  index: number;
  onLaunch: (
    platform: Platform,
    rect: { top: number; left: number; width: number; height: number }
  ) => void;
}) {
  const { name, domain, href, description, tag, logo, icon: Icon } = platform;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-card
      onClick={(e) => {
        // Let modified clicks (new tab/window, middle-click) behave natively.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        // The overlay card flies from exactly where this card sits.
        const r = e.currentTarget.getBoundingClientRect();
        onLaunch(platform, { top: r.top, left: r.left, width: r.width, height: r.height });
      }}
      className="group animate-fade-up relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-glow/45 hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glow"
      style={{ animationDelay: `${0.3 + index * 0.08}s` }}
    >
      {/* Hover wash — under the content, never intercepts the pointer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-glow/12 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 text-accent transition-transform duration-300 group-hover:scale-110">
          {logo ? (
            <Image
              src={logo.src}
              alt=""
              width={logo.width}
              height={logo.height}
              // Rendered at 24px; without this Next picks a srcset entry from
              // the intrinsic width (up to 2048px) for a thumbnail-sized mark.
              sizes="48px"
              className="h-6 w-6 object-contain"
            />
          ) : Icon ? (
            <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
          ) : null}
        </div>
        <span className="rounded-full border border-line-strong bg-chip px-2 py-0.5 text-[9px] font-bold tracking-wider text-muted uppercase">
          {tag}
        </span>
      </div>

      <div className="relative mt-4 flex-1">
        <h3 className="text-base font-extrabold tracking-tight text-foreground">{name}</h3>
        <p className="mt-0.5 font-mono text-[10px] break-all text-accent-muted">{domain}</p>
        <p className="mt-2.5 text-[12.5px] leading-relaxed text-muted">{description}</p>
      </div>

      <div className="relative mt-4 flex items-center gap-1.5 text-[12.5px] font-semibold text-soft transition-colors group-hover:text-accent">
        <span>Open</span>
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </a>
  );
}

export default PlatformCard;
