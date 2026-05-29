import { describe, it, expect } from 'vitest';
import { toIcal } from '@/lib/ical';

const STEPS = ['Book a tutoring appointment', 'Visit the food pantry', 'Submit FAFSA'];

describe('toIcal', () => {
  it('produces a valid VCALENDAR envelope', () => {
    const ics = toIcal(STEPS);
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('END:VCALENDAR');
    expect(ics).toContain('VERSION:2.0');
  });

  it('creates one VEVENT per step', () => {
    const ics = toIcal(STEPS);
    const count = (ics.match(/BEGIN:VEVENT/g) ?? []).length;
    expect(count).toBe(STEPS.length);
  });

  it('includes the step text in each SUMMARY', () => {
    const ics = toIcal(STEPS);
    for (const step of STEPS) {
      expect(ics).toContain(step);
    }
  });

  it('sets PRIORITY:1 on the first event when urgent=true', () => {
    const ics = toIcal(STEPS, true);
    expect(ics).toContain('PRIORITY:1');
  });

  it('does not set PRIORITY:1 when urgent=false', () => {
    const ics = toIcal(STEPS, false);
    expect(ics).not.toContain('PRIORITY:1');
  });

  it('spaces non-urgent events 2 days apart', () => {
    const base = new Date('2024-01-01T00:00:00Z');
    const ics = toIcal(['Step A', 'Step B'], false, base);
    // Step A starts on 2024-01-01 (i=0 → offset 0*2=0 days)
    expect(ics).toContain('DTSTART:20240101');
    // Step B starts on 2024-01-03 (i=1 → offset 1*2=2 days)
    expect(ics).toContain('DTSTART:20240103');
  });

  it('spaces urgent events 1 day apart (first event today)', () => {
    const base = new Date('2024-01-01T00:00:00Z');
    const ics = toIcal(['Urgent A', 'Urgent B'], true, base);
    expect(ics).toContain('DTSTART:20240101');
    expect(ics).toContain('DTSTART:20240102');
  });

  it('escapes semicolons and commas in SUMMARY', () => {
    const ics = toIcal(['Step with; semicolons, and commas']);
    expect(ics).toContain('\\;');
    expect(ics).toContain('\\,');
  });

  it('folds lines longer than 75 characters', () => {
    const longStep = 'A'.repeat(100);
    const ics = toIcal([longStep]);
    const lines = ics.split('\r\n');
    for (const line of lines) {
      expect(line.length, `line too long: "${line}"`).toBeLessThanOrEqual(75);
    }
  });

  it('handles an empty steps array gracefully', () => {
    const ics = toIcal([]);
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).not.toContain('BEGIN:VEVENT');
  });
});
