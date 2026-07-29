const APK_URL =
  'https://expo.dev/artifacts/eas/KQkugG_9gpYqHa4eezroNTPbc32vTxOCEQYr1qeQc5Q.apk';

export default function Header() {
  return (
    <header className="site-header">
      <div className="wrap">
        <a href="#top" className="brand">
          <img src="/icon.png" alt="" />
          Islam Pro
        </a>
        <nav className="header-nav">
          <ul className="header-links">
            <li><a href="#quotidien">Au quotidien</a></li>
            <li><a href="#explorer">Explorer</a></li>
            <li><a href="#confiance">Confidentialité</a></li>
            <li><a href="#telecharger">Télécharger</a></li>
          </ul>
          <div className="header-platforms">
            <a href={APK_URL} aria-label="Télécharger sur Android">
              <img src="https://cdn.simpleicons.org/android/3DDC84" alt="" />
            </a>
            <a href="#telecharger" aria-label="macOS">
              <img src="https://cdn.simpleicons.org/apple/D4AF37" alt="" />
            </a>
            <a
              href="https://github.com/furaxdev/Islam-pro"
              aria-label="Code source sur GitHub"
            >
              <img src="https://cdn.simpleicons.org/github/D4AF37" alt="" />
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
