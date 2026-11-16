'use client';

import { useCallback, useEffect, useState } from 'react';
import { X } from 'lucide-react';

/** How long the hint stays before it leaves by itself. */
const VISIBLE_MS = 7000;
/** Matches christmas-hint-out in src/app/globals.css. */
const EXIT_MS = 500;

type Place = { top: number; right: number; arrow: number };

/** The visible theme button ([data-theme-toggle]); the header has one per layout. */
function findToggle(): HTMLElement | undefined {
  return Array.from(
    document.querySelectorAll<HTMLElement>('[data-theme-toggle]'),
  ).find(el => el.getBoundingClientRect().width > 0);
}

function placeUnder(toggle: HTMLElement): Place {
  const rect = toggle.getBoundingClientRect();
  const right = Math.max(12, window.innerWidth - rect.right - 4);
  // Arrow sits under the middle of the button, measured from the hint's right edge.
  const arrow = window.innerWidth - right - (rect.left + rect.width / 2);
  return { top: rect.bottom + 12, right, arrow };
}

/**
 * A small tooltip (not a dialog) pointing at the theme button after the
 * season's greeting, so people know where to switch the Christmas theme off.
 * Leaves by itself, on ✕, or when the button is used.
 */
export function ChristmasThemeHint({ onDone }: { onDone: () => void }) {
  const [place, setPlace] = useState<Place | null>(null);
  const [leaving, setLeaving] = useState(false);

  const leave = useCallback(() => {
    setLeaving(true);
    window.setTimeout(onDone, EXIT_MS);
  }, [onDone]);

  useEffect(() => {
    const toggle = findToggle();
    if (!toggle) {
      onDone();
      return;
    }
    const update = () => setPlace(placeUnder(toggle));
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, { passive: true });
    toggle.addEventListener('click', leave);
    const timer = window.setTimeout(leave, VISIBLE_MS);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update);
      toggle.removeEventListener('click', leave);
      window.clearTimeout(timer);
    };
  }, [leave, onDone]);

  if (!place) {
    return null;
  }
  return (
    <div
      className="christmas-hint"
      role="status"
      data-leaving={leaving || undefined}
      style={
        {
          top: place.top,
          right: place.right,
          '--hint-arrow': `${place.arrow}px`,
        } as React.CSSProperties
      }
    >
      <span>You can turn the Christmas theme off here</span>
      <button
        type="button"
        aria-label="Dismiss tip"
        title="Dismiss tip"
        onClick={leave}
      >
        <X className="size-3.5" aria-hidden />
      </button>
    </div>
  );
}
