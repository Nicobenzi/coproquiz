"use client";

type LogoProps = {
  size?: number;
  className?: string;
};

export default function Logo({ size = 80, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background rounded square */}
      <rect width="120" height="120" rx="28" fill="url(#logo-gradient)" />

      {/* Building silhouette */}
      <rect x="25" y="38" width="32" height="55" rx="3" fill="white" fillOpacity="0.25" />
      <rect x="63" y="28" width="32" height="65" rx="3" fill="white" fillOpacity="0.35" />

      {/* Windows on left building */}
      <rect x="31" y="45" width="8" height="7" rx="1.5" fill="white" fillOpacity="0.7" />
      <rect x="43" y="45" width="8" height="7" rx="1.5" fill="white" fillOpacity="0.7" />
      <rect x="31" y="57" width="8" height="7" rx="1.5" fill="white" fillOpacity="0.7" />
      <rect x="43" y="57" width="8" height="7" rx="1.5" fill="white" fillOpacity="0.7" />
      <rect x="31" y="69" width="8" height="7" rx="1.5" fill="white" fillOpacity="0.5" />
      <rect x="43" y="69" width="8" height="7" rx="1.5" fill="white" fillOpacity="0.5" />

      {/* Windows on right building */}
      <rect x="69" y="35" width="8" height="7" rx="1.5" fill="white" fillOpacity="0.7" />
      <rect x="81" y="35" width="8" height="7" rx="1.5" fill="white" fillOpacity="0.7" />
      <rect x="69" y="47" width="8" height="7" rx="1.5" fill="white" fillOpacity="0.7" />
      <rect x="81" y="47" width="8" height="7" rx="1.5" fill="white" fillOpacity="0.7" />
      <rect x="69" y="59" width="8" height="7" rx="1.5" fill="white" fillOpacity="0.5" />
      <rect x="81" y="59" width="8" height="7" rx="1.5" fill="white" fillOpacity="0.5" />
      <rect x="69" y="71" width="8" height="7" rx="1.5" fill="white" fillOpacity="0.4" />
      <rect x="81" y="71" width="8" height="7" rx="1.5" fill="white" fillOpacity="0.4" />

      {/* Door on right building */}
      <rect x="73" y="82" width="12" height="11" rx="2" fill="white" fillOpacity="0.5" />

      {/* Question mark bubble */}
      <circle cx="92" cy="22" r="16" fill="white" />
      <text
        x="92"
        y="28"
        textAnchor="middle"
        fill="url(#logo-gradient)"
        fontSize="20"
        fontWeight="800"
        fontFamily="system-ui, sans-serif"
      >
        ?
      </text>

      {/* Gradient definition */}
      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>
  );
}
