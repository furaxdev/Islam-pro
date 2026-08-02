import Reveal from './Reveal';
import CopyCommand from './CopyCommand';

const APK_URL =
  'https://expo.dev/artifacts/eas/KQkugG_9gpYqHa4eezroNTPbc32vTxOCEQYr1qeQc5Q.apk';
const DMG_URL =
  'https://github.com/furaxdev/Islam-pro/releases/download/desktop-latest/Islam.Pro.Installer.dmg';
const EXE_URL =
  'https://github.com/furaxdev/Islam-pro/releases/download/desktop-latest/Islam.Pro_1.0.0_x64-setup.exe';
const DEB_URL =
  'https://github.com/furaxdev/Islam-pro/releases/download/desktop-latest/Islam.Pro_1.0.0_amd64.deb';

export default function Download() {
  return (
    <section className="section" id="telecharger">
      <div className="wrap">
        <div className="section-head">
          <Reveal>
            <span className="eyebrow">Télécharger</span>
            <h2 className="section-heading">Sur votre téléphone ou votre ordinateur</h2>
            <p className="section-lede">
              Même app, même code source, quatre façons différentes de l&apos;installer selon votre appareil.
            </p>
          </Reveal>
        </div>
        <div className="download-grid">
          <Reveal delay={0}>
            <div className="download-card">
              <div className="download-card-top">
                <img src="https://cdn.simpleicons.org/android/3DDC84" alt="" />
                <h3>Android</h3>
                <p>APK signé, prêt à installer. Aucun compte Play Store requis.</p>
              </div>
              <div className="download-card-actions">
                <a className="btn btn-gold" href={APK_URL}>
                  Télécharger l&apos;APK
                </a>
              </div>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="download-card">
              <div className="download-card-top">
                <img src="https://cdn.simpleicons.org/apple/D4AF37" alt="" />
                <h3>macOS</h3>
                <p>Installeur .dmg prêt à l&apos;emploi, non signé Apple.</p>
              </div>
              <div className="download-card-actions">
                <a className="btn btn-gold" href={DMG_URL}>
                  Télécharger le .dmg
                </a>
                <p className="download-hint">
                  macOS bloque l&apos;app au 1er lancement (non signée) : clic droit → Ouvrir.
                </p>
                <a
                  className="btn btn-ghost"
                  href="https://github.com/furaxdev/Islam-pro/tree/main/apps/mobile/src-tauri"
                >
                  Ou builder soi-même
                </a>
              </div>
            </div>
          </Reveal>
          <Reveal delay={160}>
            <div className="download-card">
              <div className="download-card-top">
                <svg viewBox="0 0 256 256" width="30" height="30" aria-hidden="true">
                  <path fill="#F1511B" d="M121.666 121.666H0V0h121.666z" />
                  <path fill="#80CC28" d="M256 121.666H134.335V0H256z" />
                  <path fill="#00ADEF" d="M121.663 256.002H0V134.336h121.663z" />
                  <path fill="#FBBC09" d="M256 256.002H134.335V134.336H256z" />
                </svg>
                <h3>Windows</h3>
                <p>Installeur .exe (NSIS), non signé Microsoft.</p>
              </div>
              <div className="download-card-actions">
                <a className="btn btn-gold" href={EXE_URL}>
                  Télécharger le .exe
                </a>
                <p className="download-hint">
                  Windows Defender peut avertir (app non signée) : Informations
                  complémentaires → Exécuter quand même.
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={240}>
            <div className="download-card">
              <div className="download-card-top">
                <svg viewBox="0 0 100 100" width="30" height="30" aria-hidden="true">
                  <circle cx="50" cy="50" r="45" fill="#f47421" />
                  <circle cx="50" cy="50" r="21.8" fill="none" stroke="#fff" strokeWidth="8.6" />
                  <g id="a">
                    <circle cx="19.4" cy="50" r="8.4" fill="#f47421" />
                    <path stroke="#f47421" strokeWidth="3.2" d="M67 50h10" />
                    <circle cx="19.4" cy="50" r="6" fill="#fff" />
                  </g>
                  <use xlinkHref="#a" transform="rotate(120 50 50)" />
                  <use xlinkHref="#a" transform="rotate(240 50 50)" />
                </svg>
                <h3>Linux</h3>
                <p>Dépôt APT pour Ubuntu / Debian, mis à jour automatiquement.</p>
              </div>
              <div className="download-card-actions">
                <CopyCommand command="curl -fsSL https://islam-pro.vercel.app/install | sudo -E bash" />
                <a className="btn btn-ghost" href={DEB_URL}>
                  Ou télécharger le .deb
                </a>
              </div>
            </div>
          </Reveal>
          <Reveal delay={320}>
            <div className="download-card">
              <span className="tag">Bientôt</span>
              <img src="https://cdn.simpleicons.org/apple/D4AF37" alt="" />
              <h3>iOS</h3>
              <p>Le build App Store est en préparation - revenez bientôt.</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
