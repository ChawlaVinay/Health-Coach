import {randomBytes} from 'node:crypto';
import {uid,sign} from '../lib.mjs';
export default async req=>{const u=await uid(req);if(!u)return new Response(JSON.stringify({error:'auth'}),{status:401});
const st=randomBytes(6).toString('base64url').slice(0,8),o=new URL(req.url).origin,
q=new URLSearchParams({response_type:'code',client_id:process.env.WHOOP_CLIENT_ID,redirect_uri:o+'/.netlify/functions/whoop-callback',scope:'offline read:recovery read:sleep read:cycles read:workout read:profile read:body_measurement',state:st});
return new Response(JSON.stringify({url:'https://api.prod.whoop.com/oauth/oauth2/auth?'+q}),{headers:{'Content-Type':'application/json','Set-Cookie':`ws=${u}.${st}.${sign(u+'.'+st)}; Path=/; Max-Age=600; HttpOnly; Secure; SameSite=Lax`}})}
