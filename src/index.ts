import { Hono } from 'hono';
import { Env } from './env';
import { sessionMiddleware } from './session';

const app = new Hono<Env>();

app.use(sessionMiddleware);

export default app;
