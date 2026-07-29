'use client';

import { useEffect, useMemo, useState } from 'react';

// Demonstration city — the mobile app itself computes this from the user's
// own location; the marketing site has no visitor location to work with, so
// it shows one real, live-fetched reference schedule (Paris) via the same
// public Aladhan API the app uses, clearly labelled as an example.
const DEMO_CITY = { label: 'Paris', lat: 48.8566, lon: 2.3522, method: 2 };
const PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
const PRAYER_LABELS: Record<(typeof PRAYERS)[number], string> = {
  Fajr: 'Fajr',
  Dhuhr: 'Dhuhr',
  Asr: 'Asr',
  Maghrib: 'Maghrib',
  Isha: 'Isha',
};

type Timings = Record<(typeof PRAYERS)[number], string>;

function stripTz(t: string) {
  return t.split(' ')[0];
}

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function polar(cx: number, cy: number, r: number, t: number) {
  // t in [0,1]: 0 -> left horizon (180deg), 1 -> right horizon (0deg), arcing over the top.
  const angle = (Math.PI * (1 - t));
  return { x: cx + r * Math.cos(angle), y: cy - r * Math.sin(angle) };
}

export default function PrayerClock() {
  const [timings, setTimings] = useState<Timings | null>(null);
  const [isExample, setIsExample] = useState(false);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const tick = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const date = new Date();
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    fetch(
      `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${DEMO_CITY.lat}&longitude=${DEMO_CITY.lon}&method=${DEMO_CITY.method}`,
      { signal: controller.signal }
    )
      .then((r) => r.json())
      .then((data) => {
        const t = data?.data?.timings;
        if (!t) throw new Error('no timings');
        const clean = Object.fromEntries(
          PRAYERS.map((p) => [p, stripTz(t[p])])
        ) as Timings;
        setTimings(clean);
      })
      .catch(() => {
        setIsExample(true);
        setTimings({ Fajr: '05:47', Dhuhr: '13:52', Asr: '17:38', Maghrib: '21:24', Isha: '23:12' });
      });
    return () => controller.abort();
  }, []);

  const { next, countdown } = useMemo(() => {
    if (!timings || !now) return { next: null as (typeof PRAYERS)[number] | null, countdown: '' };
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const withMin = PRAYERS.map((p) => ({ p, min: toMinutes(timings[p]) }));
    let upcoming = withMin.find((x) => x.min > nowMin);
    let deltaMin: number;
    if (upcoming) {
      deltaMin = upcoming.min - nowMin;
    } else {
      upcoming = withMin[0];
      deltaMin = 24 * 60 - nowMin + upcoming.min;
    }
    const h = Math.floor(deltaMin / 60);
    const m = deltaMin % 60;
    const label = h > 0 ? `dans ${h}h${String(m).padStart(2, '0')}` : `dans ${m}min`;
    return { next: upcoming.p, countdown: label };
  }, [timings, now]);

  const cx = 240;
  const cy = 210;
  const r = 178;

  const bounds = timings ? [toMinutes(timings.Fajr), toMinutes(timings.Isha)] : [0, 1];
  const span = bounds[1] - bounds[0] || 1;

  return (
    <div className="clock">
      <svg viewBox="0 0 480 250" className="clock-svg" role="img" aria-label="Horaires de prière du jour">
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          className="clock-arc"
        />
        {timings &&
          PRAYERS.map((p) => {
            const t = (toMinutes(timings[p]) - bounds[0]) / span;
            const { x, y } = polar(cx, cy, r, Math.min(1, Math.max(0, t)));
            const active = p === next;
            return (
              <g key={p} className={active ? 'clock-node clock-node--active' : 'clock-node'}>
                <circle cx={x} cy={y} r={active ? 7 : 4.5} className="clock-dot" />
                <text x={x} y={y - 16} textAnchor="middle" className="clock-label">
                  {PRAYER_LABELS[p]}
                </text>
                <text x={x} y={y + 24} textAnchor="middle" className="clock-time">
                  {timings[p]}
                </text>
              </g>
            );
          })}
      </svg>

      <div className="clock-status">
        {next ? (
          <>
            <span className="eyebrow">Prochaine prière{isExample ? ' — exemple, Paris' : ' — Paris'}</span>
            <p className="clock-next">
              {PRAYER_LABELS[next]} <span className="clock-countdown">{countdown}</span>
            </p>
          </>
        ) : (
          <span className="eyebrow">Chargement des horaires…</span>
        )}
      </div>
    </div>
  );
}
