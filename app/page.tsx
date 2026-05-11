import RegistrationForm from '@/components/RegistrationForm'
import { supabase } from '@/lib/supabase'

export const revalidate = 0

function formatDateFR(dateStr: string): string {
  return new Date(dateStr).toLocaleString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Paris',
  })
}

const FEATURES = [
  "Termes et conditions d'investissement expliqués",
  "Critères d'entrée, seuils minimaux & rendements attendus",
  "Questions-réponses en direct avec l'investisseur",
  '100 % gratuit et en ligne',
]

export default async function HomePage() {
  const { data: webinar } = await supabase
    .from('webinars')
    .select('*')
    .eq('is_active', true)
    .maybeSingle()

  if (!webinar) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">📅</div>
          <h1 className="text-2xl font-bold text-slate-900 mb-6">
            Webinaire Investissement
          </h1>
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
            <p className="text-slate-600 text-lg">
              Aucun webinaire programmé pour le moment.
            </p>
            <p className="text-indigo-600 mt-2 font-medium">Revenez bientôt !</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-4 py-4">
        <div className="max-w-6xl mx-auto">
          <span className="text-indigo-600 font-bold text-lg tracking-wide">
            ◆ INVEST WEBINAR
          </span>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          <div>
            <span className="inline-block bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
              Présentation exclusive
            </span>

            <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-6 text-slate-900">
              Découvrez nos Conditions{' '}
              <span className="text-indigo-600">d&apos;Investissement</span>
            </h1>

            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              Un investisseur vous présente en détail ses critères, ses termes
              et ses opportunités — pour que vous puissiez décider en toute
              connaissance de cause.
            </p>

            <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm mb-8">
              <h2 className="text-xl font-bold text-indigo-600 mb-3">
                {webinar.title}
              </h2>
              <div className="flex items-start gap-2 text-slate-600">
                <span className="mt-0.5">📅</span>
                <span className="capitalize leading-relaxed">
                  {formatDateFR(webinar.date)}
                </span>
              </div>
            </div>

            <ul className="space-y-3">
              {FEATURES.map((item) => (
                <li key={item} className="flex items-center gap-3 text-slate-700">
                  <span className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">
              Confirmer ma participation
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              Gratuit · Places limitées · Confirmation par email
            </p>
            <RegistrationForm webinarId={webinar.id} />
          </div>

        </div>
      </section>

      <footer className="border-t border-slate-200 mt-12 py-6 px-4">
        <div className="max-w-6xl mx-auto text-center text-slate-400 text-sm">
          © {new Date().getFullYear()} Webinaire Investissement — Tous droits réservés
        </div>
      </footer>
    </main>
  )
}
