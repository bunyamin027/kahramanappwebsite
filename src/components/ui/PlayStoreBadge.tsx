"use client";

interface Props {
  playStoreUrl: string;
  className?: string;
}

export default function PlayStoreBadge({ playStoreUrl, className }: Props) {
  return (
    <a
      href={playStoreUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`app-store-badge-link ${className || ""}`}
      aria-label="Get it on Google Play"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 120 40"
        className="app-store-badge-svg"
      >
        {/* Background */}
        <rect width="120" height="40" rx="6" fill="#000" />
        <rect
          x="0.5"
          y="0.5"
          width="119"
          height="39"
          rx="5.5"
          stroke="#a6a6a6"
          strokeWidth="1"
          fill="none"
        />

        {/* Play Store Triangle Logo */}
        <g transform="translate(10, 8)">
          {/* Blue */}
          <path d="M3 1.5L13 12L3 22.5V1.5Z" fill="#4285F4" />
          {/* Green */}
          <path d="M3 1.5L13 12L18 7L3 1.5Z" fill="#0F9D58" />
          {/* Yellow */}
          <path d="M18 7L13 12L18 17L21.5 12L18 7Z" fill="#FFBC00" />
          {/* Red */}
          <path d="M3 22.5L13 12L18 17L3 22.5Z" fill="#DB4437" />
        </g>

        {/* Text: "GET IT ON" */}
        <text
          x="34"
          y="14"
          fill="#fff"
          fontSize="4.5"
          fontFamily="Inter, 'SF Pro Display', -apple-system, system-ui, sans-serif"
          fontWeight="400"
          letterSpacing="0.06em"
          textTransform="uppercase"
        >
          GET IT ON
        </text>

        {/* Text: "Google Play" */}
        <text
          x="34"
          y="29"
          fill="#fff"
          fontSize="10.5"
          fontFamily="Inter, 'SF Pro Display', -apple-system, system-ui, sans-serif"
          fontWeight="600"
          letterSpacing="0.01em"
        >
          Google Play
        </text>
      </svg>
    </a>
  );
}
