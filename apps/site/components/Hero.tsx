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
        <span className="eyebrow">Application musulmane gratuite</span>
        <h1 className="hero-title">
          Les horaires de prière,
          <br />
          calculés pour <em>votre</em> position.
        </h1>
        <p className="hero-sub">
          Coran, Qibla, Dhikr, calendrier hijri et hadiths dans une seule app.
          Pas de compte à créer, pas de pub, et on ne collecte pas vos données.
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
