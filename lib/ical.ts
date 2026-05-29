/** Generates a RFC 5545-compliant .ics string from a list of next-step strings. */

function formatDtStamp(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
}

function escapeText(s: string): string {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/** Fold long lines to 75 octets per RFC 5545 §3.1. */
function foldLine(line: string): string {
  if (line.length <= 75) return line;
  const chunks: string[] = [];
  chunks.push(line.slice(0, 75));
  let i = 75;
  while (i < line.length) {
    chunks.push(' ' + line.slice(i, i + 74));
    i += 74;
  }
  return chunks.join('\r\n');
}

export function toIcal(steps: string[], urgent = false, baseDate = new Date()): string {
  const dtstamp = formatDtStamp(new Date());

  const events = steps.map((step, i) => {
    const dt = new Date(baseDate);
    // Urgent: first step is today, rest spaced 1 day. Normal: spaced 2 days.
    dt.setDate(dt.getDate() + (urgent && i === 0 ? 0 : i * (urgent ? 1 : 2)));
    const dtstart = formatDtStamp(dt);

    const lines = [
      'BEGIN:VEVENT',
      `UID:uw-compass-${Date.now()}-${i}@compass.uw.edu`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART:${dtstart}`,
      'DURATION:PT30M',
      foldLine(`SUMMARY:${escapeText(step.slice(0, 200))}`),
      foldLine(`DESCRIPTION:UW Compass next step ${i + 1} of ${steps.length}.`),
      ...(urgent && i === 0 ? ['PRIORITY:1'] : []),
      'END:VEVENT',
    ];
    return lines.join('\r\n');
  });

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'CALSCALE:GREGORIAN',
    'PRODID:-//UW Compass//EN',
    'X-WR-CALNAME:UW Compass Next Steps',
    ...events,
    'END:VCALENDAR',
  ].join('\r\n');
}

/** Triggers a browser download of an .ics file. Client-side only. */
export function downloadIcal(steps: string[], urgent = false): void {
  const content = toIcal(steps, urgent);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'uw-compass-next-steps.ics';
  a.click();
  URL.revokeObjectURL(url);
}
