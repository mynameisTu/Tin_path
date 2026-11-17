import type { IncomingMessage, ServerResponse } from 'http';
import { handleApiRoute } from '../src/server/apiRouter.ts';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    // Extract actual request path (handles Vercel rewrite query, headers, or direct path)
    const host = req.headers.host || 'localhost';
    const parsed = new URL(req.url || '', `http://${host}`);
    const endpointParam = parsed.searchParams.get('endpoint') || parsed.searchParams.get('path');

    if (endpointParam) {
      req.url = endpointParam.startsWith('/') ? `/api${endpointParam}` : `/api/${endpointParam}`;
    } else {
      const routeMatches = req.headers['x-now-route-matches'] as string;
      if (routeMatches) {
        const match = routeMatches.match(/1=([^&]+)/);
        if (match) {
          const sub = decodeURIComponent(match[1]);
          req.url = sub.startsWith('/') ? `/api${sub}` : `/api/${sub}`;
        }
      } else {
        const forwarded = (req.headers['x-forwarded-uri'] as string)
          || (req.headers['x-invoke-path'] as string)
          || (req.headers['x-original-url'] as string)
          || (req.headers['x-matched-path'] as string);
        if (forwarded && forwarded.startsWith('/api/')) {
          req.url = forwarded;
        }
      }
    }

    const handled = await handleApiRoute(req, res);
    if (!handled) {
      res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        error: 'Endpoint not found',
        url: req.url,
        matchedPath: req.headers['x-matched-path'] || null,
      }));
    }
  } catch (error: any) {
    console.error('API Error in Vercel handler:', error);
    res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      error: 'Internal Server Error',
      message: error?.message || 'Unknown error',
    }));
  }
}
