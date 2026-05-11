import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { isAdminAuthenticated } from '@/lib/auth'
import type { SubscriberUpdate } from '@/lib/types'

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const supabase = createAdminClient()

  const { data: existing, error: fetchError } = await supabase
    .from('subscribers')
    .select('is_interested')
    .eq('id', params.id)
    .single()

  if (fetchError || !existing) {
    return NextResponse.json({ error: 'Inscrit introuvable' }, { status: 404 })
  }

  const update: SubscriberUpdate = { is_interested: !existing.is_interested }

  const { data, error } = await supabase
    .from('subscribers')
    .update(update)
    .eq('id', params.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
