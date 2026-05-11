# WebinaireInvest

Plateforme d'inscription à des webinaires avec tableau de bord d'administration.

## Stack

- **Next.js 14** (App Router)
- **Supabase** (base de données PostgreSQL)
- **Nodemailer** via Gmail SMTP (emails de confirmation et envoi de liens Zoom)
- **Tailwind CSS**
- **TypeScript**
- **Vercel** (déploiement)

## Démarrage

```bash
npm install
npm run dev       # http://localhost:3000
```

## Variables d'environnement

Créer un fichier `.env.local` à la racine :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Gmail SMTP
GMAIL_USER=
GMAIL_APP_PASSWORD=

# Admin
ADMIN_PASSWORD=

# URL de l'application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> Pour Gmail, générer un [mot de passe d'application](https://myaccount.google.com/apppasswords) (authentification à 2 facteurs requise).

## Commandes

```bash
npm run dev        # Serveur de développement
npm run build      # Build de production
npm run lint       # ESLint
npx tsc --noEmit   # Vérification TypeScript
```

## Déploiement

```bash
npx vercel --prod --yes
```

## Structure

```
app/
  page.tsx                          # Landing page publique (Server Component)
  layout.tsx                        # Layout racine
  admin/
    page.tsx                        # Dashboard admin (Client Component)
  api/
    subscribe/route.ts              # Inscription à un webinaire
    admin/webinars/route.ts         # CRUD webinaires
    admin/webinars/[id]/send-zoom/  # Envoi du lien Zoom aux inscrits
components/
  RegistrationForm.tsx              # Formulaire d'inscription
  AdminWebinarList.tsx              # Liste des webinaires (admin)
  AdminSubscriberTable.tsx          # Tableau des inscrits (admin)
lib/
  supabase.ts                       # Clients Supabase (anon + service_role)
  mailer.ts                         # Envoi d'emails via Nodemailer
  email-templates.ts                # Templates HTML des emails
  auth.ts                           # Authentification admin (cookie HMAC-SHA256)
  types.ts                          # Types Supabase générés
```

## Fonctionnalités

- Page publique avec formulaire d'inscription au webinaire actif
- Email de confirmation automatique à chaque inscription
- Dashboard admin protégé par mot de passe
- Gestion des webinaires (création, activation, modification)
- Envoi du lien Zoom en masse aux inscrits
- Export CSV de la liste des inscrits
