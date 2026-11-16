"use client"

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react"
import { Snowflake, Sparkles, TreePine, X } from "lucide-react"
import { ChristmasThemeHint } from "@/components/christmas-theme-hint"
import { isChristmasPeriod } from "@/lib/christmas-period"

type Option = "theme" | "flakes" | "drift"
const eventName = "christmas-preferences"
const defaults = "0000"

function enabled(option: Option) {
  try {
    return localStorage.getItem(`acob-christmas-${option}`) !== "off"
  } catch {
    return true
  }
}

function snapshot() {
  return [isChristmasPeriod(), enabled("theme"), enabled("flakes"), enabled("drift")].map(Number).join("")
}

function subscribe(listener: () => void) {
  window.addEventListener(eventName, listener)
  window.addEventListener("storage", listener)
  return () => {
    window.removeEventListener(eventName, listener)
    window.removeEventListener("storage", listener)
  }
}

function useChristmasPreferences() {
  return useSyncExternalStore(subscribe, snapshot, () => defaults).split("").map(value => value === "1")
}

export function useChristmasAppearance() {
  const [available, theme] = useChristmasPreferences()
  return available && theme
}

function applyAppearance(active: boolean) {
  const root = document.documentElement
  if (active) root.dataset.season = "christmas"
  else delete root.dataset.season
}

/** Match the Matrix hat timing: drop finishes ~2.4s in, lift takes 0.9s. */
const HAT_ARRIVAL_MS = 3800
const HAT_LIFT_MS = 900
let revealVersion = 0

function reveal(active: boolean) {
  const root = document.documentElement
  const logo = Array.from(document.querySelectorAll<HTMLElement>("header[data-christmas-header] img")).find(image => image.getBoundingClientRect().width > 0)
  const bounds = logo?.getBoundingClientRect()
  root.style.setProperty("--christmas-origin", bounds ? `${bounds.left + bounds.width / 2}px ${bounds.top + bounds.height / 2}px` : "50% 0%")
  const version = ++revealVersion
  root.classList.remove("christmas-arriving", "christmas-departing")
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    applyAppearance(active)
    return
  }
  // On the way out the header hat gets its own view-transition layer, so it
  // stays on above the shrinking look and lifts off near the end (CSS:
  // ::view-transition-old(christmas-hat)) instead of leaving first.
  let liftingHat: HTMLElement | undefined
  const spread = () => {
    if (!document.startViewTransition) {
      applyAppearance(active)
      root.classList.remove("christmas-departing")
      return
    }
    root.dataset.christmasTransition = active ? "enter" : "exit"
    const transition = document.startViewTransition(() => applyAppearance(active))
    const cleanup = () => {
      liftingHat?.style.removeProperty("view-transition-name")
      if (version !== revealVersion) return
      delete root.dataset.christmasTransition
      root.classList.remove("christmas-departing")
    }
    void transition.finished.then(cleanup, cleanup)
  }
  if (active) {
    // As in Matrix: the look spreads from the logo and the hat drops on.
    root.classList.add("christmas-arriving")
    window.setTimeout(() => {
      if (version === revealVersion) root.classList.remove("christmas-arriving")
    }, HAT_ARRIVAL_MS)
    spread()
    return
  }
  if ("startViewTransition" in document) {
    // Reverse: the look shrinks back into the logo with the hat still on; the
    // hat lifts off as it closes.
    liftingHat = Array.from(
      document.querySelectorAll<HTMLElement>("header[data-christmas-header] .christmas-hat")
    ).find(hat => hat.getBoundingClientRect().width > 0)
    liftingHat?.style.setProperty("view-transition-name", "christmas-hat")
    spread()
    return
  }
  // No view transitions: lift the hat, then switch.
  root.classList.add("christmas-departing")
  window.setTimeout(() => {
    if (version === revealVersion) spread()
  }, HAT_LIFT_MS)
}

/**
 * Santa hat over the 2026 logo, as its own layer so it can drop on and lift
 * off. CSS shows it only while html[data-season="christmas"] is set, and only
 * the one matching light or dark mode. Put it in a `relative` wrapper around
 * the plain logo; the hat image is the logo canvas plus 8px of headroom.
 */
export function ChristmasLogoHat({ mode }: { mode: "light" | "dark" }) {
  return <span aria-hidden className="christmas-hat" data-mode={mode} />
}

/** Matches the christmas-greet-out animation in globals.css. */
const GREETING_EXIT_MS = 450

export function ChristmasTheme() {
  const [available, theme, flakes, drift] = useChristmasPreferences()
  const wasAvailable = useRef(false)
  const [greeting, setGreeting] = useState(false)
  const [greetingLeaving, setGreetingLeaving] = useState(false)
  const [hint, setHint] = useState(false)
  const closeHint = useCallback(() => setHint(false), [])
  // Slides back up and out like a notification, then unmounts.
  const closeGreeting = useCallback(() => {
    setGreetingLeaving(true)
    window.setTimeout(() => {
      setGreeting(false)
      setGreetingLeaving(false)
      // Then point at the theme button so people know where to switch it off.
      setHint(true)
    }, GREETING_EXIT_MS)
  }, [])
  useEffect(() => {
    const timer = window.setInterval(() => window.dispatchEvent(new Event(eventName)), 60_000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.christmasSnow = flakes ? (drift ? "drift" : "still") : "off"
  }, [flakes, drift])

  // Christmas favicon: the hatted bulb, matched to the browser's tab colour.
  // Next streams its own icon <link>s into the page, possibly after this runs,
  // so a watcher parks every one of them (rel → data-christmas-rel) while ours
  // is the only icon left. Turning the theme off puts them back.
  useEffect(() => {
    if (!available || !theme) return
    const scheme = matchMedia("(prefers-color-scheme: dark)")
    const ours = document.createElement("link")
    ours.rel = "icon"
    ours.type = "image/png"
    ours.sizes.value = "256x256"
    const setHref = () => {
      ours.href = `/favicon-${scheme.matches ? "dark" : "light"}-christmas.png`
    }
    const park = () => {
      document.querySelectorAll<HTMLLinkElement>("link[rel~='icon']").forEach(link => {
        if (link === ours) return
        link.dataset.christmasRel = link.rel
        link.rel = "christmas-parked-icon"
      })
    }
    setHref()
    park()
    document.head.appendChild(ours)
    const observer = new MutationObserver(park)
    observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["rel"] })
    scheme.addEventListener("change", setHref)
    return () => {
      observer.disconnect()
      scheme.removeEventListener("change", setHref)
      ours.remove()
      document.querySelectorAll<HTMLLinkElement>("link[data-christmas-rel]").forEach(link => {
        link.rel = link.dataset.christmasRel ?? "icon"
        delete link.dataset.christmasRel
      })
    }
  }, [available, theme])

  useEffect(() => {
    const active = available && theme
    const wasActive = document.documentElement.dataset.season === "christmas"
    const firstInSeason = available && !wasAvailable.current
    wasAvailable.current = available
    if (active === wasActive) return
    const replay = new URLSearchParams(location.search).get("season-intro") === "1"
    if (active && firstInSeason && !replay) {
      try {
        const now = new Date()
        const seasonYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()
        const key = `acob-christmas-reveal-${seasonYear}`
        if (localStorage.getItem(key) && !wasActive) {
          applyAppearance(active)
          return
        }
        localStorage.setItem(key, "1")
      } catch {
        // The reveal still works when storage is unavailable.
      }
    }
    const revealTimer = window.setTimeout(() => reveal(active), active && firstInSeason ? 1200 : 0)
    if (!active || !firstInSeason) {
      return () => window.clearTimeout(revealTimer)
    }
    const greetingTimer = window.setTimeout(() => setGreeting(true), 3000)
    const dismissTimer = window.setTimeout(closeGreeting, 10000)
    return () => {
      window.clearTimeout(revealTimer)
      window.clearTimeout(greetingTimer)
      window.clearTimeout(dismissTimer)
    }
  }, [available, theme, closeGreeting])

  if (!available || !theme) return null
  if (hint) return <ChristmasThemeHint onDone={closeHint} />
  if (!greeting) return null
  return (
    <div className="christmas-greeting" role="status" data-leaving={greetingLeaving || undefined}>
      <Snowflake className="christmas-greeting-icon" aria-hidden />
      <span>Season&apos;s greetings from ACOB</span>
      <button type="button" aria-label="Dismiss greeting" title="Dismiss greeting" onClick={closeGreeting}>
        <X className="size-4" aria-hidden />
      </button>
    </div>
  )
}

export function ChristmasThemeOptions({ closeMenu }: { closeMenu: () => void }) {
  const [available, theme, flakes, drift] = useChristmasPreferences()
  if (!available) return null
  const options = [
    { key: "theme", label: "Christmas theme", Icon: TreePine, checked: theme, disabled: false },
    { key: "flakes", label: "Snowflakes", Icon: Snowflake, checked: theme && flakes, disabled: !theme },
    { key: "drift", label: "Drifting", Icon: Sparkles, checked: theme && flakes && drift, disabled: !theme || !flakes },
  ] as const

  return (
    <div className="christmas-options" role="group" aria-label="Christmas">
      <p>Christmas</p>
      {options.map(({ key, label, Icon, checked, disabled }) => (
        <label key={key}>
          <span className="christmas-option-icon"><Icon className="size-4" aria-hidden /></span>
          <span>{label}</span>
          <input type="checkbox" role="switch" aria-label={label} checked={checked} disabled={disabled} onChange={(event) => {
            try {
              window.localStorage.setItem(`acob-christmas-${key}`, event.currentTarget.checked ? "on" : "off")
            } catch {
              return
            }
            if (key === "theme") closeMenu()
            window.dispatchEvent(new Event(eventName))
          }} />
        </label>
      ))}
    </div>
  )
}
