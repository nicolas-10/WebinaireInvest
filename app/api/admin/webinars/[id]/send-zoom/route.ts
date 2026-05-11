import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { isAdminAuthenticated } from '@/lib/auth'
import { sendEmail } from '@/lib/mailer'
import { zoomLinkEmail } from '@/lib/email-templates'

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Paris',
  })
}

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const supabase = createAdminClient()

  const { data: webinar, error: webinarError } = await supabase
    .from('webinars')
    .select('*')
    .eq('id', params.id)
    .single()

  if (webinarError || !webinar) {
    return NextResponse.json({ error: 'Webinaire introuvable' }, { status: 404 })
  }

  if (!webinar.zoom_link) {
    return NextResponse.json(
      { error: 'Aucun lien Zoom configuré pour ce webinaire' },
      { status: 400 }
    )
  }

  const { data: subscribers, error: subError } = await supabase
    .from('subscribers')
    .select('*')
    .eq('webinar_id', params.id)

  if (subError) {
    return NextResponse.json({ error: subError.message }, { status: 500 })
  }

  if (!subscribers || subscribers.length === 0) {
    return NextResponse.json({ message: 'Aucun inscrit pour ce webinaire', sent: 0 })
  }

  const webinarDate = formatDate(webinar.date)
  let totalSent = 0
  const errors: string[] = []

  for (const sub of subscribers) {
    try {
      await sendEmail(
        sub.email,
        '🔗 Voici votre lien pour rejoindre le webinaire',
        zoomLinkEmail({
          firstName: sub.first_name,
          webinarTitle: webinar.title,
          webinarDate,
          zoomLink: webinar.zoom_link!,
        })
      )
      totalSent++
    } catch (e) {
      errors.push(e instanceof Error ? e.message : 'Erreur inconnue')
    }
  }

  return NextResponse.json({
    message: `${totalSent} email(s) envoyé(s) sur ${subscribers.length}`,
    sent: totalSent,
    errors: errors.length > 0 ? errors : undefined,
  })
}
