import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { isAdminAuthenticated } from '@/lib/auth'

export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const webinarId = searchParams.get('webinarId')

  if (!webinarId) {
    return NextResponse.json({ error: 'webinarId requis' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data: subscribers, error } = await supabase
    .from('subscribers')
    .select('*')
    .eq('webinar_id', webinarId)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const escape = (val: string) => `"${val.replace(/"/g, '""')}"`

  const headers = ['Prénom', 'Nom', 'Email', 'Téléphone', 'Description', 'Intéressé', 'Inscription']
  const rows = (subscribers ?? []).map((s) => [
    s.first_name,
    s.last_name,
    s.email,
    s.phone ?? '',
    s.description ?? '',
    s.is_interested ? 'Oui' : 'Non',
    new Date(s.created_at).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
  ])

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => escape(String(cell))).join(','))
    .join('\n')

  return new Response('﻿' + csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="inscrits-${webinarId}.csv"`,
    },
  })
}
