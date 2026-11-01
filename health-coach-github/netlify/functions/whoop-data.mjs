import {uid,getTok} from '../lib.mjs';
const B='https://api.prod.whoop.com/developer/v2/',P=['recovery','activity/sleep','cycle'];
const J=(o,s=200)=>new Response(JSON.stringify(o),{status:s,headers:{'Content-Type':'application/json'}});
const hrs=sc=>{const x=sc&&sc.stage_summary;return x?Math.round((x.total_light_sleep_time_milli+x.total_slow_wave_sleep_time_milli+x.total_rem_sleep_time_milli)/36e5*10)/10:null};
const r1=v=>v==null?null:Math.round(v*10)/10;
export default async req=>{const u=await uid(req);if(!u)return J({error:'auth'},401);let t=await getTok(u);if(!t)return J({connected:false});
const go=tk=>Promise.all(P.map(p=>fetch(B+p+'?limit=7',{headers:{Authorization:'Bearer '+tk}})));
let rs=await go(t);if(rs.some(r=>r.status==401)){t=await getTok(u,true);if(!t)return J({connected:false});rs=await go(t)}
if(rs.some(r=>!r.ok))return J({connected:true,error:'WHOOP returned status '+rs.map(r=>r.status).join(', ')});
const[rc,sl0,cy]=(await Promise.all(rs.map(r=>r.json()))).map(j=>j.records||[]),sl=sl0.filter(x=>!x.nap),R=(rc[0]&&rc[0].score)||{},S=sl[0]&&sl[0].score,C=(cy[0]&&cy[0].score)||{};
return J({connected:true,latest:{rec:R.recovery_score??null,hrv:R.hrv_rmssd_milli!=null?Math.round(R.hrv_rmssd_milli):null,rhr:R.resting_heart_rate??null,sleepH:hrs(S),sleepP:S?S.sleep_performance_percentage:null,strain:r1(C.strain)},
rec:rc.map(x=>({d:(x.created_at||'').slice(0,10),v:x.score?x.score.recovery_score:null})),hrv:rc.map(x=>x.score&&x.score.hrv_rmssd_milli!=null?Math.round(x.score.hrv_rmssd_milli):null),rhr:rc.map(x=>x.score?x.score.resting_heart_rate:null),sleep:sl.map(x=>({d:(x.end||'').slice(0,10),v:hrs(x.score)})),cyc:cy.map(x=>({d:(x.start||'').slice(0,10),s:x.start||null,st:(x.step_count!=null?x.step_count:(x.score&&x.score.step_count!=null?x.score.step_count:null)),v:x.score?r1(x.score.strain):null}))})}
