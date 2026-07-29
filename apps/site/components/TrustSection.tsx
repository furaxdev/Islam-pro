import Reveal from './Reveal';

const CARDS = [
  {
    glyph: '01001',
    title: 'Aucun compte',
    desc: "Rien à créer, rien à confirmer par e-mail. L'app s'ouvre et fonctionne.",
  },
  {
    glyph: '$0.00',
    title: 'Aucune publicité',
    desc: 'Pas de bannière, pas de vidéo forcée entre deux sourates.',
  },
  {
    glyph: '∅',
    title: 'Aucun traqueur',
    desc: 'Ni Google Analytics, ni Firebase, ni revente de données à des tiers.',
  },
  {
    glyph: '📍',
    title: 'Localisation, juste pour prier',
    desc: "Votre position sert uniquement à calculer les horaires et la Qibla — jamais stockée sur un serveur.",
  },
];

export default function TrustSection() {
  return (
    <section className="section" id="confiance">
      <div className="wrap">
        <div className="section-head">
          <Reveal>
            <span className="eyebrow">Pensé différemment</span>
            <h2 className="section-heading">Une app de prière, pas un produit</h2>
            <p className="section-lede">
              La plupart des apps de ce genre vivent de vos données ou de publicité
              intrusive. Islam Pro est distribuée sous licence{' '}
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
