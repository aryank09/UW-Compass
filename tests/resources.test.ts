import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import { CATEGORIES, CAMPUSES } from '@/lib/types';

const ResourceSchema = z.object({
  id: z.string().min(1).regex(/^[a-z0-9-]+$/, 'id must be lowercase kebab-case'),
  name: z.string().min(1),
  category: z.enum(CATEGORIES),
  campus: z.enum(CAMPUSES),
  description: z.string().min(10),
  url: z.string().url(),
  tags: z.array(z.string().regex(/^[a-z0-9_]+$/, 'tags must be snake_case')).min(1),
  urgent: z.boolean(),
});

const ResourcesFileSchema = z.array(ResourceSchema);

const RESOURCES_PATH = path.join(process.cwd(), 'data', 'resources.json');
const resources = JSON.parse(fs.readFileSync(RESOURCES_PATH, 'utf-8'));

describe('data/resources.json', () => {
  it('parses against the schema', () => {
    const result = ResourcesFileSchema.safeParse(resources);
    if (!result.success) {
      console.error(result.error.issues);
    }
    expect(result.success).toBe(true);
  });

  it('has unique ids', () => {
    const ids = resources.map((r: { id: string }) => r.id);
    const dupes = ids.filter((id: string, i: number) => ids.indexOf(id) !== i);
    expect(dupes).toEqual([]);
  });

  it('covers all 7 proposal categories', () => {
    const present = new Set(resources.map((r: { category: string }) => r.category));
    for (const c of CATEGORIES) {
      expect(present.has(c), `missing category: ${c}`).toBe(true);
    }
  });

  it('meets the 30+ entry MVP target from the proposal', () => {
    expect(resources.length).toBeGreaterThanOrEqual(30);
  });

  it('uses official UW or whitelisted UW-partner domains for every URL', () => {
    const uwDomains = ['washington.edu', 'uw.edu'];
    // UW-partner SaaS tenants we knowingly link to.
    const partnerHosts = new Set(['uw.joinhandshake.com']);
    for (const r of resources) {
      const host = new URL(r.url).hostname;
      const onUW = uwDomains.some((d) => host === d || host.endsWith(`.${d}`));
      const onPartner = partnerHosts.has(host);
      expect(onUW || onPartner, `${r.id} has non-UW URL: ${r.url}`).toBe(true);
    }
  });
});
