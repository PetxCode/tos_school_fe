import React from "react";
import pix from "/favIcon.png";
interface BrandLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showSubtitle?: boolean;
  inverted?: boolean;
  onClick?: () => void;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = "md",
  showSubtitle = true,
  inverted = false,
  onClick,
  className = "",
}) => {
  // Dimension presets for icon container
  const iconDimensions = {
    sm: "w-8 h-8 rounded-xl",
    md: "w-10 h-10 rounded-2xl",
    lg: "w-12 h-12 rounded-2xl",
    xl: "w-16 h-16 rounded-3xl",
  }[size];

  const iconSvgSizes = {
    sm: 20,
    md: 26,
    lg: 32,
    xl: 42,
  }[size];

  const titleSizes = {
    sm: "text-sm leading-tight max-w-[112px] sm:max-w-none",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  }[size];

  const subtitleSizes = {
    sm: "text-[9px]",
    md: "text-[10px]",
    lg: "text-[11px]",
    xl: "text-xs",
  }[size];

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 select-none ${onClick ? "cursor-pointer group" : ""} ${className}`}
    >
      {/* Educational Emblem Logo */}
      <img
        src={pix}
        alt="Educational Emblem"
        className={`h-12 object-contain`}
      />
      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-black tracking-tight ${titleSizes} ${
              inverted
                ? "text-white"
                : "text-stone-900 group-hover:text-emerald-700"
            } transition-colors`}
          >
            Tos School
          </span>
        </div>

        {showSubtitle && (
          <span
            className={`font-semibold tracking-wider uppercase ${subtitleSizes} mt-1 ${
              inverted ? "text-emerald-200" : "text-stone-500"
            }`}
          >
            Learning Resource Gallery
          </span>
        )}
      </div>
    </div>
  );
};
