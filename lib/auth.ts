import { cookies } from 'next/headers'
import { createHmac, timingSafeEqual } from 'crypto'

const COOKIE_NAME = 'admin-token'
const TOKEN_MESSAGE = 'admin-authenticated-v1'

export function computeToken(password: string): string {
  return createHmac('sha256', password.trim())
    .update(TOKEN_MESSAGE)
    .digest('hex')
}

export function isAdminAuthenticated(): boolean {
  const cookieStore = cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return false

  const expected = computeToken(process.env.ADMIN_PASSWORD ?? '')
  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected))
  } catch {
    return false
  }
}
