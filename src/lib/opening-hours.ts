const TIMEZONE = "Europe/Vienna";

export type TimeSlot = {
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
};

export type SpecialDay = {
  /** YYYY-MM-DD, Europe/Vienna calendar date */
  date: string;
  /** Empty array = closed that day (e.g. a public holiday) */
  windows: TimeSlot[];
  note?: { de: string; tr: string };
};

export type ClosurePeriod = {
  /** YYYY-MM-DD, inclusive */
  startDate: string;
  /** YYYY-MM-DD, inclusive */
  endDate: string;
  reason?: { de: string; tr: string };
};

/** Everything isClinicOpen/getTodayHoursLabel/getNextOpening need to resolve
 * a date to "open/closed and until when" — regular hours, special days
 * (holidays with different or no hours), and closure periods (vacation),
 * precedence closurePeriods > specialDays > weekdays. Plan RC Phase 5: this
 * is the single shared structure for both CONTENT_SOURCE=local (built from
 * `clinicSchedule` below) and =sanity (built from the `openingHours` +
 * `closurePeriod` documents in src/lib/opening-hours-source.ts) — resolving
 * the "two representations of the same fact" risk documented in
 * docs/migration/opening-hours-consistency-risk.md. */
export type ResolvedSchedule = {
  weekdays: Record<number, TimeSlot[]>;
  specialDays: SpecialDay[];
  closurePeriods: ClosurePeriod[];
};

/** Mo–Fr inkl. Mittagspausen (Europe/Vienna). The clinic's own approved
 * hours — still the fallback default when Sanity is unreachable/unset. */
export const clinicSchedule: Record<number, TimeSlot[]> = {
  1: [
    { startHour: 9, startMinute: 0, endHour: 13, endMinute: 0 },
    { startHour: 14, startMinute: 0, endHour: 19, endMinute: 0 },
  ],
  2: [{ startHour: 9, startMinute: 0, endHour: 14, endMinute: 0 }],
  3: [
    { startHour: 9, startMinute: 0, endHour: 12, endMinute: 0 },
    { startHour: 13, startMinute: 0, endHour: 17, endMinute: 0 },
  ],
  4: [{ startHour: 9, startMinute: 0, endHour: 14, endMinute: 0 }],
  5: [{ startHour: 9, startMinute: 0, endHour: 14, endMinute: 0 }],
  0: [],
  6: [],
};

export const defaultSchedule: ResolvedSchedule = {
  weekdays: clinicSchedule,
  specialDays: [],
  closurePeriods: [],
};

const weekdayShort: Record<number, string> = {
  0: "sun",
  1: "mon",
  2: "tue",
  3: "wed",
  4: "thu",
  5: "fri",
  6: "sat",
};

function toMinutes(hour: number, minute: number) {
  return hour * 60 + minute;
}

function formatTime(hour: number, minute: number) {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function getViennaNow(date: Date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";

  const weekdayMap: Record<string, number> = {
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
    Sun: 0,
  };

  return {
    dayOfWeek: weekdayMap[get("weekday")] ?? 0,
    minutesOfDay: toMinutes(parseInt(get("hour"), 10), parseInt(get("minute"), 10)),
  };
}

/** YYYY-MM-DD for the given instant, in Europe/Vienna's calendar date —
 * deliberately timezone-aware (not `date.toISOString().slice(0,10)`, which
 * would use UTC and could be off by a day near midnight). */
export function getViennaDateString(date: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

function activeClosure(dateStr: string, schedule: ResolvedSchedule): ClosurePeriod | undefined {
  return schedule.closurePeriods.find((c) => dateStr >= c.startDate && dateStr <= c.endDate);
}

function specialDayFor(dateStr: string, schedule: ResolvedSchedule): SpecialDay | undefined {
  return schedule.specialDays.find((s) => s.date === dateStr);
}

/** Resolves the actual time windows for a given date, applying precedence:
 * an active closure period (vacation) closes the clinic entirely; else a
 * matching special day (holiday/temporary-hours) overrides the regular
 * weekday windows; else the regular weekly schedule applies. */
function slotsFor(date: Date, schedule: ResolvedSchedule): TimeSlot[] {
  const dateStr = getViennaDateString(date);
  if (activeClosure(dateStr, schedule)) return [];
  const special = specialDayFor(dateStr, schedule);
  if (special) return special.windows;
  const { dayOfWeek } = getViennaNow(date);
  return schedule.weekdays[dayOfWeek] ?? [];
}

/** The reason text for today, if the clinic is closed specifically due to
 * an active closure period (vacation) rather than just being a normal
 * closed day (e.g. Sunday) — null in all other cases. */
export function getActiveClosureReason(
  schedule: ResolvedSchedule = defaultSchedule,
  date: Date = new Date(),
): { de: string; tr: string } | null {
  const closure = activeClosure(getViennaDateString(date), schedule);
  return closure?.reason ?? null;
}

export function isClinicOpen(schedule: ResolvedSchedule = defaultSchedule, date: Date = new Date()) {
  const { minutesOfDay } = getViennaNow(date);
  const slots = slotsFor(date, schedule);

  return slots.some((slot) => {
    const start = toMinutes(slot.startHour, slot.startMinute);
    const end = toMinutes(slot.endHour, slot.endMinute);
    return minutesOfDay >= start && minutesOfDay < end;
  });
}

export type NextOpening = {
  dayKey: string;
  time: string;
  isToday: boolean;
};

export function getNextOpening(
  schedule: ResolvedSchedule = defaultSchedule,
  date: Date = new Date(),
): NextOpening | null {
  for (let offset = 0; offset < 8; offset++) {
    const probe = new Date(date.getTime() + offset * 24 * 60 * 60 * 1000);
    const { dayOfWeek, minutesOfDay } = getViennaNow(probe);
    const slots = slotsFor(probe, schedule);

    for (const slot of slots) {
      const start = toMinutes(slot.startHour, slot.startMinute);
      if (offset === 0 && minutesOfDay >= start) continue;

      return {
        dayKey: weekdayShort[dayOfWeek],
        time: formatTime(slot.startHour, slot.startMinute),
        isToday: offset === 0,
      };
    }
  }

  return null;
}

export function getTodayHoursLabel(schedule: ResolvedSchedule = defaultSchedule, date: Date = new Date()) {
  const slots = slotsFor(date, schedule);
  if (!slots.length) return null;

  return slots
    .map(
      (slot) =>
        `${formatTime(slot.startHour, slot.startMinute)}–${formatTime(slot.endHour, slot.endMinute)}`,
    )
    .join(" & ");
}

/** Display string for an arbitrary weekday (1=Mon..6=Sat,0=Sun) ignoring
 * special days/closures — used for the "Montag: 09:00-13:00 & 14:00-19:00"
 * style weekly-hours list (HoursCard), as opposed to "today's" hours. */
export function getWeekdayHoursLabel(schedule: ResolvedSchedule, dayOfWeek: number): string | null {
  const slots = schedule.weekdays[dayOfWeek] ?? [];
  if (!slots.length) return null;
  return slots
    .map((slot) => `${formatTime(slot.startHour, slot.startMinute)}–${formatTime(slot.endHour, slot.endMinute)}`)
    .join(" & ");
}
