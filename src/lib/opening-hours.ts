const TIMEZONE = "Europe/Vienna";

export type TimeSlot = {
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
};

/** Mo–Fr inkl. Mittagspausen (Europe/Vienna). */
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

export function isClinicOpen(date: Date = new Date()) {
  const { dayOfWeek, minutesOfDay } = getViennaNow(date);
  const slots = clinicSchedule[dayOfWeek] ?? [];

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

export function getNextOpening(date: Date = new Date()): NextOpening | null {
  for (let offset = 0; offset < 8; offset++) {
    const probe = new Date(date.getTime() + offset * 24 * 60 * 60 * 1000);
    const { dayOfWeek, minutesOfDay } = getViennaNow(probe);
    const slots = clinicSchedule[dayOfWeek] ?? [];

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

export function getTodayHoursLabel(date: Date = new Date()) {
  const { dayOfWeek } = getViennaNow(date);
  const slots = clinicSchedule[dayOfWeek] ?? [];
  if (!slots.length) return null;

  return slots
    .map(
      (slot) =>
        `${formatTime(slot.startHour, slot.startMinute)}–${formatTime(slot.endHour, slot.endMinute)}`,
    )
    .join(" & ");
}
