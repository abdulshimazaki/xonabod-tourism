// Signature layout element: a layered mountain-ridge silhouette used to
// separate the hero from content and echo Xonobod's setting at the foothills
// of the Fergana valley — not decorative, it anchors the site's sense of place.
export function MountainDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div className={`relative h-16 w-full overflow-hidden sm:h-24 ${flip ? "rotate-180" : ""}`} aria-hidden>
      <svg viewBox="0 0 1440 120" className="absolute bottom-0 h-full w-full" preserveAspectRatio="none">
        <path d="M0,90 L120,60 L260,95 L420,40 L600,85 L760,30 L940,80 L1120,50 L1300,90 L1440,55 L1440,120 L0,120 Z" fill="#E8EFEC" />
        <path d="M0,110 L180,80 L360,110 L560,70 L760,105 L980,65 L1200,105 L1440,80 L1440,120 L0,120 Z" fill="#1F4A3D" />
      </svg>
    </div>
  );
}
