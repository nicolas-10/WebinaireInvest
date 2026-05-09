"use strict";(()=>{var e={};e.id=925,e.ids=[925],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},1282:e=>{e.exports=require("child_process")},4770:e=>{e.exports=require("crypto")},665:e=>{e.exports=require("dns")},7702:e=>{e.exports=require("events")},2048:e=>{e.exports=require("fs")},2615:e=>{e.exports=require("http")},8791:e=>{e.exports=require("https")},8216:e=>{e.exports=require("net")},9801:e=>{e.exports=require("os")},5315:e=>{e.exports=require("path")},6162:e=>{e.exports=require("stream")},2452:e=>{e.exports=require("tls")},7360:e=>{e.exports=require("url")},1764:e=>{e.exports=require("util")},1568:e=>{e.exports=require("zlib")},5639:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>g,patchFetch:()=>b,requestAsyncStorage:()=>x,routeModule:()=>u,serverHooks:()=>m,staticGenerationAsyncStorage:()=>f});var i={};t.r(i),t.d(i,{POST:()=>c});var o=t(9303),s=t(8716),n=t(670),a=t(7070),p=t(5662),l=t(1528),d=t(7277);async function c(e){try{var r;let{first_name:t,last_name:i,email:o,phone:s,description:n,webinar_id:c}=await e.json();if(!t?.trim()||!i?.trim()||!o?.trim()||!c)return a.NextResponse.json({error:"Pr\xe9nom, nom, email et identifiant du webinaire sont obligatoires"},{status:400});if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(o.trim()))return a.NextResponse.json({error:"Adresse email invalide"},{status:400});let u=(0,p.i)(),{data:x,error:f}=await u.from("webinars").select("*").eq("id",c).single();if(f||!x)return a.NextResponse.json({error:"Webinaire introuvable"},{status:404});let m=o.trim().toLowerCase(),{data:g,error:b}=await u.from("subscribers").insert({first_name:t.trim(),last_name:i.trim(),email:m,phone:s?.trim()||null,description:n?.trim()||null,webinar_id:c}).select().single();if(b){if("23505"===b.code)return a.NextResponse.json({error:"Vous \xeates d\xe9j\xe0 inscrit \xe0 ce webinaire"},{status:409});return console.error("Insert error:",b),a.NextResponse.json({error:"Erreur lors de l'inscription"},{status:500})}try{await (0,l.C)(m,"Votre inscription est confirm\xe9e !",(0,d.v)({firstName:t.trim(),webinarTitle:x.title,webinarDate:(r=x.date,new Date(r).toLocaleString("fr-FR",{weekday:"long",year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit",timeZone:"Europe/Paris"})),zoomLink:x.zoom_link??null}))}catch(e){console.error("Email error (inscription enregistr\xe9e quand m\xeame):",e)}return a.NextResponse.json({message:"Inscription r\xe9ussie",subscriber:g},{status:201})}catch(e){return console.error("Subscribe route error:",e),a.NextResponse.json({error:"Erreur serveur"},{status:500})}}let u=new o.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/subscribe/route",pathname:"/api/subscribe",filename:"route",bundlePath:"app/api/subscribe/route"},resolvedPagePath:"C:\\Users\\alawe\\WebinaireInvest\\app\\api\\subscribe\\route.ts",nextConfigOutput:"",userland:i}),{requestAsyncStorage:x,staticGenerationAsyncStorage:f,serverHooks:m}=u,g="/api/subscribe/route";function b(){return(0,n.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:f})}},7277:(e,r,t)=>{function i(e,r){return`<!DOCTYPE html>
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
</html>`}function o({firstName:e,webinarTitle:r,webinarDate:t,zoomLink:o}){let s=o?`<div style="text-align:center;margin:28px 0;">
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
      </div>`;return i("Votre inscription est confirm\xe9e !",`
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
      <p style="color:#4a5568;margin:0;font-size:15px;">📅 ${t}</p>
    </div>
    ${s}
    <p style="color:#4a5568;line-height:1.7;margin:24px 0 0 0;font-size:14px;">
      \xc0 tr\xe8s bient\xf4t,<br>
      <strong style="color:#0f1e33;">L'\xe9quipe Webinaire Investissement</strong>
    </p>`)}function s({firstName:e,webinarTitle:r,webinarDate:t,zoomLink:o}){return i("\uD83D\uDD17 Votre lien Zoom pour le webinaire",`
    <h2 style="color:#0f1e33;margin:0 0 16px 0;font-size:20px;">
      Bonjour ${e} ! 🎉
    </h2>
    <p style="color:#4a5568;line-height:1.7;margin:0 0 20px 0;">
      Voici votre lien pour rejoindre le webinaire. Gardez-le pr\xe9cieusement !
    </p>
    <!-- D\xe9tails du webinaire -->
    <div style="background-color:#eef2ff;border-left:4px solid #1e3a5f;padding:20px 24px;border-radius:4px;margin:0 0 28px 0;">
      <h3 style="color:#0f1e33;margin:0 0 8px 0;font-size:18px;">${r}</h3>
      <p style="color:#4a5568;margin:0;font-size:15px;">📅 ${t}</p>
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
    </p>`)}t.d(r,{f:()=>s,v:()=>o})},1528:(e,r,t)=>{t.d(r,{C:()=>o});let i=t(5245).createTransport({service:"gmail",auth:{user:process.env.GMAIL_USER,pass:process.env.GMAIL_APP_PASSWORD}});async function o(e,r,t){await i.sendMail({from:`"Webinaire Investissement" <${process.env.GMAIL_USER}>`,to:e,subject:r,html:t})}},5662:(e,r,t)=>{t.d(r,{O:()=>s,i:()=>n});var i=t(7933);let o="https://avjpzdgeommpagppvewz.supabase.co",s=(0,i.eI)(o,"sb_publishable_ja6b9phG-xlKmcWprk4DXQ_u8KK0IC6");function n(){let e=process.env.SUPABASE_SERVICE_ROLE_KEY;return(0,i.eI)(o,e,{auth:{autoRefreshToken:!1,persistSession:!1}})}}};var r=require("../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),i=r.X(0,[948,188,972,245],()=>t(5639));module.exports=i})();