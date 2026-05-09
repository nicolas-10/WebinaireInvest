import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { isAdminAuthenticated } from '@/lib/auth'

export async function GET() {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const supabase = createAdminClient()

  const { data: webinars, error } = await supabase
    .from('webinars')
    .select('*')
    .order('date', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Récupère le nombre d'inscrits pour chaque webinaire
  const webinarsWithCount = await Promise.all(
    webinars.map(async (w) => {
      const { count } = await supabase
        .from('subscribers')
        .select('*', { count: 'exact', head: true })
        .eq('webinar_id', w.id)
      return { ...w, subscribers_count: count ?? 0 }
    })
  )

  return NextResponse.json(webinarsWithCount)
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const { title, date, zoom_link } = await req.json()

    if (!title?.trim() || !date) {
      return NextResponse.json({ error: 'Titre et date sont obligatoires' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Désactive tous les webinaires existants avant d'en créer un nouveau actif
    await supabase.from('webinars').update({ is_active: false }).neq('id', '00000000-0000-0000-0000-000000000000')

    const { data, error } = await supabase
      .from('webinars')
      .insert({
        title: title.trim(),
        date,
        zoom_link: zoom_link?.trim() || null,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    console.error('Create webinar error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
