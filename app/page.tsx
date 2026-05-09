import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="https://nextjs.org/icons/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              app/page.tsx
            </code>
            .
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

<<<<<<< HEAD
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="https://nextjs.org/icons/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
=======
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
  'Termes et conditions d\'investissement expliqués',
  'Critères d\'entrée, seuils minimaux & rendements attendus',
  'Questions-réponses en direct avec l\'investisseur',
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
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-4">
        <div className="max-w-6xl mx-auto">
          <span className="text-indigo-600 font-bold text-lg tracking-wide">
            ◆ INVEST WEBINAR
          </span>
        </div>
      </header>

      {/* Hero + Form */}
      <section className="max-w-6xl mx-auto px-4 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Left — Info */}
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

            {/* Webinar details card */}
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

            {/* Features list */}
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

          {/* Right — Form card */}
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

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-12 py-6 px-4">
        <div className="max-w-6xl mx-auto text-center text-slate-400 text-sm">
          © {new Date().getFullYear()} Webinaire Investissement — Tous droits réservés
        </div>
>>>>>>> f9aae73 (Refonte visuelle complète : palette indigo/slate + police Inter)
      </footer>
    </div>
  );
}
