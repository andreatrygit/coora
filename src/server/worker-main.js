/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npx wrangler dev src/index.js` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npx wrangler publish src/index.js --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Hono } from 'hono'
import index from '../frontend/index.html'
import clientBundle from '../frontend/client-bundle.txt'

const app = new Hono()

app.get('/', (c) => {
    return c.html(index)
  })

app.get('/client-bundle.js', (c) => {
  c.header('Content-Type', 'text/javascript')
  c.status(200)
  return c.body(clientBundle)
  })

app.fire()