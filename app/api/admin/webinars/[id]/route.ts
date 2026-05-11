import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { isAdminAuthenticated } from '@/lib/auth'
import type { WebinarUpdate } from '@/lib/types'

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { title, date, zoom_link } = await req.json()

  const update: WebinarUpdate = {}
  if (title !== undefined) update.title = title?.trim()
  if (date !== undefined) update.date = date
  if (zoom_link !== undefined) update.zoom_link = zoom_link?.trim() || null

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('webinars')
    .update(update)
    .eq('id', params.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
