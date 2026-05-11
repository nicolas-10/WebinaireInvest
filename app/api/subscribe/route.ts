import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { sendEmail } from '@/lib/mailer'
import { confirmationEmail } from '@/lib/email-templates'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { first_name, last_name, email, phone, description, webinar_id } = body

    if (!first_name?.trim() || !last_name?.trim() || !email?.trim() || !webinar_id) {
      return NextResponse.json(
        { error: 'Prénom, nom, email et identifiant du webinaire sont obligatoires' },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Adresse email invalide' }, { status: 400 })
    }

    const db = createAdminClient()

    const { data: webinar, error: webinarError } = await db
      .from('webinars')
      .select('*')
      .eq('id', webinar_id)
      .single()

    if (webinarError || !webinar) {
      return NextResponse.json({ error: 'Webinaire introuvable' }, { status: 404 })
    }

    const normalizedEmail = email.trim().toLowerCase()

    const { data: subscriber, error: insertError } = await db
      .from('subscribers')
      .insert({
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        email: normalizedEmail,
        phone: phone?.trim() || null,
        description: description?.trim() || null,
        webinar_id,
      })
      .select()
      .single()

    if (insertError) {
      if (insertError.code === '23505') {
        return NextResponse.json(
          { error: 'Vous êtes déjà inscrit à ce webinaire' },
          { status: 409 }
        )
      }
      console.error('Insert error:', insertError)
      return NextResponse.json({ error: "Erreur lors de l'inscription" }, { status: 500 })
    }

    // Envoi email confirmation (non-bloquant en cas d'erreur)
    try {
      await sendEmail(
        normalizedEmail,
        'Votre inscription est confirmée !',
        confirmationEmail({
          firstName: first_name.trim(),
          webinarTitle: webinar.title,
          webinarDate: formatDate(webinar.date),
          zoomLink: webinar.zoom_link ?? null,
        })
      )
    } catch (emailError) {
      console.error('Email error (inscription enregistrée quand même):', emailError)
    }

    return NextResponse.json(
      { message: 'Inscription réussie', subscriber },
      { status: 201 }
    )
  } catch (err) {
    console.error('Subscribe route error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
