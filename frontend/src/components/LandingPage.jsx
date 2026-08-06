import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  ShieldCheck,
  FlaskConical,
  FileText,
  Bell,
  Users,
  Lock,
  CheckCircle2,
  Clock,
  Quote,
} from 'lucide-react'

const FONT_IMPORT = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

  .font-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
  .font-body { font-family: 'IBM Plex Sans', sans-serif; }
  .font-mono { font-family: 'IBM Plex Mono', monospace; }

  @keyframes stampIn {
    0% { opacity: 0; transform: scale(1.4) rotate(-8deg); }
    60% { opacity: 1; transform: scale(0.94) rotate(-8deg); }
    100% { opacity: 1; transform: scale(1) rotate(-8deg); }
  }
  .stamp-animate { animation: stampIn 900ms 600ms cubic-bezier(0.16, 1, 0.3, 1) both; }

  @media (prefers-reduced-motion: reduce) {
    .stamp-animate { animation: none; opacity: 1; transform: rotate(-8deg); }
  }
`

const PLANS = [
  {
    name: 'Cabinet',
    price: '4 900',
    period: '/ mois',
    tagline: "Pour un médecin ou un petit cabinet",
    features: [
      "Jusqu'à 150 comptes-rendus / mois",
      '1 praticien',
      'Notifications patient par SMS',
      'Archivage 12 mois',
    ],
    featured: false,
  },
  {
    name: 'Laboratoire',
    price: '14 900',
    period: '/ mois',
    tagline: 'Pour un laboratoire ou une clinique',
    features: [
      'Comptes-rendus illimités',
      "Jusqu'à 10 praticiens",
      'Notifications SMS + WhatsApp',
      'Archivage illimité',
      'Accès multi-praticiens par patient',
    ],
    featured: true,
  },
  {
    name: 'Réseau',
    price: 'Sur devis',
    period: '',
    tagline: 'Pour un groupe de cliniques',
    features: [
      'Tout Laboratoire, plus :',
      'Multi-sites centralisés',
      'Intégration à votre SIL existant',
      'Accompagnement dédié',
    ],
    featured: false,
  },
]

const TESTIMONIALS = [
  {
    quote:
      "Nos patients n'appellent plus pour savoir si leurs résultats sont prêts — ils le savent avant nous.",
    name: 'Dr. Yasmine Kaddour',
    role: 'Médecin généraliste, Annaba',
  },
  {
    quote:
      "On a supprimé le classeur papier de l'accueil. Chaque compte-rendu part du bon dossier, sans erreur de nom.",
    name: 'Dr. Riad Belhadj',
    role: "Directeur, Laboratoire d'analyses El Amel",
  },
  {
    quote:
      'La mise en place a pris une matinée. Le reste de la semaine, on a juste continué à travailler normalement.',
    name: 'Dr. Sofiane Marref',
    role: 'Radiologue, Clinique Ennour',
  },
]

function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="font-body min-h-screen bg-[#F6F3EC] text-[#122324]">
      <style>{FONT_IMPORT}</style>

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 bg-[#F6F3EC]/90 backdrop-blur-md border-b border-[#122324]/10 z-50">
        <div className="max-w-6xl mx-auto px-6 flex justify-between h-16 items-center">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-[#3E7C74] flex items-center justify-center">
              <FlaskConical className="w-4 h-4 text-[#F6F3EC]" strokeWidth={2.25} />
            </span>
            <span className="font-display text-xl tracking-tight">Errazilab</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#122324]/70">
            <a href="#comment-ca-marche" className="hover:text-[#122324] transition-colors">
              Comment ça marche
            </a>
            <a href="#securite" className="hover:text-[#122324] transition-colors">
              Sécurité
            </a>
            <a href="#tarifs" className="hover:text-[#122324] transition-colors">
              Tarifs
            </a>
            <a href="#temoignages" className="hover:text-[#122324] transition-colors">
              Témoignages
            </a>
          </div>

          <div className="flex items-center gap-5">
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-semibold text-[#122324]/80 hover:text-[#122324] transition-colors"
            >
              Connexion
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2 bg-[#122324] text-[#F6F3EC] rounded-full text-sm font-semibold hover:bg-[#0B1A1B] transition-colors"
            >
              Essayer gratuitement
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.05fr_0.95fr] gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 border border-[#122324]/15 bg-white/60 px-3.5 py-1.5 rounded-full mb-7">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3E7C74]" />
              <span className="font-mono text-xs tracking-wide text-[#122324]/70">
                PLATEFORME DE LABORATOIRE SÉCURISÉE
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl leading-[1.05] tracking-tight mb-7">
              Le compte-rendu de votre patient,
              <br />
              <span className="italic text-[#3E7C74]">remis en main propre</span>
              <br />
              — numériquement.
            </h1>

            <p className="text-lg text-[#122324]/70 leading-relaxed mb-9 max-w-md">
              Errazilab relie médecins, laboratoires et patients autour d'un
              seul dossier chiffré : dépôt, vérification et remise des
              résultats, sans papier perdu ni salle d'attente.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                onClick={() => navigate('/login')}
                className="group px-6 py-3.5 bg-[#D98E3F] text-[#122324] rounded-xl font-semibold flex items-center gap-2 hover:bg-[#C97D2E] transition-colors"
              >
                Créer un compte médecin
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button className="px-6 py-3.5 border border-[#122324]/20 rounded-xl font-semibold text-[#122324]/80 hover:border-[#122324]/40 transition-colors">
                Voir une démo
              </button>
            </div>

            <p className="font-mono text-xs text-[#122324]/45 tracking-wide">
              CONFORME AUX EXIGENCES DE CONFIDENTIALITÉ MÉDICALE · HÉBERGÉ EN ALGÉRIE
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 border border-[#122324]/10 rounded-[28px] -z-10 hidden md:block" />
            <div className="bg-white border border-[#122324]/12 rounded-2xl shadow-[0_20px_50px_-25px_rgba(18,35,36,0.35)] p-7 relative overflow-hidden">
              <div className="flex justify-between items-start mb-6 pb-5 border-b border-dashed border-[#122324]/15">
                <div>
                  <div className="font-mono text-[10px] tracking-widest text-[#122324]/40 mb-1">
                    COMPTE-RENDU N° 0192-A
                  </div>
                  <div className="font-display text-lg">Analyse sanguine</div>
                </div>
                <span className="font-mono text-[10px] px-2 py-1 rounded-md bg-[#3E7C74]/10 text-[#3E7C74] tracking-wide">
                  04/08/2026
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[#122324]/45 font-mono text-xs">PATIENT</span>
                  <span className="h-3 w-28 bg-[#122324]/10 rounded" />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#122324]/45 font-mono text-xs">MÉDECIN</span>
                  <span className="h-3 w-24 bg-[#122324]/10 rounded" />
                </div>
                <div className="h-2.5 w-full bg-[#122324]/[0.06] rounded" />
                <div className="h-2.5 w-5/6 bg-[#122324]/[0.06] rounded" />
                <div className="h-2.5 w-4/6 bg-[#122324]/[0.06] rounded" />
              </div>

              <div className="flex items-center justify-between pt-5 border-t border-[#122324]/10">
                <div className="flex items-center gap-1.5 text-[#122324]/50">
                  <Lock className="w-3.5 h-3.5" />
                  <span className="font-mono text-[10px] tracking-wide">CHIFFRÉ · JWT</span>
                </div>

                <div className="stamp-animate flex items-center gap-1.5 rotate-[-8deg] border-2 border-[#3E7C74] text-[#3E7C74] rounded-lg px-2.5 py-1">
                  <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                  <span className="font-display text-sm font-semibold">Vérifié</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section id="comment-ca-marche" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-lg mb-16">
            <span className="font-mono text-xs tracking-widest text-[#3E7C74]">
              LE PARCOURS D'UN RÉSULTAT
            </span>
            <h2 className="font-display text-4xl tracking-tight mt-3">
              Trois étapes, un seul dossier.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-x-10 gap-y-14">
            <div>
              <div className="font-display text-3xl text-[#3E7C74] mb-4">01</div>
              <h3 className="font-semibold text-lg mb-2">Dépôt</h3>
              <p className="text-[#122324]/65 leading-relaxed">
                Le médecin ou le laboratoire importe le compte-rendu et
                l'associe directement au dossier du patient concerné.
              </p>
            </div>
            <div>
              <div className="font-display text-3xl text-[#3E7C74] mb-4">02</div>
              <h3 className="font-semibold text-lg mb-2">Vérification</h3>
              <p className="text-[#122324]/65 leading-relaxed">
                Chaque document est chiffré, horodaté et archivé avant d'être
                mis à disposition.
              </p>
            </div>
            <div>
              <div className="font-display text-3xl text-[#3E7C74] mb-4">03</div>
              <h3 className="font-semibold text-lg mb-2">Remise</h3>
              <p className="text-[#122324]/65 leading-relaxed">
                Le patient reçoit une notification et consulte son résultat, où
                qu'il soit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SÉCURITÉ */}
      <section id="securite" className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-16 items-center">
          <div>
            <span className="font-mono text-xs tracking-widest text-[#3E7C74]">
              CONFIDENTIALITÉ MÉDICALE
            </span>
            <h2 className="font-display text-4xl tracking-tight mt-3 mb-6">
              Pensé pour protéger
              <br />
              ce qui compte.
            </h2>
            <p className="text-[#122324]/65 leading-relaxed max-w-md">
              Un dossier médical n'est pas un fichier comme un autre. Errazilab
              est construit autour de cette exigence, à chaque étape.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                icon: Lock,
                title: 'Chiffrement de bout en bout',
                text: 'Documents et échanges protégés du dépôt à la consultation.',
              },
              {
                icon: Users,
                title: 'Accès par rôle',
                text: 'Un médecin accède à ses patients, un patient à ses résultats. Rien de plus.',
              },
              {
                icon: FileText,
                title: 'Traçabilité complète',
                text: 'Chaque dépôt est horodaté et rattaché à un praticien identifié.',
              },
              {
                icon: ShieldCheck,
                title: 'Hébergement local',
                text: 'Infrastructure conforme aux exigences du secteur en Algérie.',
              },
            ].map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="bg-white border border-[#122324]/10 rounded-xl p-5"
              >
                <Icon className="w-5 h-5 text-[#3E7C74] mb-3" strokeWidth={2} />
                <h3 className="font-semibold mb-1.5">{title}</h3>
                <p className="text-sm text-[#122324]/60 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-20 px-6 bg-[#122324] text-[#F6F3EC]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          <div>
            <div className="font-display text-4xl text-[#D98E3F]">+2 400</div>
            <div className="text-[#F6F3EC]/60 text-sm mt-1">Comptes-rendus remis</div>
          </div>
          <div>
            <div className="font-display text-4xl text-[#D98E3F]">+60</div>
            <div className="text-[#F6F3EC]/60 text-sm mt-1">Praticiens actifs</div>
          </div>
          <div>
            <div className="font-display text-4xl text-[#D98E3F] flex items-center justify-center gap-1.5">
              <Clock className="w-6 h-6" /> 24/7
            </div>
            <div className="text-[#F6F3EC]/60 text-sm mt-1">Disponibilité</div>
          </div>
          <div>
            <div className="font-display text-4xl text-[#D98E3F]">0</div>
            <div className="text-[#F6F3EC]/60 text-sm mt-1">Papier perdu</div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-lg mb-16">
            <span className="font-mono text-xs tracking-widest text-[#3E7C74]">
              POUR LES CLINIQUES ET LABORATOIRES
            </span>
            <h2 className="font-display text-4xl tracking-tight mt-3">
              Un dossier patient à la hauteur de votre pratique.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border border-[#122324]/10">
              <FileText className="text-[#3E7C74] mb-4" />
              <h3 className="font-semibold text-lg mb-2">Dossiers centralisés</h3>
              <p className="text-[#122324]/60 leading-relaxed">
                Chaque patient regroupe l'historique complet de ses résultats,
                consultable en un clic.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-[#122324]/10">
              <Bell className="text-[#3E7C74] mb-4" />
              <h3 className="font-semibold text-lg mb-2">Notifications instantanées</h3>
              <p className="text-[#122324]/60 leading-relaxed">
                Le patient est prévenu dès qu'un résultat est disponible, sans
                appel de rappel.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-[#122324]/10">
              <Users className="text-[#3E7C74] mb-4" />
              <h3 className="font-semibold text-lg mb-2">Multi-praticiens</h3>
              <p className="text-[#122324]/60 leading-relaxed">
                Plusieurs médecins peuvent suivre un même patient, chacun avec
                son propre accès.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TARIFS */}
      <section id="tarifs" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-lg mb-16">
            <span className="font-mono text-xs tracking-widest text-[#3E7C74]">
              TARIFICATION
            </span>
            <h2 className="font-display text-4xl tracking-tight mt-3">
              Un tarif par taille de structure, pas par fonctionnalité.
            </h2>
            <p className="text-[#122324]/60 mt-4">
              Toutes les offres incluent le chiffrement, les notifications et
              l'accès patient. Sans engagement.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-7 border ${
                  plan.featured
                    ? 'bg-[#122324] text-[#F6F3EC] border-[#122324] md:-translate-y-3 shadow-[0_25px_50px_-20px_rgba(18,35,36,0.4)]'
                    : 'bg-white border-[#122324]/10'
                }`}
              >
                {plan.featured && (
                  <span className="inline-block font-mono text-[10px] tracking-widest bg-[#D98E3F] text-[#122324] px-2.5 py-1 rounded-full mb-5">
                    LE PLUS CHOISI
                  </span>
                )}

                <h3 className="font-display text-xl mb-1">{plan.name}</h3>
                <p
                  className={`text-sm mb-5 ${
                    plan.featured ? 'text-[#F6F3EC]/60' : 'text-[#122324]/55'
                  }`}
                >
                  {plan.tagline}
                </p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="font-display text-3xl">{plan.price}</span>
                  {plan.period && (
                    <span
                      className={`text-sm ${
                        plan.featured ? 'text-[#F6F3EC]/50' : 'text-[#122324]/45'
                      }`}
                    >
                      DA {plan.period}
                    </span>
                  )}
                </div>

                <ul className="space-y-2.5 mb-8">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-sm">
                      <CheckCircle2
                        className={`w-4 h-4 mt-0.5 shrink-0 ${
                          plan.featured ? 'text-[#D98E3F]' : 'text-[#3E7C74]'
                        }`}
                      />
                      <span className={plan.featured ? 'text-[#F6F3EC]/85' : 'text-[#122324]/75'}>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate('/login')}
                  className={`w-full py-3 rounded-lg text-sm font-semibold transition-colors ${
                    plan.featured
                      ? 'bg-[#D98E3F] text-[#122324] hover:bg-[#C97D2E]'
                      : 'bg-[#122324] text-[#F6F3EC] hover:bg-[#0B1A1B]'
                  }`}
                >
                  {plan.price === 'Sur devis' ? 'Nous contacter' : 'Choisir cette offre'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section id="temoignages" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-lg mb-16">
            <span className="font-mono text-xs tracking-widest text-[#3E7C74]">
              ILS UTILISENT ERRAZILAB
            </span>
            <h2 className="font-display text-4xl tracking-tight mt-3">
              Ce qui change, au quotidien.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="bg-[#F6F3EC] border border-[#122324]/10 rounded-2xl p-6 flex flex-col"
              >
                <Quote className="w-5 h-5 text-[#D98E3F] mb-4" />
                <p className="font-display text-lg leading-snug mb-6 flex-1">
                  « {t.quote} »
                </p>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-[#122324]/50">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-28 px-6 text-center">
        <h2 className="font-display text-4xl md:text-5xl tracking-tight max-w-2xl mx-auto mb-9">
          Votre cabinet mérite un dossier patient à la hauteur.
        </h2>
        <button
          onClick={() => navigate('/login')}
          className="px-9 py-4 bg-[#122324] text-[#F6F3EC] rounded-xl font-semibold inline-flex items-center gap-2 hover:bg-[#0B1A1B] transition-colors"
        >
          Démarrer maintenant
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#122324]/10 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-[#122324]/50">
          <span>© 2026 Errazilab — Plateforme médicale sécurisée</span>
          <span className="font-mono text-xs">ALGÉRIE</span>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage