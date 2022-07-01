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
import indexRawHash from '../frontend/index-hash-file.txt'
import { toughCookie, verifyCookieValue } from './utils'
import { appName } from '../frontend/utils'

const clientBundleEtag = '"' + clientBundleRawHash.split(' ')[0] + '"'
const indexEtag = '"' + indexRawHash.split(' ')[0] + '"'

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
  const ifNoneMatchValue = c.req.header('If-None-Match') || c.req.header('if-none-match')
  if(ifNoneMatchValue===indexEtag){
    c.status(304)
    return c.body('')
  }
  else{
    c.status(200)
    c.header('Cache-Control','no-cache')
    c.header('Etag',indexEtag)
    return c.html(index)
  }
})

app.post('/api/*',async (c,next) => { //async?
  await next();
  c.header('Cache-Control','no-store');
})

app.post('/api/website/is-cookie-policy-set',(c)=>{
  if(verifyCookieValue(c, appName + '-cookie-policy','ok')){
    c.status(200);
    return c.json({value:'yes'})
  }
  else{
    c.status(200);
    c.header('Set-Cookie',toughCookie(appName + '-cookie-policy','ok',365*24*60*60))
    return c.json({value:'no'})
  }
})

app.notFound((c) => {
  return c.text("Qui non c'è nulla.", 404)
})

app.onError((err, c) => {
  console.error(`${err}`)
  return c.text('Custom Error Message', 500)
})

app.fire()