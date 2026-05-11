import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { isAdminAuthenticated } from '@/lib/auth'
import type { WebinarUpdate } from '@/lib/types'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { is_active } = await req.json()
  const supabase = createAdminClient()

  if (is_active) {
    await supabase
      .from('webinars')
      .update({ is_active: false } as WebinarUpdate)
      .neq('id', params.id)
  }

  const { data, error } = await supabase
    .from('webinars')
    .update({ is_active } as WebinarUpdate)
    .eq('id', params.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
