'use client'

import { useState, useEffect } from 'react'
import AdminWebinarList from '@/components/AdminWebinarList'
import AdminSubscriberTable from '@/components/AdminSubscriberTable'

// ─── Login Form ───────────────────────────────────────────────────────────────

function LoginForm({ onLogin }: { onLogin: (pwd: string) => Promise<string | null> }) {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const err = await onLogin(password)
    if (err) {
      setError(err)
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-indigo-600 font-bold text-2xl">INVEST WEBINAR</span>
          <p className="text-slate-500 text-sm mt-2">Espace de gestion</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8"
        >
          <h1 className="text-xl font-bold text-slate-900 mb-6">Connexion</h1>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              placeholder="••••••••"
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-bold py-3 rounded-lg transition-colors text-sm"
          >
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </main>
  )
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authState, setAuthState] = useState<'checking' | 'authenticated' | 'unauthenticated'>(
    'checking'
  )
  const [activeTab, setActiveTab] = useState<'webinars' | 'subscribers'>('webinars')

  useEffect(() => {
    fetch('/api/admin/webinars')
      .then((res) => setAuthState(res.ok ? 'authenticated' : 'unauthenticated'))
      .catch(() => setAuthState('unauthenticated'))
  }, [])

  const handleLogin = async (password: string): Promise<string | null> => {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    const data = await res.json()
    if (res.ok) {
      setAuthState('authenticated')
      return null
    }
    return data.error || 'Erreur de connexion'
  }

  const handleLogout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' })
    setAuthState('unauthenticated')
  }

  if (authState === 'checking') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Vérification…
        </div>
      </div>
    )
  }

  if (authState === 'unauthenticated') {
    return <LoginForm onLogin={handleLogin} />
  }

  const TABS = [
    { id: 'webinars' as const, label: 'Présentations' },
    { id: 'subscribers' as const, label: 'Investisseurs' },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-indigo-600 font-bold text-lg">◆ INVEST WEBINAR</span>
          <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded">
            Admin
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="text-slate-500 hover:text-slate-900 text-sm transition-colors"
        >
          Déconnexion →
        </button>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Page content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'webinars' && <AdminWebinarList />}
        {activeTab === 'subscribers' && <AdminSubscriberTable />}
      </main>
    </div>
  )
}
