import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { computeToken } from '@/lib/auth'

const COOKIE_NAME = 'admin-token'

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  if (!password) {
    return NextResponse.json({ error: 'Mot de passe requis' }, { status: 400 })
  }

  const adminPassword = process.env.ADMIN_PASSWORD?.trim() ?? ''
  if (password.trim() !== adminPassword) {
    return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 })
  }

  cookies().set(COOKIE_NAME, computeToken(password), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })

  return NextResponse.json({ message: 'Connecté' })
}

export async function DELETE() {
  cookies().delete(COOKIE_NAME)
  return NextResponse.json({ message: 'Déconnecté' })
}
