// Quiet ambient texture, not a stock "arabesque" asset: an 8-point star
// lattice built from two overlapping rotated squares, repeated via an SVG
// <pattern>. Kept to hairline strokes at low opacity — the visual boldness
// of the page is spent on the prayer clock, not here.
export default function GeoPattern({ className }: { className?: string }) {
  return (
    <svg className={className} aria-hidden="true" width="100%" height="100%">
      <defs>
        <pattern id="geo-star" width="72" height="72" patternUnits="userSpaceOnUse">
          <g stroke="var(--gold)" strokeWidth="0.75" fill="none" opacity="0.6">
            <rect x="14" y="14" width="44" height="44" transform="rotate(0 36 36)" />
            <rect x="14" y="14" width="44" height="44" transform="rotate(45 36 36)" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#geo-star)" />
    </svg>
  );
}
