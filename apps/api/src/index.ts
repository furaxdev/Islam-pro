import 'dotenv/config';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { MongoClient } from 'mongodb';
import { randomUUID } from 'node:crypto';
import type {
  HealthResponse,
  StatusCheck,
  StatusCheckCreate,
} from '@islam-pro/shared';

const app = new Hono();
app.use('/*', cors());

const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME ?? 'islampro';
// Mongo is optional: the API still serves /health without a database.
const client = MONGO_URL ? new MongoClient(MONGO_URL) : null;

app.get('/api/health', (c) => {
  const body: HealthResponse = {
    status: 'ok',
    service: 'islam-pro-api',
    timestamp: new Date().toISOString(),
  };
  return c.json(body);
});

app.post('/api/status', async (c) => {
  if (!client) return c.json({ error: 'Database not configured' }, 503);
  const input = await c.req.json<StatusCheckCreate>();
  const check: StatusCheck = {
    id: randomUUID(),
    clientName: input.clientName,
    timestamp: new Date().toISOString(),
  };
  await client.db(DB_NAME).collection('status_checks').insertOne(check);
  return c.json(check);
});

app.get('/api/status', async (c) => {
  if (!client) return c.json({ error: 'Database not configured' }, 503);
  const checks = await client
    .db(DB_NAME)
    .collection<StatusCheck>('status_checks')
    .find()
    .limit(1000)
    .toArray();
  return c.json(checks);
});

const port = Number(process.env.PORT ?? 8000);
serve({ fetch: app.fetch, port });
console.log(`Islam Pro API running on http://localhost:${port}`);
