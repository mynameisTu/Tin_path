import type { IncomingMessage, ServerResponse } from 'http';
import handler from './index.ts';

export default async function catchAll(req: IncomingMessage, res: ServerResponse) {
  return handler(req, res);
}
