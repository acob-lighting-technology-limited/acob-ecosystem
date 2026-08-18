"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Mail } from "lucide-react";
import NeonMesh from "@/components/neon-mesh";
import PlatformCard, { type Platform } from "@/components/platform-card";
import LaunchOverlay, { type LaunchState } from "@/components/launch-overlay";

const platforms: Platform[] = [
  {
    name: "ACOB Lighting",
    domain: "www.acoblighting.com",
    href: "https://www.acoblighting.com",
    description: "Our corporate home — services, project portfolio, national reach, and company news.",
    tag: "Public",
    logo: { src: "/images/acob-mark.webp", width: 582, height: 582 },
  },
  {
    name: "Matrix",
    domain: "matrix.acoblighting.com",
    href: "https://matrix.acoblighting.com",
    description: "The internal ERP: HR, leave, help desk, correspondence, assets, and reporting.",
    tag: "Internal",
    logo: { src: "/images/matrix-logo.webp", width: 751, height: 574 },
  },
  {
    name: "Beverly",
    domain: "beverly.acoblighting.com",
    href: "https://beverly.acoblighting.com",
    description:
      "CRM and wallet operations — vendors, customers, vending activity, funding queues, and reports.",
    tag: "External",
    logo: { src: "/images/beverly-logo.png", width: 1024, height: 351 },
  },
  {
    name: "Webmail",
    domain: "www.acoblighting.com/mail",
    href: "https://www.acoblighting.com/mail",
    description: "Official corporate email client for @org.acoblighting.com staff.",
    tag: "Mail",
    icon: Mail,
  },
];

export default function Home() {
  const [launch, setLaunch] = useState<LaunchState | null>(null);
  const launchRef = useRef<Platform | null>(null);

  const handleLaunch = useCallback(
    (platform: Platform, rect: LaunchState["rect"]) => {
      launchRef.current = platform;
      setLaunch({ platform, rect });
      document.body.classList.add("is-launching");
    },
    []
  );

  // Fired by the overlay once the card has flipped and flown off.
  const handleLaunchDone = useCallback(() => {
    if (launchRef.current) window.location.href = launchRef.current.href;
  }, []);

  useEffect(() => {
    // Returning via the back button restores this page from the bfcache with
    // the overlay still mounted — clear it so the page is usable again.
    const handlePageShow = () => {
      launchRef.current = null;
      document.body.classList.remove("is-launching");
      setLaunch(null);
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      document.body.classList.remove("is-launching");
    };
  }, []);

  return (
    <main className="relative min-h-screen lg:h-screen lg:overflow-hidden">
      {/* Background layer */}
      <div className="fixed inset-0 z-0">
        <NeonMesh className="absolute inset-0" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(3,9,10,0.7)_100%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#03090a] to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#03090a] to-transparent"
        />
      </div>

      {/* Foreground — pointer-events-none lets the cursor drive the mesh;
          re-enabled on the interactive children. */}
      <div className="page-content pointer-events-none relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-7 sm:px-8 lg:h-screen lg:px-10">
        {/* -my-2 absorbs the taller logo so it scales up without pushing the
            hero and cards further down the page. */}
        <header className="animate-fade-up -my-2 flex shrink-0 items-center justify-between gap-4">
          <Image
            src="/images/acob-logo-dark-2026.png"
            alt="ACOB Lighting Technology Limited"
            width={3533}
            height={919}
            priority
            sizes="240px"
            className="h-12 w-auto sm:h-14"
          />
          <span className="pointer-events-auto hidden items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-3.5 py-1.5 text-[11px] font-bold tracking-wide text-white/70 backdrop-blur-xl sm:inline-flex">
            <span className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-[#b8862e]" />
            Celebrating 10 Years of Impact
          </span>
        </header>

        {/* Hero + cards */}
        <section className="flex flex-1 flex-col justify-center py-10 lg:py-0">
          <h1
            className="animate-fade-up max-w-3xl text-[2.15rem] leading-[1.06] font-extrabold tracking-tight text-white sm:text-5xl lg:text-[3.5rem]"
            style={{ animationDelay: "0.1s" }}
          >
            Every ACOB platform,{" "}
            <span className="bg-gradient-to-r from-[#7dfc9a] via-[#22c55e] to-[#7dfc9a] bg-clip-text text-transparent">
              one place.
            </span>
          </h1>

          <p
            className="animate-fade-up mt-5 max-w-xl text-[0.95rem] leading-relaxed text-white/55 sm:text-base"
            style={{ animationDelay: "0.18s" }}
          >
            A single gateway into the systems that run ACOB Lighting Technology Limited. Pick where
            you&apos;re headed.
          </p>

          <div className="pointer-events-auto mt-9 grid gap-4 sm:grid-cols-2 lg:mt-11 lg:grid-cols-4">
            {platforms.map((platform, i) => (
              <PlatformCard
                key={platform.domain}
                platform={platform}
                index={i}
                onLaunch={handleLaunch}
              />
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer
          className="animate-fade-up flex shrink-0 flex-col items-start justify-between gap-2 border-t border-white/8 pt-5 text-[11px] text-white/35 sm:flex-row sm:items-center"
          style={{ animationDelay: "0.75s" }}
        >
          <p>© {new Date().getFullYear()} ACOB Lighting Technology Limited. All rights reserved.</p>
          <div className="pointer-events-auto flex items-center gap-5">
            <a href="tel:+2347049202634" className="transition-colors hover:text-[#7dfc9a]">
              +234 704 920 2634
            </a>
            <a href="mailto:info@acoblighting.com" className="transition-colors hover:text-[#7dfc9a]">
              info@acoblighting.com
            </a>
          </div>
        </footer>
      </div>

      {launch && <LaunchOverlay launch={launch} onDone={handleLaunchDone} />}
    </main>
  );
}
