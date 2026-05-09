'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Webinar } from '@/lib/types'

interface WebinarWithCount extends Webinar {
  subscribers_count: number
}

interface WebinarFormData {
  title: string
  date: string
  zoom_link: string
}

const EMPTY_FORM: WebinarFormData = { title: '', date: '', zoom_link: '' }

function formatDateFR(dateStr: string): string {
  return new Date(dateStr).toLocaleString('fr-FR', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Paris',
  })
}

function toDatetimeLocal(isoDate: string): string {
  const d = new Date(isoDate)
  const parts = new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(d)
  const get = (type: string) => parts.find(p => p.type === type)?.value ?? '00'
  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}`
}

function parisDatetimeToISO(localStr: string): string {
  const naive = new Date(localStr + ':00Z')
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Paris',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  }).formatToParts(naive)
  const get = (type: string) => parts.find(p => p.type === type)?.value ?? '00'
  const parisMs = Date.UTC(+get('year'), +get('month') - 1, +get('day'), +get('hour'), +get('minute'), +get('second'))
  return new Date(naive.getTime() - (parisMs - naive.getTime())).toISOString()
}

export default function AdminWebinarList() {
  const [webinars, setWebinars] = useState<WebinarWithCount[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [editingWebinar, setEditingWebinar] = useState<WebinarWithCount | null>(null)
  const [form, setForm] = useState<WebinarFormData>(EMPTY_FORM)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [sendingZoomId, setSendingZoomId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const fetchWebinars = useCallback(async () => {
    const res = await fetch('/api/admin/webinars')
    if (res.ok) setWebinars(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { fetchWebinars() }, [fetchWebinars])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    setFormError('')

    const payload = {
      title: form.title,
      date: parisDatetimeToISO(form.date),
      zoom_link: form.zoom_link || null,
    }

    const url = editingWebinar
      ? `/api/admin/webinars/${editingWebinar.id}`
      : '/api/admin/webinars'
    const method = editingWebinar ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      closeModal()
      fetchWebinars()
    } else {
      const data = await res.json()
      setFormError(data.error || 'Erreur lors de l\'enregistrement')
    }
    setFormLoading(false)
  }

  const handleToggleActive = async (w: WebinarWithCount) => {
    setTogglingId(w.id)
    await fetch(`/api/admin/webinars/${w.id}/toggle-active`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !w.is_active }),
    })
    await fetchWebinars()
    setTogglingId(null)
  }

  const handleSendZoom = async (w: WebinarWithCount) => {
    if (!w.zoom_link) {
      alert('Configurez d\'abord le lien Zoom en modifiant ce webinaire.')
      return
    }
    if (!confirm(`Envoyer le lien Zoom à ${w.subscribers_count} inscrit(s) ?`)) return

    setSendingZoomId(w.id)
    const res = await fetch(`/api/admin/webinars/${w.id}/send-zoom`, { method: 'POST' })
    const data = await res.json()
    alert(data.message || 'Envoi terminé')
    setSendingZoomId(null)
  }

  const openCreate = () => {
    setForm(EMPTY_FORM)
    setFormError('')
    setShowCreate(true)
    setEditingWebinar(null)
  }

  const openEdit = (w: WebinarWithCount) => {
    setForm({ title: w.title, date: toDatetimeLocal(w.date), zoom_link: w.zoom_link ?? '' })
    setFormError('')
    setEditingWebinar(w)
    setShowCreate(false)
  }

  const closeModal = () => {
    setShowCreate(false)
    setEditingWebinar(null)
    setForm(EMPTY_FORM)
    setFormError('')
  }

  const showModal = showCreate || editingWebinar !== null

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Chargement…</div>
  }

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Webinaires</h2>
        <button
          onClick={openCreate}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          + Nouveau webinaire
        </button>
      </div>

      {/* List */}
      {webinars.length === 0 ? (
        <div className="text-center py-16 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
          Aucun webinaire. Créez le premier !
        </div>
      ) : (
        <div className="space-y-4">
          {webinars.map((w) => (
            <div
              key={w.id}
              className={`bg-white rounded-xl border-2 p-5 transition-all ${
                w.is_active ? 'border-indigo-500 shadow-md' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-bold text-gray-900">{w.title}</h3>
                    {w.is_active && (
                      <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                        Actif
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 capitalize mb-2">{formatDateFR(w.date)}</p>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-sm text-gray-600">
                      👥 <strong>{w.subscribers_count}</strong> inscrit(s)
                    </span>
                    {w.zoom_link ? (
                      <span className="text-xs text-green-600 font-medium">✓ Lien Zoom configuré</span>
                    ) : (
                      <span className="text-xs text-orange-500">⚠ Pas de lien Zoom</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Toggle actif */}
                  <button
                    onClick={() => handleToggleActive(w)}
                    disabled={togglingId === w.id}
                    title={w.is_active ? 'Désactiver' : 'Activer'}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 ${
                      w.is_active ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                        w.is_active ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>

                  {/* Modifier */}
                  <button
                    onClick={() => openEdit(w)}
                    title="Modifier"
                    className="p-1.5 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>

                  {/* Envoyer Zoom */}
                  <button
                    onClick={() => handleSendZoom(w)}
                    disabled={sendingZoomId === w.id}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                  >
                    {sendingZoomId === w.id ? 'Envoi…' : '📧 Envoyer Zoom'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal create / edit */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg">
                {editingWebinar ? 'Modifier le webinaire' : 'Nouveau webinaire'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  required
                  placeholder="Webinaire Investissement — Juin 2025"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date et heure <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={form.date}
                  onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lien Zoom{' '}
                  <span className="text-gray-400 text-xs font-normal">(optionnel)</span>
                </label>
                <input
                  type="url"
                  value={form.zoom_link}
                  onChange={(e) => setForm((p) => ({ ...p, zoom_link: e.target.value }))}
                  placeholder="https://zoom.us/j/123456789"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {formError && (
                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                  {formError}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 transition-colors"
                >
                  {formLoading ? 'Enregistrement…' : editingWebinar ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
