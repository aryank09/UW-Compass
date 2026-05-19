import * as dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { Resource, ResourceWithEmbedding } from '../lib/types';
import { embedBatch } from '../lib/ai';
import { resourceEmbeddingText } from '../lib/recommend';

// Load Next.js-style env files. .env.local takes precedence.
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const RESOURCES_PATH = path.join(process.cwd(), 'data', 'resources.json');
const EMBEDDED_PATH = path.join(process.cwd(), 'data', 'resources.embedded.json');
const BATCH_SIZE = 50; // OpenAI's embeddings endpoint accepts up to 2048 inputs per request — 50 is plenty.

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not set. Add it to .env.local before seeding.');
    process.exit(1);
  }

  const raw = fs.readFileSync(RESOURCES_PATH, 'utf-8');
  const resources: Resource[] = JSON.parse(raw);
  console.log(`Loaded ${resources.length} resources from ${RESOURCES_PATH}.`);

  const embedded: ResourceWithEmbedding[] = [];
  for (let i = 0; i < resources.length; i += BATCH_SIZE) {
    const batch = resources.slice(i, i + BATCH_SIZE);
    const texts = batch.map(resourceEmbeddingText);
    console.log(`Embedding batch ${i + 1}–${i + batch.length}…`);
    const embeddings = await embedBatch(texts);
    batch.forEach((resource, idx) => embedded.push({ ...resource, embedding: embeddings[idx] }));
  }

  fs.writeFileSync(EMBEDDED_PATH, JSON.stringify(embedded));
  const kb = (fs.statSync(EMBEDDED_PATH).size / 1024).toFixed(1);
  console.log(`Wrote ${embedded.length} resources (${kb} KB) to ${EMBEDDED_PATH}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
