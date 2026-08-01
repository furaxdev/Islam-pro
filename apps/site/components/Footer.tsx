export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <a href="#top" className="brand" style={{ marginBottom: '0.75rem' }}>
              <img src="/icon.png" alt="" />
              Islam Pro
            </a>
            <p style={{ color: 'var(--ink-dim)', fontSize: '0.9rem', maxWidth: '22rem' }}>
              Horaires de prière, Coran, Qibla, Dhikr et calendrier hijri — sans
              compte, sans publicité, sans traqueur.
            </p>
          </div>
          <div>
            <h4>Sources</h4>
            <ul>
              <li><a href="https://aladhan.com/prayer-times-api">Aladhan — horaires &amp; calendrier</a></li>
              <li><a href="https://alquran.cloud/api">AlQuran Cloud — texte &amp; traductions</a></li>
              <li><a href="https://islamic.network">Islamic Network — récitations audio</a></li>
            </ul>
          </div>
          <div>
            <h4>Projet</h4>
            <ul>
              <li><a href="https://github.com/furaxdev/Islam-pro">Code source</a></li>
              <li><a href="https://github.com/furaxdev/Islam-pro/blob/main/LICENSE">Licence</a></li>
              <li><a href="https://github.com/furaxdev/Islam-pro/blob/main/PRIVACY.md">Confidentialité</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © 2026 <strong><a href="https://furax-dev.onrender.com">FuraxDev</a></strong> — PolyForm Noncommercial License 1.0.0
          </span>
          <span>
            4 sons d&apos;Adhan au choix, tous CC — voir{' '}
            <a
              href="https://github.com/furaxdev/Islam-pro/blob/main/README.md#crédits"
              style={{ color: 'inherit' }}
            >
              les crédits
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
