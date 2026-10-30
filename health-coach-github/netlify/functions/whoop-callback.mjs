import {sign,saveTok} from '../lib.mjs';
export default async req=>{const url=new URL(req.url),code=url.searchParams.get('code'),st=url.searchParams.get('state'),c=(req.headers.get('cookie')||'').match(/ws=([^;]+)/);
if(!code||!c)return new Response('Missing code or session. Go back to the app and tap Connect Whoop again.',{status:400});
const[u,s,sig]=c[1].split('.');if(s!==st||sig!==sign(u+'.'+s))return new Response('State mismatch. Go back and try again.',{status:400});
const E=process.env,r=await fetch('https://api.prod.whoop.com/oauth/oauth2/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'authorization_code',code,client_id:E.WHOOP_CLIENT_ID,client_secret:E.WHOOP_CLIENT_SECRET,redirect_uri:url.origin+'/.netlify/functions/whoop-callback'})});
if(!r.ok)return new Response('WHOOP token exchange failed: '+await r.text(),{status:502});
await saveTok(u,await r.json());return new Response(null,{status:302,headers:{Location:'/','Set-Cookie':'ws=; Path=/; Max-Age=0'}})}
