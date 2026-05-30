"use client";

interface Props {
  appStoreUrl: string;
  className?: string;
}

export default function AppStoreBadge({ appStoreUrl, className }: Props) {
  return (
    <a
      href={appStoreUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`app-store-badge-link ${className || ""}`}
      aria-label="Download on the App Store"
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

        {/* Apple Logo */}
        <g transform="translate(8, 7) scale(0.55)">
          <path
            d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.81-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.35 3.53c.67-.81 1.13-1.95 1-3.08-1 .04-2.17.66-2.88 1.48-.64.74-1.2 1.94-1.04 3.08 1.1.09 2.23-.56 2.92-1.48"
            fill="#fff"
          />
        </g>

        {/* Text: "Download on the" */}
        <text
          x="30"
          y="14"
          fill="#fff"
          fontSize="5"
          fontFamily="Inter, 'SF Pro Display', -apple-system, system-ui, sans-serif"
          fontWeight="400"
          letterSpacing="0.02em"
        >
          Download on the
        </text>

        {/* Text: "App Store" */}
        <text
          x="30"
          y="29"
          fill="#fff"
          fontSize="11"
          fontFamily="Inter, 'SF Pro Display', -apple-system, system-ui, sans-serif"
          fontWeight="600"
          letterSpacing="0.01em"
        >
          App Store
        </text>
      </svg>
    </a>
  );
}
