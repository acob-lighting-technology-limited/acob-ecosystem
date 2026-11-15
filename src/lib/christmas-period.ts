const lagosCalendar = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Africa/Lagos',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
});

function lagosDate(now: Date) {
  const parts = lagosCalendar.formatToParts(now);
  const value = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  return { year: value('year'), month: value('month'), day: value('day') };
}

export function isChristmasPeriod(now = new Date()): boolean {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV !== "production" && process.env.NEXT_PUBLIC_SEASONAL_THEME === "christmas") return true
  const { month, day } = lagosDate(now);
  return month === 12 || (month === 1 && day <= 6);
}

