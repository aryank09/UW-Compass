import * as dotenv from 'dotenv';
import fs from 'node:fs';

// Load Next.js-style env files. .env.local takes precedence.
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

import path from 'node:path';
import { Resource } from '../lib/types';
import { embedBatch } from '../lib/ai';
import { upsertResource, countResources } from '../lib/db';
import { resourceEmbeddingText } from '../lib/recommend';

const RESOURCES_PATH = path.join(process.cwd(), 'data', 'resources.json');
const BATCH_SIZE = 50; // OpenAI embeddings endpoint accepts up to 2048 inputs per request — 50 is plenty.

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not set. Add it to .env.local or export it before seeding.');
    process.exit(1);
  }

  const raw = fs.readFileSync(RESOURCES_PATH, 'utf-8');
  const resources: Resource[] = JSON.parse(raw);
  console.log(`Loaded ${resources.length} resources from ${RESOURCES_PATH}.`);

  for (let i = 0; i < resources.length; i += BATCH_SIZE) {
    const batch = resources.slice(i, i + BATCH_SIZE);
    const texts = batch.map(resourceEmbeddingText);
    console.log(`Embedding batch ${i + 1}–${i + batch.length}…`);
    const embeddings = await embedBatch(texts);
    batch.forEach((resource, idx) => upsertResource(resource, embeddings[idx]));
  }

  console.log(`Done. DB now contains ${countResources()} resources at data/compass.db.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
