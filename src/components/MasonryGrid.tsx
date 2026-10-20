import React, { useState } from "react";
import {
  Heart,
  Sparkles,
  ShieldCheck,
  Check,
  Layers,
  Share2,
  GraduationCap,
} from "lucide-react";
import { Pin } from "../types";

interface MasonryGridProps {
  pins: Pin[];
  onSelectPin: (pin: Pin) => void;
  onLikePin?: (pinId: string) => void;
  onToggleFavourite: (pinId: string) => void;
  onOpenVisualSearchWithPin?: (pin: Pin) => void;
  onOpenShare?: (pin: Pin) => void;
}

export const MasonryGrid: React.FC<MasonryGridProps> = ({
  pins,
  onSelectPin,
  onLikePin,
  onToggleFavourite,
  onOpenVisualSearchWithPin,
  onOpenShare,
}) => {
  if (pins.length === 0) {
    return (
      <div className="py-24 text-center">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
          <Layers className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-stone-800">
          No inspirations found
        </h3>
        <p className="text-sm text-stone-500 max-w-md mx-auto mt-1">
          Try clearing search filters or choosing a different aesthetic
          category.
        </p>
      </div>
    );
  }

  return (
    <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
      {pins.map((pin) => (
        <PinCard
          key={pin.id}
          pin={pin}
          onSelectPin={onSelectPin}
          onLikePin={onLikePin}
          onToggleFavourite={onToggleFavourite}
          onOpenVisualSearchWithPin={onOpenVisualSearchWithPin}
          onOpenShare={onOpenShare}
        />
      ))}
    </div>
  );
};

interface PinCardProps {
  pin: Pin;
  onSelectPin: (pin: Pin) => void;
  onLikePin?: (pinId: string) => void;
  onToggleFavourite: (pinId: string) => void;
  onOpenVisualSearchWithPin?: (pin: Pin) => void;
  onOpenShare?: (pin: Pin) => void;
}

const PinCard: React.FC<PinCardProps> = ({
  pin,
  onSelectPin,
  onToggleFavourite,
  onOpenVisualSearchWithPin,
  onOpenShare,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavourite(pin.id);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelectPin(pin)}
      className="group break-inside-avoid relative mb-4 cursor-zoom-in"
    >
      {/* Visual Image Card - 100% Pure Image, Zero Details Below */}
      <div className="relative overflow-hidden w-full rounded-2xl bg-stone-100 shadow-xs group-hover:shadow-2xl transition-all duration-300">
        <img
          src={pin.imageUrl}
          alt={pin.title}
          loading="lazy"
          className="w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
        />

        {/* Floating Favourite Heart Indicator when not hovering */}
        {pin.isFavourite && (
          <div className="absolute top-2.5 right-2.5 pointer-events-none group-hover:opacity-0 transition-opacity">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-black/60 backdrop-blur-md shadow-md">
              <Heart className="w-3.5 h-3.5 text-[#E60023] fill-[#E60023]" />
            </span>
          </div>
        )}

        {/* School Class Level Badge */}
        {pin.category && (
          <div className="absolute top-2.5 left-2.5 pointer-events-none group-hover:opacity-0 transition-opacity">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-900/85 backdrop-blur-md text-white text-[11px] font-bold tracking-wide shadow-md">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
              <span>{pin.category}</span>
            </span>
          </div>
        )}

        {/* Hover Overlay with Clean Action Controls */}
        <div
          className={`absolute inset-0 bg-gradient-to-b from-black/10 via-black/15 to-black/55 backdrop-blur-[1px] transition-all duration-200 flex flex-col justify-between p-3 ${
            isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className="flex items-center justify-between gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              {onOpenShare && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenShare(pin);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-stone-800 shadow-md backdrop-blur-md transition-all hover:scale-105 hover:bg-white active:scale-95 cursor-pointer"
                  title="Share on WhatsApp, X, Facebook, Pinterest, and more"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              )}

              {pin.category && (
                <span className="max-w-[70%] truncate rounded-full bg-stone-900/80 px-2.5 py-1 text-[10px] font-bold tracking-wide text-white shadow-sm ring-1 ring-white/10 backdrop-blur-md">
                  {pin.category}
                </span>
              )}
            </div>

            <button
              onClick={handleSave}
              className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-[10px] font-bold shadow-md transition-all active:scale-95 cursor-pointer ${
                pin.isFavourite
                  ? "bg-stone-900 text-white hover:bg-stone-800"
                  : "bg-[#E60023] hover:bg-[#b6001c] text-white"
              }`}
              title={
                pin.isFavourite
                  ? "Remove from Favourites"
                  : "Save to Favourites"
              }
            >
              {pin.isFavourite ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span>Save</span>
                </>
              )}
            </button>
          </div>

          <div
            className="flex items-end justify-between gap-2 pt-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-white drop-shadow-sm select-none">
                {pin.title}
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {onOpenVisualSearchWithPin && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenVisualSearchWithPin(pin);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-stone-900 shadow-md backdrop-blur-md transition-all hover:scale-105 hover:bg-white active:scale-95 cursor-pointer"
                  title="Search visually similar inspirations with Gemini AI Lens"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#E60023]" />
                </button>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavourite(pin.id);
                }}
                className={`flex h-8 w-8 items-center justify-center rounded-full shadow-md backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                  pin.isFavourite
                    ? "bg-[#E60023] text-white ring-2 ring-white/40"
                    : "bg-white/90 hover:bg-white text-stone-800 hover:text-[#E60023]"
                }`}
                title={
                  pin.isFavourite
                    ? "Remove from Favourites"
                    : "Save to Favourites"
                }
              >
                <Heart
                  className={`w-3.5 h-3.5 ${pin.isFavourite ? "fill-current" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
