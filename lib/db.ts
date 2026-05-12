import Database from 'better-sqlite3';
import path from 'node:path';
import { ResourceWithEmbedding, Resource, Category, Campus } from './types';

const DB_PATH = path.join(process.cwd(), 'data', 'compass.db');

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;
  _db = new Database(DB_PATH);
  _db.pragma('journal_mode = WAL');
  _db.exec(`
    CREATE TABLE IF NOT EXISTS resources (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      category    TEXT NOT NULL,
      campus      TEXT NOT NULL,
      description TEXT NOT NULL,
      url         TEXT NOT NULL,
      tags        TEXT NOT NULL,
      urgent      INTEGER NOT NULL,
      embedding   TEXT NOT NULL
    );
  `);
  return _db;
}

interface ResourceRow {
  id: string;
  name: string;
  category: string;
  campus: string;
  description: string;
  url: string;
  tags: string;
  urgent: number;
  embedding: string;
}

function rowToResource(row: ResourceRow): ResourceWithEmbedding {
  return {
    id: row.id,
    name: row.name,
    category: row.category as Category,
    campus: row.campus as Campus,
    description: row.description,
    url: row.url,
    tags: JSON.parse(row.tags),
    urgent: row.urgent === 1,
    embedding: JSON.parse(row.embedding),
  };
}

export function getAllResources(): ResourceWithEmbedding[] {
  const rows = getDb().prepare('SELECT * FROM resources').all() as ResourceRow[];
  return rows.map(rowToResource);
}

export function upsertResource(resource: Resource, embedding: number[]): void {
  const stmt = getDb().prepare(`
    INSERT INTO resources (id, name, category, campus, description, url, tags, urgent, embedding)
    VALUES (@id, @name, @category, @campus, @description, @url, @tags, @urgent, @embedding)
    ON CONFLICT(id) DO UPDATE SET
      name=excluded.name,
      category=excluded.category,
      campus=excluded.campus,
      description=excluded.description,
      url=excluded.url,
      tags=excluded.tags,
      urgent=excluded.urgent,
      embedding=excluded.embedding
  `);
  stmt.run({
    id: resource.id,
    name: resource.name,
    category: resource.category,
    campus: resource.campus,
    description: resource.description,
    url: resource.url,
    tags: JSON.stringify(resource.tags),
    urgent: resource.urgent ? 1 : 0,
    embedding: JSON.stringify(embedding),
  });
}

export function countResources(): number {
  const row = getDb().prepare('SELECT COUNT(*) as c FROM resources').get() as { c: number };
  return row.c;
}
