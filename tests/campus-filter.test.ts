/**
 * Verifies the campus filter behavior used by /api/recommend.
 *
 * The route applies this filter before ranking:
 *   resources.filter(r => campus === 'all' || r.campus === campus || r.campus === 'all')
 *
 * These tests check the semantics directly against the real data, so a
 * mis-tagged resource (e.g. one labeled "seattle" that should be "all") shows
 * up here.
 */
import { describe, it, expect } from 'vitest';
import type { Campus, ResourceWithEmbedding } from '@/lib/types';
import embedded from '@/data/resources.embedded.json';

const RESOURCES = embedded as ResourceWithEmbedding[];

function filterByCampus(campus: Campus): ResourceWithEmbedding[] {
  return RESOURCES.filter(
    (r) => campus === 'all' || r.campus === campus || r.campus === 'all'
  );
}

describe('campus filter', () => {
  it('"all" returns every resource', () => {
    expect(filterByCampus('all').length).toBe(RESOURCES.length);
  });

  it('"seattle" returns Seattle + pan-UW resources, excludes Bothell/Tacoma-only', () => {
    const result = filterByCampus('seattle');
    expect(result.length).toBeGreaterThan(0);
    for (const r of result) {
      expect(['seattle', 'all']).toContain(r.campus);
    }
  });

  it('"bothell" returns only pan-UW + Bothell resources', () => {
    const result = filterByCampus('bothell');
    for (const r of result) {
      expect(['bothell', 'all']).toContain(r.campus);
    }
  });

  it('"tacoma" returns only pan-UW + Tacoma resources', () => {
    const result = filterByCampus('tacoma');
    for (const r of result) {
      expect(['tacoma', 'all']).toContain(r.campus);
    }
  });

  it('every campus filter includes the pan-UW resources', () => {
    const allCampusResources = RESOURCES.filter((r) => r.campus === 'all');
    for (const campus of ['seattle', 'bothell', 'tacoma'] as const) {
      const filtered = filterByCampus(campus);
      for (const r of allCampusResources) {
        expect(filtered.find((x) => x.id === r.id), `${r.id} missing from ${campus} filter`).toBeTruthy();
      }
    }
  });

  it('crisis resources (SafeCampus, Husky HelpLine) are reachable from every campus', () => {
    const crisisIds = ['safecampus', 'huskyhelpline'];
    for (const campus of ['all', 'seattle', 'bothell', 'tacoma'] as const) {
      const ids = new Set(filterByCampus(campus).map((r) => r.id));
      for (const id of crisisIds) {
        expect(ids.has(id), `${id} missing from ${campus} filter — crisis resources must be pan-UW`).toBe(true);
      }
    }
  });
});
