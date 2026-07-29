import PrayerClock from './PrayerClock';
import GeoPattern from './GeoPattern';

const APK_URL =
  'https://expo.dev/artifacts/eas/KQkugG_9gpYqHa4eezroNTPbc32vTxOCEQYr1qeQc5Q.apk';

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-bg">
        <GeoPattern className="geo-field" />
      </div>
      <div className="hero-glow" />
      <div className="wrap hero-inner">
        <span className="eyebrow">Votre compagnon musulman au quotidien</span>
        <h1 className="hero-title">
          Le temps de vos prières,
          <br />
          jamais <em>approximatif</em>.
        </h1>
        <p className="hero-sub">
          Coran, Qibla, Dhikr, calendrier hijri et hadiths — dans une app rapide,
          sans compte, sans publicité et sans traqueur.
        </p>
        <div className="hero-cta">
          <a className="btn btn-gold" href={APK_URL}>
            <img src="https://cdn.simpleicons.org/android/0A1612" alt="" />
            Télécharger l&apos;APK
          </a>
          <a className="btn btn-ghost" href="#telecharger">
            Voir toutes les plateformes
          </a>
        </div>

        <PrayerClock />
      </div>
    </section>
  );
}
