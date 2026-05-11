interface ConfirmationEmailParams {
  firstName: string
  webinarTitle: string
  webinarDate: string
  zoomLink: string | null
}

export function confirmationEmail({
  firstName,
  webinarTitle,
  webinarDate,
  zoomLink,
}: ConfirmationEmailParams): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
    <div style="background:#4f46e5;padding:32px 40px;">
      <p style="margin:0;color:#ffffff;font-size:20px;font-weight:bold;">◆ INVEST WEBINAR</p>
    </div>
    <div style="padding:40px;">
      <h1 style="margin:0 0 8px;font-size:24px;color:#0f172a;">Votre inscription est confirmée !</h1>
      <p style="margin:0 0 32px;color:#64748b;">Bonjour ${firstName},</p>
      <p style="color:#334155;line-height:1.6;">
        Nous avons bien reçu votre inscription au webinaire. Voici un récapitulatif :
      </p>
      <div style="background:#f1f5f9;border-radius:8px;padding:24px;margin:24px 0;">
        <p style="margin:0 0 8px;font-weight:bold;color:#4f46e5;font-size:16px;">${webinarTitle}</p>
        <p style="margin:0;color:#475569;">📅 ${webinarDate}</p>
        ${zoomLink ? `<p style="margin:12px 0 0;color:#475569;">🔗 <a href="${zoomLink}" style="color:#4f46e5;">${zoomLink}</a></p>` : ''}
      </div>
      ${!zoomLink ? `<p style="color:#475569;line-height:1.6;">Le lien Zoom vous sera envoyé par email avant le début du webinaire.</p>` : ''}
      <p style="color:#475569;line-height:1.6;margin-top:32px;">
        À bientôt !<br>
        <strong>L'équipe Webinaire Investissement</strong>
      </p>
    </div>
    <div style="padding:24px 40px;border-top:1px solid #e2e8f0;text-align:center;">
      <p style="margin:0;color:#94a3b8;font-size:12px;">© ${new Date().getFullYear()} Webinaire Investissement</p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

interface ZoomLinkEmailParams {
  firstName: string
  webinarTitle: string
  webinarDate: string
  zoomLink: string
}

export function zoomLinkEmail({
  firstName,
  webinarTitle,
  webinarDate,
  zoomLink,
}: ZoomLinkEmailParams): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
    <div style="background:#4f46e5;padding:32px 40px;">
      <p style="margin:0;color:#ffffff;font-size:20px;font-weight:bold;">◆ INVEST WEBINAR</p>
    </div>
    <div style="padding:40px;">
      <h1 style="margin:0 0 8px;font-size:24px;color:#0f172a;">Votre lien pour rejoindre le webinaire</h1>
      <p style="margin:0 0 32px;color:#64748b;">Bonjour ${firstName},</p>
      <p style="color:#334155;line-height:1.6;">
        Le webinaire approche ! Voici votre lien de connexion :
      </p>
      <div style="background:#f1f5f9;border-radius:8px;padding:24px;margin:24px 0;">
        <p style="margin:0 0 8px;font-weight:bold;color:#4f46e5;font-size:16px;">${webinarTitle}</p>
        <p style="margin:0 0 12px;color:#475569;">📅 ${webinarDate}</p>
        <a href="${zoomLink}"
           style="display:inline-block;background:#4f46e5;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:bold;font-size:15px;">
          Rejoindre le webinaire →
        </a>
      </div>
      <p style="color:#94a3b8;font-size:13px;">
        Ou copiez ce lien dans votre navigateur :<br>
        <span style="color:#4f46e5;">${zoomLink}</span>
      </p>
      <p style="color:#475569;line-height:1.6;margin-top:32px;">
        À tout de suite !<br>
        <strong>L'équipe Webinaire Investissement</strong>
      </p>
    </div>
    <div style="padding:24px 40px;border-top:1px solid #e2e8f0;text-align:center;">
      <p style="margin:0;color:#94a3b8;font-size:12px;">© ${new Date().getFullYear()} Webinaire Investissement</p>
    </div>
  </div>
</body>
</html>
  `.trim()
}
