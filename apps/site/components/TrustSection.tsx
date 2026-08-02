import Reveal from './Reveal';

const CARDS = [
  {
    glyph: '01001',
    title: 'Pas de compte',
    desc: "On ne vous demande ni email ni mot de passe. Vous installez, vous ouvrez, ça marche.",
  },
  {
    glyph: '$0.00',
    title: 'Pas de publicité',
    desc: 'Ni bannière, ni vidéo qui coupe la lecture d\'une sourate.',
  },
  {
    glyph: '∅',
    title: 'Pas de traqueur',
    desc: 'On n\'a pas intégré Google Analytics ni Firebase, et rien n\'est revendu.',
  },
  {
    glyph: '📍',
    title: 'Localisation utilisée pour un seul truc',
    desc: 'Elle sert à calculer les horaires et la Qibla, point. Rien n\'est envoyé sur un serveur.',
  },
];

export default function TrustSection() {
  return (
    <section className="section" id="confiance">
      <div className="wrap">
        <div className="section-head">
          <Reveal>
            <span className="eyebrow">Pensé différemment</span>
            <h2 className="section-heading">Pourquoi c'est gratuit et sans compte</h2>
            <p className="section-lede">
              Beaucoup d'apps de prière se financent avec vos données ou de la
              publicité intrusive. Islam Pro est distribuée sous licence{' '}
              <a
                href="https://github.com/furaxdev/Islam-pro/blob/main/LICENSE"
                style={{ color: 'var(--gold-soft)' }}
              >
                PolyForm Noncommercial
              </a>{' '}
              — le code est ouvert, l&apos;usage personnel est libre.
            </p>
          </Reveal>
        </div>
        <div className="trust-grid">
          {CARDS.map((c, i) => (
            <Reveal key={c.title} delay={i * 70}>
              <div className="trust-card">
                <span className="glyph">{c.glyph}</span>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
