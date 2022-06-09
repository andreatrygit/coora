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
import clientBundle from '../frontend/client-bundle.js.br'
import clientBundleRawHash from '../frontend/client-bundle-hash-file.txt'

const clientBundleEtag = '"' + clientBundleRawHash.split(' ')[0] + '"'

const app = new Hono()

app.get('/client-bundle.js', (c) => {
  const ifNoneMatchValue = c.req.header('If-None-Match') || c.req.header('if-none-match')
  if(ifNoneMatchValue===clientBundleEtag){
    c.status(304)
    return c.body('')
  }
  else{
    c.status(200)
    c.header('Content-Type', 'text/javascript')
    c.header('Content-Encoding','br')
    c.header('Cache-Control','no-cache')
    c.header('Etag',clientBundleEtag)
    return c.body(clientBundle)
  }
})

app.get('/*', (c) => {
    c.status(200)
    return c.html(index)
  })

app.fire()