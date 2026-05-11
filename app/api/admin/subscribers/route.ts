import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { isAdminAuthenticated } from '@/lib/auth'

export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const webinarId = searchParams.get('webinarId')
  const interestedOnly = searchParams.get('interestedOnly') === 'true'

  if (!webinarId) {
    return NextResponse.json({ error: 'webinarId requis' }, { status: 400 })
  }

  const supabase = createAdminClient()

  let query = supabase
    .from('subscribers')
    .select('*')
    .eq('webinar_id', webinarId)
    .order('created_at', { ascending: false })

  if (interestedOnly) {
    query = query.eq('is_interested', true)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
