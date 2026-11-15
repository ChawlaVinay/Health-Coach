import {uid} from '../lib.mjs';
const J=(o,s=200)=>new Response(JSON.stringify(o),{status:s,headers:{'Content-Type':'application/json'}});
export default async req=>{
if(req.method!=='POST')return J({error:'POST only'},405);
const u=await uid(req);if(!u)return J({error:'Please sign in again.'},401);
const key=process.env.GEMINI_API_KEY;if(!key)return J({error:'Add GEMINI_API_KEY in Netlify, then redeploy.'},500);
let q='';try{q=String((await req.json()).q||'').trim().slice(0,120)}catch(e){}
if(!q)return J({error:'Type a food first.'},400);
const prompt='You are a nutrition database for Indian and world cuisines. Estimate the macros for this food exactly as the portion is typed; if no portion is given, assume one typical serving. Use a typical home-cooked or restaurant preparation. Food: '+JSON.stringify(q)+'. Reply with JSON only, in this shape: {"name": string, "portion": string, "protein": number, "carbs": number, "fat": number, "fibre": number}. All four numbers are grams for the whole portion, rounded to one decimal.';
const models=[process.env.GEMINI_MODEL,'gemini-3.1-flash-lite','gemini-2.5-flash-lite'].filter(Boolean);let last='';
for(const m of models){
const r=await fetch('https://generativelanguage.googleapis.com/v1beta/models/'+m+':generateContent',{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':key},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{responseMimeType:'application/json',temperature:0.2,maxOutputTokens:800}})});
if(r.ok){const j=await r.json();try{const t=j.candidates[0].content.parts.map(p=>p.text||'').join(''),o=JSON.parse(t.replace(/```json|```/g,'').trim()),n=x=>Math.max(0,Math.round((+x||0)*10)/10);return J({name:String(o.name||q).slice(0,80),portion:String(o.portion||'1 serving').slice(0,40),p:n(o.protein),c:n(o.carbs),f:n(o.fat),fb:n(o.fibre)})}catch(e){last='unreadable answer'}}
else{last='status '+r.status;if(r.status===429)return J({error:'Free limit reached. Try again in a minute.'},429);if(r.status===401||r.status===403)return J({error:'Gemini rejected the key (status '+r.status+'). Check GEMINI_API_KEY.'},502)}}
return J({error:'AI search failed ('+last+').'},502)}
