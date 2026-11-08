import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 24, className, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    ...props,
  };
}

export function IconBook(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

export function IconBookOpen(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

export function IconBrain(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 5a3 3 0 0 0-3 3v1a3 3 0 0 0-3 3v1a3 3 0 0 0 3 3h.5" />
      <path d="M12 5a3 3 0 0 1 3 3v1a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3H12" />
      <path d="M12 18v3" />
      <path d="M9 21h6" />
      <path d="M8 12h8" />
    </svg>
  );
}

export function IconSparkles(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
      <path d="m6.5 6.5 2 2M15.5 15.5l2 2M17.5 6.5l-2 2M8.5 15.5l-2 2" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function IconMic(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="9" y="2" width="6" height="11" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <path d="M12 17v5" />
      <path d="M8 22h8" />
    </svg>
  );
}

export function IconScroll(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M8 3H7a2 2 0 0 0-2 2v14a1 1 0 0 0 1 1h1" />
      <path d="M16 3h1a2 2 0 0 1 2 2v14a1 1 0 0 1-1 1h-1" />
      <path d="M8 3a2 2 0 0 1 2 2v16h4V5a2 2 0 0 1 2-2" />
      <path d="M10 10h4M10 14h4" />
    </svg>
  );
}

export function IconHands(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M8 13v-2.5a1.5 1.5 0 0 1 3 0V12" />
      <path d="M11 11.5V9a1.5 1.5 0 0 1 3 0v3" />
      <path d="M14 11V8.5a1.5 1.5 0 0 1 3 0V13" />
      <path d="M17 12v-1.5a1.5 1.5 0 0 1 3 0V16a6 6 0 0 1-6 6h-2a6 6 0 0 1-5.2-3" />
      <path d="M4 14v1a6 6 0 0 0 6 6" />
    </svg>
  );
}

export function IconLeaf(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M11 20A7 7 0 0 1 9.8 7.1C15.5 4.4 20 8 20 13a7 7 0 0 1-7 7z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.5 12 13 13 11" />
    </svg>
  );
}

export function IconSearch(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function IconCheck(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function IconClipboard(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="8" y="4" width="8" height="4" rx="1" />
      <path d="M16 4h1a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1" />
      <path d="M9 12h6M9 16h4" />
    </svg>
  );
}

export function IconMoon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

export function IconSun(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

export function IconScale(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 3v18" />
      <path d="M5 7h14" />
      <path d="M5 7 3 13h4L5 7Z" />
      <path d="M19 7l-2 6h4l-2-6Z" />
      <path d="M8 21h8" />
    </svg>
  );
}

export function IconMessage(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function IconStar(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="m12 3 2.5 6.5L21 11l-5 4.5L17.5 22 12 18.5 6.5 22 8 15.5 3 11l6.5-1.5L12 3z" />
    </svg>
  );
}

export function IconAward(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="8" r="5" />
      <path d="M8.5 13 7 21l5-3 5 3-1.5-8" />
    </svg>
  );
}

export function IconLayers(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="m12 2 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 17 9 5 9-5" />
    </svg>
  );
}

export function IconMenu(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export function IconX(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function IconHome(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="m3 10 9-7 9 7" />
      <path d="M5 10v10h14V10" />
    </svg>
  );
}

export function IconUser(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20a8 8 0 0 1 16 0" />
    </svg>
  );
}

export function IconChevronLeft(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

export function IconPlay(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="m8 5 11 7-11 7V5z" />
    </svg>
  );
}

export function IconCalendar(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

export function IconMap(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="m3 7 6-3 6 3 6-3v13l-6 3-6-3-6 3V7z" />
      <path d="M9 4v13M15 7v13" />
    </svg>
  );
}

export function IconHomeDoor(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="m3 10 9-7 9 7" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-6h4v6" />
    </svg>
  );
}

export function IconPlane(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M2 12h20" />
      <path d="M12 2v4" />
      <path d="m5 12 3-6h8l3 6" />
      <path d="m7 12 2 8h6l2-8" />
    </svg>
  );
}

export function IconUtensils(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M6 3v8M6 11v10" />
      <path d="M10 3v5a2 2 0 0 1-2 2" />
      <path d="M4 3v5a2 2 0 0 0 2 2" />
      <path d="M14 3v18" />
      <path d="M18 3a3 3 0 0 1 0 6v12" />
    </svg>
  );
}

export function IconClock(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function IconCompass(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="m16 8-2.5 6.5L7 17l2.5-6.5L16 8z" />
    </svg>
  );
}

export function IconHeart(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 21s-7-4.5-9.5-8.5C.5 9 2 5 6 5c2 0 3.5 1 4 2.5C10.5 6 12 5 14 5c4 0 5.5 4 3.5 7.5C19 16.5 12 21 12 21z" />
    </svg>
  );
}

export function IconFlag(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 22V4" />
      <path d="M4 4h12l-2 4 2 4H4" />
    </svg>
  );
}

export function IconBookmark(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
    </svg>
  );
}


export function IconShare2(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
    </svg>
  );
}

export function IconShield(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 3 4 7v5c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V7l-8-4z" />
    </svg>
  );
}

export function IconLock(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
