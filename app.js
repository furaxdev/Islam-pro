const hadiths = [
  '“Les actions ne valent que par les intentions.” — Bukhari & Muslim',
  '“Le meilleur d’entre vous est celui qui apprend le Coran et l’enseigne.” — Bukhari',
  '“La miséricorde n’est ôtée qu’à un malheureux.” — Tirmidhi',
];

const verses = [
  '“C’est par l’évocation d’Allah que les cœurs se tranquillisent.” (13:28)',
  '“Allah n’impose à aucune âme une charge supérieure à sa capacité.” (2:286)',
  '“Invoquez-Moi, Je vous répondrai.” (40:60)',
];

const prayerTimes = [
  ['Fajr', '05:25'],
  ['Dhuhr', '13:05'],
  ['Asr', '16:45'],
  ['Maghrib', '19:28'],
  ['Isha', '21:00'],
];

const events = [
  'Ramadan: 1 Ramadan 1447H (estimé)',
  'Aïd al-Fitr: 1 Shawwal 1447H',
  'Aïd al-Adha: 10 Dhu al-Hijjah 1447H',
  'Mawlid: 12 Rabi al-awwal 1448H',
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function updateClock() {
  const now = new Date();
  document.getElementById('today').textContent = now.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  document.getElementById('clock').textContent = now.toLocaleTimeString('fr-FR');
}

function minutesUntil(time) {
  const now = new Date();
  const [h, m] = time.split(':').map(Number);
  const target = new Date(now);
  target.setHours(h, m, 0, 0);
  if (target < now) target.setDate(target.getDate() + 1);
  return Math.round((target - now) / 60000);
}

function renderPrayers() {
  const ul = document.getElementById('prayer-times');
  ul.innerHTML = '';
  prayerTimes.forEach(([name, time]) => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${name}</span><strong>${time}</strong>`;
    ul.appendChild(li);
  });

  const upcoming = prayerTimes.find(([, t]) => minutesUntil(t) >= 0) || prayerTimes[0];
  document.getElementById('next-prayer').textContent = `Prochaine prière: ${upcoming[0]} dans ${minutesUntil(upcoming[1])} min.`;
}

function renderEvents() {
  const ul = document.getElementById('events');
  ul.innerHTML = '';
  events.forEach((eventText) => {
    const li = document.createElement('li');
    li.textContent = eventText;
    ul.appendChild(li);
  });
}

function secureSlug(prefix = 'islam-pro') {
  const bytes = new Uint8Array(8); // 64 bits entropy
  crypto.getRandomValues(bytes);
  const suffix = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
  return `${prefix}-${suffix}`;
}

function setupTabs() {
  const tabs = document.querySelectorAll('.tab');
  const screens = document.querySelectorAll('.screen');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const { target } = tab.dataset;
      tabs.forEach((t) => t.classList.toggle('active', t === tab));
      screens.forEach((s) => s.classList.toggle('active', s.id === `screen-${target}`));
    });
  });
}

document.getElementById('refresh-hadith').addEventListener('click', () => {
  document.getElementById('hadith').textContent = pick(hadiths);
});

document.getElementById('generate-link').addEventListener('click', () => {
  const slug = secureSlug();
  document.getElementById('secure-link').textContent = `https://islam-pro.app/share/${slug}`;
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').catch(() => {});
  });
}

setupTabs();
document.getElementById('hadith').textContent = pick(hadiths);
document.getElementById('verse').textContent = pick(verses);
renderPrayers();
renderEvents();
updateClock();
setInterval(() => {
  updateClock();
  renderPrayers();
}, 1000);
