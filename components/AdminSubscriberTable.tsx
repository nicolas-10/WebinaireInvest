'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Webinar, Subscriber } from '@/lib/types'

interface WebinarWithCount extends Webinar {
  subscribers_count: number
}

function formatDateFR(dateStr: string): string {
  return new Date(dateStr).toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Paris',
  })
}

export default function AdminSubscriberTable() {
  const [webinars, setWebinars] = useState<WebinarWithCount[]>([])
  const [selectedWebinarId, setSelectedWebinarId] = useState<string>('')
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(false)
  const [interestedOnly, setInterestedOnly] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  // Load webinars on mount
  useEffect(() => {
    fetch('/api/admin/webinars')
      .then((r) => r.json())
      .then((data: WebinarWithCount[]) => {
        setWebinars(data)
        const active = data.find((w) => w.is_active)
        if (active) setSelectedWebinarId(active.id)
      })
  }, [])

  const fetchSubscribers = useCallback(
    async (webinarId: string, interested: boolean) => {
      if (!webinarId) return
      setLoading(true)
      const params = new URLSearchParams({
        webinarId,
        interestedOnly: interested.toString(),
      })
      const res = await fetch(`/api/admin/subscribers?${params}`)
      if (res.ok) setSubscribers(await res.json())
      setLoading(false)
    },
    []
  )

  useEffect(() => {
    fetchSubscribers(selectedWebinarId, interestedOnly)
  }, [selectedWebinarId, interestedOnly, fetchSubscribers])

  const handleToggleInterest = async (id: string) => {
    setTogglingId(id)
    await fetch(`/api/admin/subscribers/${id}/toggle-interest`, { method: 'POST' })
    await fetchSubscribers(selectedWebinarId, interestedOnly)
    setTogglingId(null)
  }

  const handleExportCSV = () => {
    if (!selectedWebinarId) return
    window.open(`/api/admin/subscribers/export?webinarId=${selectedWebinarId}`, '_blank')
  }

  const interestCount = subscribers.filter((s) => s.is_interested).length

  return (
    <div>
      {/* Controls bar */}
      <div className="flex flex-wrap items-end gap-4 mb-6">
        {/* Webinar selector */}
        <div className="flex-1 min-w-52">
          <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
            Webinaire
          </label>
          <select
            value={selectedWebinarId}
            onChange={(e) => {
              setSelectedWebinarId(e.target.value)
              setInterestedOnly(false)
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
          >
            <option value="">— Sélectionner un webinaire —</option>
            {webinars.map((w) => (
              <option key={w.id} value={w.id}>
                {w.title}
              </option>
            ))}
          </select>
        </div>

        {selectedWebinarId && (
          <div className="flex items-center gap-2 flex-wrap">
            {/* Total badge */}
            <span className="bg-blue-800 text-white text-sm font-medium px-3 py-2 rounded-lg">
              {subscribers.length} inscrit(s)
            </span>
            {interestCount > 0 && (
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-2 rounded-lg">
                ⭐ {interestCount} intéressé(s)
              </span>
            )}

            {/* Filter toggle */}
            <button
              onClick={() => setInterestedOnly((v) => !v)}
              className={`text-sm px-3 py-2 rounded-lg border transition-colors ${
                interestedOnly
                  ? 'bg-blue-800 border-blue-800 text-white font-semibold'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              ⭐ Intéressés seulement
            </button>

            {/* Export */}
            <button
              onClick={handleExportCSV}
              className="text-sm px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              ⬇ Export CSV
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {!selectedWebinarId ? (
        <div className="text-center py-16 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
          Sélectionnez un webinaire pour afficher les inscrits
        </div>
      ) : loading ? (
        <div className="text-center py-12 text-gray-400">Chargement…</div>
      ) : subscribers.length === 0 ? (
        <div className="text-center py-16 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
          {interestedOnly
            ? 'Aucun inscrit marqué comme intéressé'
            : 'Aucun inscrit pour ce webinaire'}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                  <th className="text-left px-4 py-3 font-semibold">Prénom</th>
                  <th className="text-left px-4 py-3 font-semibold">Nom</th>
                  <th className="text-left px-4 py-3 font-semibold">Email</th>
                  <th className="text-left px-4 py-3 font-semibold">Téléphone</th>
                  <th className="text-left px-4 py-3 font-semibold">Inscription</th>
                  <th className="text-center px-4 py-3 font-semibold">Intéressé</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {subscribers.map((sub) => (
                  <tr
                    key={sub.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      sub.is_interested ? 'bg-yellow-50/40' : ''
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">{sub.first_name}</td>
                    <td className="px-4 py-3 text-gray-700">{sub.last_name}</td>
                    <td className="px-4 py-3 text-gray-700">
                      <a
                        href={`mailto:${sub.email}`}
                        className="hover:text-blue-800 hover:underline transition-colors"
                      >
                        {sub.email}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{sub.phone || '—'}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {formatDateFR(sub.created_at)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggleInterest(sub.id)}
                        disabled={togglingId === sub.id}
                        title={sub.is_interested ? 'Retirer l\'étoile' : 'Marquer intéressé'}
                        className={`text-xl leading-none transition-all hover:scale-110 disabled:opacity-50 ${
                          sub.is_interested ? 'opacity-100' : 'opacity-20 hover:opacity-60'
                        }`}
                      >
                        ⭐
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
