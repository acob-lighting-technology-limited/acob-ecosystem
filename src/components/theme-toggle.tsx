"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const themes = [
  { name: "Light", value: "light", icon: Sun },
  { name: "Dark", value: "dark", icon: Moon },
  { name: "System", value: "system", icon: Monitor },
];

/**
 * Light / Dark / System picker, matching the ACOB Website header toggle.
 * The trigger's Sun/Moon swap is driven purely by the `dark` class, so it
 * renders correctly before hydration and never flashes the wrong icon.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // `theme` is unknown on the server; only mark the active option once mounted.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event: Event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="pointer-events-auto relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="group relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-line-strong bg-surface text-soft backdrop-blur-xl transition-colors hover:border-glow/45 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glow"
      >
        <Sun className="h-[1.05rem] w-[1.05rem] scale-100 rotate-0 transition-all duration-300 dark:scale-0 dark:-rotate-90" />
        <Moon className="absolute h-[1.05rem] w-[1.05rem] scale-0 rotate-90 transition-all duration-300 dark:scale-100 dark:rotate-0" />
        <span className="sr-only">Toggle theme</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-xl border border-line-strong bg-panel p-1.5 shadow-[0_20px_50px_-15px_var(--panel-shadow)]"
          >
            {themes.map(({ name, value, icon: Icon }) => {
              const active = mounted && theme === value;
              return (
                <button
                  key={value}
                  type="button"
                  role="menuitemradio"
                  aria-checked={active}
                  onClick={() => {
                    setTheme(value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "group/item flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-[13px] transition-colors",
                    active
                      ? "bg-glow/10 font-semibold text-accent"
                      : "text-foreground hover:bg-chip"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full transition-colors",
                      active
                        ? "bg-brand text-white"
                        : "bg-glow/10 text-muted group-hover/item:bg-brand group-hover/item:text-white"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span>{name}</span>
                  {active && (
                    <motion.span
                      layoutId="activeTheme"
                      className="ml-auto h-1.5 w-1.5 rounded-full bg-glow"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ThemeToggle;
