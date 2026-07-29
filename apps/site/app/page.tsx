import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeatureRow from '@/components/FeatureRow';
import TrustSection from '@/components/TrustSection';
import Download from '@/components/Download';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />

        <FeatureRow
          id="quotidien"
          eyebrow="Chaque jour"
          title="Trois écrans, cinq prières"
          lede="Pas de menu à trois niveaux pour trouver l'heure du Maghrib — l'essentiel reste à portée de pouce."
          phoneSrc="/screens/prayer.png"
          phoneAlt="Écran des horaires de prière dans Islam Pro"
          items={[
            {
              mark: 'ﷺ',
              title: 'Coran texte et récitation',
              desc: 'Les 114 sourates, traduction affichable sous chaque verset, lecture audio par Alafasy.',
            },
            {
              mark: '◎',
              title: 'Qibla précise',
              desc: 'Direction calculée depuis votre position, distance jusqu’à la Kaaba en kilomètres.',
            },
            {
              mark: '♪',
              title: 'Adhan à l’heure dite',
              desc: 'Notification locale au son de l’appel à la prière — sur mobile comme sur desktop.',
            },
          ]}
        />

        <FeatureRow
          id="explorer"
          eyebrow="Explorer"
          title="Le calendrier hijri, sans le chercher"
          lede="Les événements du mois, une image du jour, et les 99 Noms d'Allah à portée d'un même onglet."
          phoneSrc="/screens/calendar.png"
          phoneAlt="Calendrier hijri dans Islam Pro"
          reverse
          items={[
            {
              mark: '☾',
              title: 'Calendrier hijri complet',
              desc: 'Mois par mois, avec les dates marquantes (Mawlid, Ramadan, Aïd) déjà annotées.',
            },
            {
              mark: '٩٩',
              title: "Les 99 Noms d'Allah",
              desc: 'Nom, sens et description — pour la mémorisation comme pour la réflexion.',
            },
            {
              mark: '🎧',
              title: 'Podcasts islamiques',
              desc: 'Une sélection à écouter en fond, classée par thème.',
            },
          ]}
        />

        <FeatureRow
          id="outils"
          eyebrow="Outils & guides"
          title="Le tasbih qui se souvient où vous en étiez"
          lede="Un compteur de dhikr avec anneau de progression, les douas classées par occasion, et les gestes de la salah et du wudu expliqués pas à pas."
          phoneSrc="/screens/tasbih.png"
          phoneAlt="Compteur de dhikr Tasbih dans Islam Pro"
          items={[
            {
              mark: '33',
              title: 'Dhikr & Tasbih',
              desc: "SubhanAllah, Alhamdulillah, Allahu Akbar — compteur avec cycles et raccourcis.",
            },
            {
              mark: '🤲',
              title: 'Douas & invocations',
              desc: 'Classées par occasion : voyage, repas, difficulté, gratitude.',
            },
            {
              mark: '☰',
              title: 'Guides Salah & Wudu',
              desc: "Chaque étape détaillée, pour apprendre ou se corriger.",
            },
          ]}
        />

        <TrustSection />
        <Download />
      </main>
      <Footer />
    </>
  );
}
