"use strict";(()=>{var e={};e.id=956,e.ids=[956],e.modules={2934:e=>{e.exports=require("next/dist/client/components/action-async-storage.external.js")},4580:e=>{e.exports=require("next/dist/client/components/request-async-storage.external.js")},5869:e=>{e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},1282:e=>{e.exports=require("child_process")},4770:e=>{e.exports=require("crypto")},665:e=>{e.exports=require("dns")},7702:e=>{e.exports=require("events")},2048:e=>{e.exports=require("fs")},2615:e=>{e.exports=require("http")},8791:e=>{e.exports=require("https")},8216:e=>{e.exports=require("net")},9801:e=>{e.exports=require("os")},5315:e=>{e.exports=require("path")},6162:e=>{e.exports=require("stream")},2452:e=>{e.exports=require("tls")},7360:e=>{e.exports=require("url")},1764:e=>{e.exports=require("util")},1568:e=>{e.exports=require("zlib")},8250:(e,r,i)=>{i.r(r),i.d(r,{originalPathname:()=>b,patchFetch:()=>h,requestAsyncStorage:()=>f,routeModule:()=>x,serverHooks:()=>g,staticGenerationAsyncStorage:()=>m});var t={};i.r(t),i.d(t,{POST:()=>u});var o=i(9303),n=i(8716),s=i(670),a=i(7070),p=i(5662),l=i(2031),d=i(1528),c=i(7277);async function u(e,{params:r}){if(!(0,l.C)())return a.NextResponse.json({error:"Non autoris\xe9"},{status:401});let i=(0,p.i)(),{data:t,error:o}=await i.from("webinars").select("*").eq("id",r.id).single();if(o||!t)return a.NextResponse.json({error:"Webinaire introuvable"},{status:404});if(!t.zoom_link)return a.NextResponse.json({error:"Aucun lien Zoom configur\xe9 pour ce webinaire"},{status:400});let{data:n,error:s}=await i.from("subscribers").select("*").eq("webinar_id",r.id);if(s)return a.NextResponse.json({error:s.message},{status:500});if(!n||0===n.length)return a.NextResponse.json({message:"Aucun inscrit pour ce webinaire",sent:0});let u=new Date(t.date).toLocaleString("fr-FR",{weekday:"long",year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit",timeZone:"Europe/Paris"}),x=0,f=[];for(let e of n)try{await (0,d.C)(e.email,"\uD83D\uDD17 Voici votre lien pour rejoindre le webinaire",(0,c.f)({firstName:e.first_name,webinarTitle:t.title,webinarDate:u,zoomLink:t.zoom_link})),x++}catch(e){f.push(e instanceof Error?e.message:"Erreur inconnue")}return a.NextResponse.json({message:`${x} email(s) envoy\xe9(s) sur ${n.length}`,sent:x,errors:f.length>0?f:void 0})}let x=new o.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/admin/webinars/[id]/send-zoom/route",pathname:"/api/admin/webinars/[id]/send-zoom",filename:"route",bundlePath:"app/api/admin/webinars/[id]/send-zoom/route"},resolvedPagePath:"C:\\Users\\alawe\\WebinaireInvest\\app\\api\\admin\\webinars\\[id]\\send-zoom\\route.ts",nextConfigOutput:"",userland:t}),{requestAsyncStorage:f,staticGenerationAsyncStorage:m,serverHooks:g}=x,b="/api/admin/webinars/[id]/send-zoom/route";function h(){return(0,s.patchFetch)({serverHooks:g,staticGenerationAsyncStorage:m})}},7277:(e,r,i)=>{function t(e,r){return`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${e}</title>
</head>
<body style="margin:0;padding:20px;background-color:#f4f7f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;">
    <!-- Header -->
    <div style="background-color:#0f1e33;border-radius:8px 8px 0 0;padding:32px 40px;text-align:center;">
      <p style="color:#f5c842;margin:0 0 6px 0;font-size:12px;text-transform:uppercase;letter-spacing:2px;font-weight:700;">
        Webinaire Investissement
      </p>
      <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:700;line-height:1.3;">
        ${e}
      </h1>
    </div>
    <!-- Body -->
    <div style="background-color:#ffffff;padding:40px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
      ${r}
    </div>
    <!-- Footer -->
    <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-top:0;border-radius:0 0 8px 8px;padding:20px 40px;text-align:center;">
      <p style="color:#a0aec0;font-size:12px;margin:0;line-height:1.6;">
        Vous recevez cet email car vous vous \xeates inscrit \xe0 un webinaire.<br>
        \xa9 ${new Date().getFullYear()} Webinaire Investissement
      </p>
    </div>
  </div>
</body>
</html>`}function o({firstName:e,webinarTitle:r,webinarDate:i,zoomLink:o}){let n=o?`<div style="text-align:center;margin:28px 0;">
        <a href="${o}"
           style="display:inline-block;background-color:#f5c842;color:#0f1e33;padding:14px 32px;
                  border-radius:6px;text-decoration:none;font-weight:700;font-size:16px;">
          🎥 Rejoindre le webinaire
        </a>
        <p style="color:#718096;font-size:13px;margin:10px 0 0 0;">
          Ou copiez ce lien : <a href="${o}" style="color:#1e3a5f;">${o}</a>
        </p>
      </div>`:`<div style="background-color:#fff8e1;border-left:4px solid #f5c842;padding:16px 20px;border-radius:4px;margin:24px 0;">
        <p style="color:#7b6002;margin:0;font-size:14px;">
          📧 <strong>Le lien Zoom vous sera envoy\xe9 prochainement</strong> par email d\xe8s qu'il sera disponible.
        </p>
      </div>`;return t("Votre inscription est confirm\xe9e !",`
    <h2 style="color:#0f1e33;margin:0 0 16px 0;font-size:20px;">
      Bonjour ${e} ! 👋
    </h2>
    <p style="color:#4a5568;line-height:1.7;margin:0 0 20px 0;">
      Votre inscription est bien confirm\xe9e. Nous sommes ravis de vous compter parmi nous !
    </p>
    <!-- D\xe9tails du webinaire -->
    <div style="background-color:#eef2ff;border-left:4px solid #1e3a5f;padding:20px 24px;border-radius:4px;margin:0 0 24px 0;">
      <p style="color:#718096;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0 0 6px 0;font-weight:600;">
        Webinaire inscrit
      </p>
      <h3 style="color:#0f1e33;margin:0 0 8px 0;font-size:18px;">${r}</h3>
      <p style="color:#4a5568;margin:0;font-size:15px;">📅 ${i}</p>
    </div>
    ${n}
    <p style="color:#4a5568;line-height:1.7;margin:24px 0 0 0;font-size:14px;">
      \xc0 tr\xe8s bient\xf4t,<br>
      <strong style="color:#0f1e33;">L'\xe9quipe Webinaire Investissement</strong>
    </p>`)}function n({firstName:e,webinarTitle:r,webinarDate:i,zoomLink:o}){return t("\uD83D\uDD17 Votre lien Zoom pour le webinaire",`
    <h2 style="color:#0f1e33;margin:0 0 16px 0;font-size:20px;">
      Bonjour ${e} ! 🎉
    </h2>
    <p style="color:#4a5568;line-height:1.7;margin:0 0 20px 0;">
      Voici votre lien pour rejoindre le webinaire. Gardez-le pr\xe9cieusement !
    </p>
    <!-- D\xe9tails du webinaire -->
    <div style="background-color:#eef2ff;border-left:4px solid #1e3a5f;padding:20px 24px;border-radius:4px;margin:0 0 28px 0;">
      <h3 style="color:#0f1e33;margin:0 0 8px 0;font-size:18px;">${r}</h3>
      <p style="color:#4a5568;margin:0;font-size:15px;">📅 ${i}</p>
    </div>
    <!-- Bouton Zoom -->
    <div style="text-align:center;margin:0 0 28px 0;">
      <a href="${o}"
         style="display:inline-block;background-color:#f5c842;color:#0f1e33;padding:16px 40px;
                border-radius:6px;text-decoration:none;font-weight:700;font-size:17px;">
        🎥 Rejoindre le webinaire
      </a>
    </div>
    <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:16px 20px;margin:0 0 24px 0;">
      <p style="color:#718096;font-size:13px;margin:0 0 6px 0;font-weight:600;">Lien direct :</p>
      <a href="${o}" style="color:#1e3a5f;font-size:13px;word-break:break-all;">${o}</a>
    </div>
    <p style="color:#4a5568;line-height:1.7;margin:0;font-size:14px;">
      \xc0 tr\xe8s bient\xf4t,<br>
      <strong style="color:#0f1e33;">L'\xe9quipe Webinaire Investissement</strong>
    </p>`)}i.d(r,{f:()=>n,v:()=>o})},1528:(e,r,i)=>{i.d(r,{C:()=>o});let t=i(5245).createTransport({service:"gmail",auth:{user:process.env.GMAIL_USER,pass:process.env.GMAIL_APP_PASSWORD}});async function o(e,r,i){await t.sendMail({from:`"Webinaire Investissement" <${process.env.GMAIL_USER}>`,to:e,subject:r,html:i})}},5662:(e,r,i)=>{i.d(r,{O:()=>n,i:()=>s});var t=i(7933);let o="https://avjpzdgeommpagppvewz.supabase.co",n=(0,t.eI)(o,"sb_publishable_ja6b9phG-xlKmcWprk4DXQ_u8KK0IC6");function s(){let e=process.env.SUPABASE_SERVICE_ROLE_KEY;return(0,t.eI)(o,e,{auth:{autoRefreshToken:!1,persistSession:!1}})}}};var r=require("../../../../../../webpack-runtime.js");r.C(e);var i=e=>r(r.s=e),t=r.X(0,[948,188,972,245,167],()=>i(8250));module.exports=t})();