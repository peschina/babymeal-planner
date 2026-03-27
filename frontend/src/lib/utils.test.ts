import { describe, it, expect } from 'vitest';
import { buildCalendar } from './utils.js';
import type { PlanDay } from './types.js';

// Helpers
function makeDay(n: number): PlanDay {
  return {
    day: n,
    lunch: {
      id: `lunch-${n}`,
      cereal: { name: 'Rice', quantityG: 30 },
      protein: { name: 'Chicken', quantityG: 40 },
      vegetables: [{ name: 'Carrot', quantityG: 50 }],
      oliveOil: { quantityG: 5 },
      broth: { quantityMl: 150 },
    },
    dinner: {
      id: `dinner-${n}`,
      cereal: { name: 'Pasta', quantityG: 30 },
      protein: { name: 'Fish', quantityG: 40 },
      vegetables: [{ name: 'Zucchini', quantityG: 50 }],
      oliveOil: { quantityG: 5 },
      broth: { quantityMl: 150 },
    },
  };
}

const thirtyDays = Array.from({ length: 30 }, (_, i) => makeDay(i + 1));

// Fixed dates for deterministic tests
const MONDAY   = new Date('2026-03-23T00:00:00'); // Monday
const THURSDAY = new Date('2026-03-26T00:00:00'); // mid-week
const SUNDAY   = new Date('2026-03-29T00:00:00'); // Sunday

describe('buildCalendar — structure', () => {
  it('always returns exactly 7 weekday labels (Lun–Dom)', () => {
    const cal = buildCalendar(thirtyDays, MONDAY);
    expect(cal.weekdayLabels).toHaveLength(7);
    expect(cal.weekdayLabels[0]).toBe('Lun');
    expect(cal.weekdayLabels[6]).toBe('Dom');
  });

  it('each week row has exactly 7 cells', () => {
    const cal = buildCalendar(thirtyDays, MONDAY);
    for (const week of cal.weeks) {
      expect(week.cells).toHaveLength(7);
    }
  });

  it('total filled plan cells equals 30', () => {
    const cal = buildCalendar(thirtyDays, MONDAY);
    const planCells = cal.weeks
      .flatMap((w) => w.cells)
      .filter((c) => c !== null && c.planDay !== null);
    expect(planCells).toHaveLength(30);
  });

  it('plan day 1 maps to the start date', () => {
    const cal = buildCalendar(thirtyDays, MONDAY);
    const firstPlanCell = cal.weeks.flatMap((w) => w.cells).find((c) => c?.planDay?.day === 1);
    expect(firstPlanCell).toBeTruthy();
    expect(firstPlanCell!.dayOfMonth).toBe(23); // March 23
  });

  it('plan day 30 maps to startDate + 29 days', () => {
    const cal = buildCalendar(thirtyDays, MONDAY);
    const lastPlanCell = cal.weeks.flatMap((w) => w.cells).find((c) => c?.planDay?.day === 30);
    expect(lastPlanCell).toBeTruthy();
    expect(lastPlanCell!.dayOfMonth).toBe(21); // April 21
  });
});

describe('buildCalendar — Monday alignment', () => {
  it('grid starts on Monday when startDate is already Monday', () => {
    const cal = buildCalendar(thirtyDays, MONDAY);
    // First non-null cell in first week should be at column 0 (Monday)
    expect(cal.weeks[0].cells[0]?.dayOfMonth).toBe(23);
  });

  it('grid starts on Monday of the containing week when startDate is mid-week', () => {
    const cal = buildCalendar(thirtyDays, THURSDAY); // Thursday March 26
    // Grid should start on Monday March 23
    expect(cal.weeks[0].cells[0]?.dayOfMonth).toBe(23);
  });

  it('grid starts on Monday of the containing week when startDate is Sunday', () => {
    const cal = buildCalendar(thirtyDays, SUNDAY); // Sunday March 29
    // Grid should start on Monday March 23
    expect(cal.weeks[0].cells[0]?.dayOfMonth).toBe(23);
  });

  it('last week ends on Sunday', () => {
    const cal = buildCalendar(thirtyDays, MONDAY);
    const lastWeek = cal.weeks[cal.weeks.length - 1];
    // Last cell should be a Sunday — April 26 (day 6 of that week)
    expect(lastWeek.cells[6]).not.toBeNull();
  });
});

describe('buildCalendar — today marking', () => {
  it('marks exactly one cell as isToday', () => {
    const cal = buildCalendar(thirtyDays, MONDAY);
    const todayCells = cal.weeks
      .flatMap((w) => w.cells)
      .filter((c) => c !== null && c.isToday);
    expect(todayCells).toHaveLength(1);
  });

  it('the today cell corresponds to plan day 1', () => {
    const cal = buildCalendar(thirtyDays, MONDAY);
    const todayCell = cal.weeks
      .flatMap((w) => w.cells)
      .find((c) => c !== null && c.isToday);
    expect(todayCell!.planDay?.day).toBe(1);
    expect(todayCell!.dayOfMonth).toBe(23);
  });

  it('no cell is marked today when startDate is mid-week (today is still day 1)', () => {
    const cal = buildCalendar(thirtyDays, THURSDAY); // March 26
    const todayCell = cal.weeks
      .flatMap((w) => w.cells)
      .find((c) => c !== null && c.isToday);
    expect(todayCell!.planDay?.day).toBe(1);
    expect(todayCell!.dayOfMonth).toBe(26);
  });
});

describe('buildCalendar — filler cells', () => {
  it('cells before plan start have planDay === null', () => {
    // March 26 (Thursday) as start — Monday/Tue/Wed cells are fillers
    const cal = buildCalendar(thirtyDays, THURSDAY);
    const firstWeekCells = cal.weeks[0].cells;
    // Mon(23), Tue(24), Wed(25) should be filler (no planDay); Thu(26) = day1
    expect(firstWeekCells[0]!.planDay).toBeNull(); // Monday March 23
    expect(firstWeekCells[1]!.planDay).toBeNull(); // Tuesday March 24
    expect(firstWeekCells[2]!.planDay).toBeNull(); // Wednesday March 25
    expect(firstWeekCells[3]!.planDay?.day).toBe(1); // Thursday March 26 = day 1
  });

  it('filler cells still have correct dayOfMonth values', () => {
    const cal = buildCalendar(thirtyDays, THURSDAY);
    const firstWeekCells = cal.weeks[0].cells;
    expect(firstWeekCells[0]!.dayOfMonth).toBe(23);
    expect(firstWeekCells[1]!.dayOfMonth).toBe(24);
    expect(firstWeekCells[2]!.dayOfMonth).toBe(25);
  });
});

describe('buildCalendar — month labels', () => {
  it('first week gets a month label', () => {
    const cal = buildCalendar(thirtyDays, MONDAY);
    expect(cal.weeks[0].monthLabel).not.toBeNull();
    expect(cal.weeks[0].monthLabel).toContain('Marzo');
  });

  it('a second month label appears when plan spans two months', () => {
    // March 23 + 30 days reaches April 21 — spans 2 months
    const cal = buildCalendar(thirtyDays, MONDAY);
    const monthLabels = cal.weeks
      .filter((w) => w.monthLabel !== null)
      .map((w) => w.monthLabel!);
    expect(monthLabels.length).toBeGreaterThanOrEqual(2);
    expect(monthLabels.some((l) => l.includes('Aprile'))).toBe(true);
  });

  it('single-month plan produces only one month label', () => {
    // Use only 3 days starting on March 1 (Sunday) — stays in March
    const threeDays = Array.from({ length: 3 }, (_, i) => makeDay(i + 1));
    const marchFirst = new Date('2026-03-01T00:00:00'); // Sunday
    const cal = buildCalendar(threeDays, marchFirst);
    const monthLabels = cal.weeks.filter((w) => w.monthLabel !== null);
    expect(monthLabels).toHaveLength(1);
    expect(monthLabels[0].monthLabel).toContain('Marzo');
  });
});

describe('buildCalendar — title', () => {
  it('produces single-month title when plan stays within one month', () => {
    const threeDays = Array.from({ length: 3 }, (_, i) => makeDay(i + 1));
    const marchFirst = new Date('2026-03-01T00:00:00');
    const cal = buildCalendar(threeDays, marchFirst);
    expect(cal.title).toBe('Marzo 2026');
  });

  it('produces two-month title when plan spans two months', () => {
    const cal = buildCalendar(thirtyDays, MONDAY); // March 23 → April 21
    expect(cal.title).toBe('Marzo – Aprile 2026');
  });

  it('title includes the correct year', () => {
    const cal = buildCalendar(thirtyDays, MONDAY);
    expect(cal.title).toContain('2026');
  });
});
