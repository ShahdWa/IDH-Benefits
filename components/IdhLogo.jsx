'use client';

export default function IdhLogo({ className = "h-9", light = false, inverted = false }) {
  // Box: White background with Black IDH letters (as in the requested image)
  // Divider: White line
  // Text: White text
  const isDarkBg = light || inverted;

  const boxBg     = isDarkBg ? "#FFFFFF" : "#C8102E";
  const letterCol = isDarkBg ? "#C8102E" : "#FFFFFF";
  const lineColor = isDarkBg ? "#FFFFFF" : "#D1D5DB";
  const textColor = isDarkBg ? "#FFFFFF" : "#4B5563";

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* IDH Box */}
      <svg
        viewBox="0 0 168 80"
        className="h-8 sm:h-9 w-auto flex-shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Rectangle */}
        <rect width="168" height="80" rx="1.5" fill={boxBg} />

        {/* Letter I */}
        <rect x="14" y="12" width="16" height="56" fill={letterCol} />

        {/* Letter D */}
        <path
          d="M42 12H72C87.5 12 96 21 96 40C96 59 87.5 68 72 68H42V12ZM58 26V54H70C78 54 81 48.5 81 40C81 31.5 78 26 70 26H58Z"
          fill={letterCol}
        />

        {/* Letter H */}
        <path
          d="M108 12H123V32.5H139V12H154V68H139V47.5H123V68H108V12Z"
          fill={letterCol}
        />
      </svg>

      {/* Vertical Divider Line */}
      <div
        className="w-[1.5px] h-7 sm:h-8 flex-shrink-0"
        style={{ backgroundColor: lineColor }}
      />

      {/* Stacked 3-line Text: INTEGRATED DIAGNOSTICS HOLDINGS */}
      <div
        className="flex flex-col text-[8.5px] sm:text-[9.5px] font-normal tracking-[0.16em] uppercase leading-[1.25] font-sans flex-shrink-0"
        style={{ color: textColor }}
      >
        <span className="font-light">INTEGRATED</span>
        <span className="font-light">DIAGNOSTICS</span>
        <span className="font-light">HOLDINGS</span>
      </div>
    </div>
  );
}
