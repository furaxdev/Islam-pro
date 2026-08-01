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
              Le code est le même partout — seule la manière de l&apos;installer change.
            </p>
          </Reveal>
        </div>
        <div className="download-grid">
          <Reveal delay={0}>
            <div className="download-card">
              <img src="https://cdn.simpleicons.org/android/3DDC84" alt="" />
              <h3>Android</h3>
              <p>APK signé, prêt à installer. Aucun compte Play Store requis.</p>
              <a className="btn btn-gold" href={APK_URL}>
                Télécharger l&apos;APK
              </a>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="download-card">
              <img src="https://cdn.simpleicons.org/apple/D4AF37" alt="" />
              <h3>macOS</h3>
              <p>Installeur .dmg prêt à l&apos;emploi, non signé Apple.</p>
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
          </Reveal>
          <Reveal delay={160}>
            <div className="download-card">
              <img src="https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/microsoft/default.svg" alt="" />
              <h3>Windows</h3>
              <p>Installeur .exe (NSIS), non signé Microsoft.</p>
              <a className="btn btn-gold" href={EXE_URL}>
                Télécharger le .exe
              </a>
              <p className="download-hint">
                Windows Defender peut avertir (app non signée) : Informations
                complémentaires → Exécuter quand même.
              </p>
            </div>
          </Reveal>
          <Reveal delay={240}>
            <div className="download-card">
              <img src="https://cdn.simpleicons.org/linux/FCC624" alt="" />
              <h3>Linux</h3>
              <p>Dépôt APT pour Ubuntu / Debian, mis à jour automatiquement.</p>
              <CopyCommand command="curl -fsSL https://islam-pro.vercel.app/install.sh | sudo -E bash" />
              <a className="btn btn-ghost" href={DEB_URL}>
                Ou télécharger le .deb
              </a>
            </div>
          </Reveal>
          <Reveal delay={320}>
            <div className="download-card">
              <span className="tag">Bientôt</span>
              <img src="https://cdn.simpleicons.org/apple/D4AF37" alt="" />
              <h3>iOS</h3>
              <p>Le build App Store est en préparation — revenez bientôt.</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
