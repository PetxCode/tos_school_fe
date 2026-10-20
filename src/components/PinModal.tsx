import React, { useState } from "react";
import {
  X,
  Heart,
  Share2,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Send,
  Check,
  Palette,
  MessageSquare,
  Tag,
  Download,
  Eye,
  GraduationCap,
  Trash2,
} from "lucide-react";
import { Pin } from "../types";

interface PinModalProps {
  pin: Pin;
  allPins: Pin[];
  isAdmin?: boolean;
  onClose: () => void;
  onLikePin?: (pinId: string) => void;
  onToggleFavourite: (pinId: string) => void;
  onAddComment: (pinId: string, commentText: string) => void;
  onDeletePin?: (pinId: string) => void;
  onSelectTag: (tag: string) => void;
  onSelectColor: (hex: string) => void;
  onSelectPin: (pin: Pin) => void;
  onOpenShare?: (pin: Pin) => void;
  onViewHighRes?: (pin: Pin) => void;
}

export const PinModal: React.FC<PinModalProps> = ({
  pin,
  allPins,
  isAdmin = false,
  onClose,
  onLikePin,
  onToggleFavourite,
  onAddComment,
  onDeletePin,
  onSelectTag,
  onSelectColor,
  onSelectPin,
  onOpenShare,
  onViewHighRes,
}) => {
  const [newComment, setNewComment] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  // Find visually similar pins (same category or overlapping tags)
  const similarPins = allPins
    .filter(
      (p) =>
        p.id !== pin.id &&
        (p.category === pin.category ||
          p.tags.some((t) => pin.tags.includes(t))),
    )
    .slice(0, 6);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(pin.id, newComment.trim());
    setNewComment("");
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const res = await fetch(pin.imageUrl, { mode: "cors" });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const cleanFilename = pin.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      a.download = `pinspire-${cleanFilename || "image"}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      window.open(pin.imageUrl, "_blank");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-stone-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-stone-900/10 hover:bg-stone-900/20 text-stone-700 transition-colors cursor-pointer"
          title="Close (ESC)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Visual Image Display */}
          <div className="relative bg-stone-900 flex items-center justify-center min-h-[360px] md:min-h-[580px] p-4 group">
            <img
              src={pin.imageUrl}
              alt={pin.title}
              className="max-h-[82vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
            />

            {/* Quick High-Res View Overlay on Image */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              {onViewHighRes && (
                <button
                  onClick={() => onViewHighRes(pin)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md text-white text-xs font-semibold transition-all cursor-pointer shadow-md"
                  title="Inspect high resolution on your machine"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View High-Res</span>
                </button>
              )}
            </div>

            {/* Source link */}
            {pin.sourceUrl && (
              <a
                href={pin.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs font-medium hover:bg-black/80 transition-colors"
              >
                <span>Visit Source</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Right Column: Details, AI Analysis & Discussion */}
          <div className="p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Top Bar: Clean Action Controls */}
              <div className="flex items-center justify-between gap-2 pb-5 border-b border-stone-100 flex-wrap">
                <div className="flex items-center gap-1.5">
                  {/* Share button opening Social Share dialog */}
                  {onOpenShare ? (
                    <button
                      onClick={() => onOpenShare(pin)}
                      className="p-2.5 px-3.5 rounded-full border border-stone-200 text-stone-700 hover:text-stone-900 hover:bg-stone-50 transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      title="Share across WhatsApp, X, Facebook, and social networks"
                    >
                      <Share2 className="w-4 h-4 text-stone-600" />
                      <span>Share</span>
                    </button>
                  ) : null}

                  {/* Download to Machine button */}
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="p-2.5 px-3 rounded-full border border-stone-200 text-stone-700 hover:text-stone-900 hover:bg-stone-50 transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs disabled:opacity-50"
                    title="Download high-resolution image to machine"
                  >
                    <Download className="w-4 h-4 text-stone-600" />
                    <span className="hidden sm:inline">
                      {isDownloading ? "Saving..." : "Download"}
                    </span>
                  </button>

                  {isAdmin && onDeletePin && (
                    <button
                      onClick={() => onDeletePin(pin.id)}
                      className="p-2.5 px-3 rounded-full border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      title="Delete this image from Cloudinary and database"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  )}
                </div>

                {/* Primary Red Save / Favourited Button */}
                <button
                  onClick={() => onToggleFavourite(pin.id)}
                  className={`flex items-center gap-1.5 px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer ${
                    pin.isFavourite
                      ? "bg-stone-900 text-white hover:bg-stone-800"
                      : "bg-[#E60023] hover:bg-[#b6001c] text-white"
                  }`}
                >
                  {pin.isFavourite ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Saved in Favourites</span>
                    </>
                  ) : (
                    <>
                      <Heart className="w-3.5 h-3.5 fill-current" />
                      <span>Save</span>
                    </>
                  )}
                </button>
              </div>

              {/* Title & Description */}
              <div className="mt-5">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-2xs">
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Class: {pin.category}</span>
                  </span>
                  {pin.curatedByAdmin && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-900 text-white text-[11px] font-semibold">
                      <ShieldCheck className="w-3 h-3 text-amber-400" />
                      <span>Curated by Admin</span>
                    </span>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight leading-snug">
                  {pin.title}
                </h2>
                <p className="text-stone-600 text-xs sm:text-sm mt-2 leading-relaxed">
                  {pin.description}
                </p>
              </div>

              {/* Author Attribution */}
              <div className="flex items-center gap-3 mt-5 p-3 rounded-2xl bg-stone-50 border border-stone-100">
                <img
                  src={pin.author.avatar}
                  alt={pin.author.name}
                  className="w-10 h-10 rounded-full object-cover border border-stone-200"
                />
                <div>
                  <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <span>{pin.author.name}</span>
                    {pin.author.role === "admin" && (
                      <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-medium">
                        Admin
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-stone-500">
                    {pin.author.handle}
                  </div>
                </div>
              </div>

              {/* Gemini AI Vision Breakdown */}
              {pin.aiAnalysis && (
                <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-amber-50/40 via-rose-50/20 to-stone-50 border border-amber-200/50">
                  {/* <div className="flex items-center gap-2 mb-2.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                      Gemini Vision Analysis
                    </span>
                  </div> */}

                  {pin.aiAnalysis.aestheticVibe && (
                    <div className="text-xs text-stone-700 mb-3 italic">
                      "{pin.aiAnalysis.aestheticVibe}"
                    </div>
                  )}

                  {/* Dominant Palette Swatches */}
                  {pin.aiAnalysis.dominantColors &&
                    pin.aiAnalysis.dominantColors.length > 0 && (
                      <div className="mb-3">
                        <div className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                          <Palette className="w-3 h-3" />
                          <span>Aesthetic Color Palette</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {pin.aiAnalysis.dominantColors.map((color, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                onSelectColor(color.hex);
                                onClose();
                              }}
                              className="group relative flex items-center justify-center cursor-pointer"
                              title={`${color.name} (${color.hex}) - click to filter`}
                            >
                              <span
                                className="w-6 h-6 rounded-full border border-black/10 shadow-xs transition-transform group-hover:scale-110"
                                style={{ backgroundColor: color.hex }}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Tags */}
                  {pin.tags && pin.tags.length > 0 && (
                    <div>
                      <div className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        <span>Visual Tags</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {pin.tags.map((tag, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              onSelectTag(tag);
                              onClose();
                            }}
                            className="px-2.5 py-1 rounded-lg text-[11px] bg-white border border-stone-200 text-stone-700 hover:bg-stone-900 hover:text-white transition-colors cursor-pointer"
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Comments Section */}
              <div className="mt-6 border-t border-stone-100 pt-5">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4 text-stone-600" />
                  <span className="text-xs font-bold text-stone-900">
                    Discussion ({pin.comments.length})
                  </span>
                </div>

                <div className="space-y-3 max-h-48 overflow-y-auto mb-3">
                  {pin.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="flex items-start gap-2.5 text-xs"
                    >
                      <img
                        src={comment.userAvatar}
                        alt={comment.userName}
                        className="w-7 h-7 rounded-full object-cover shrink-0"
                      />
                      <div className="bg-stone-100 rounded-2xl px-3 py-2 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-stone-900 text-[11px]">
                            {comment.userName}
                          </span>
                          <span className="text-[10px] text-stone-400">
                            {comment.timestamp}
                          </span>
                        </div>
                        <p className="text-stone-700 text-xs mt-0.5">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Comment Input */}
                <form
                  onSubmit={handleCommentSubmit}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment or aesthetic feedback..."
                    className="flex-1 bg-stone-100 rounded-full px-4 py-2 text-xs text-stone-900 focus:outline-none focus:bg-white border border-transparent focus:border-stone-400 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="p-2 rounded-full bg-stone-900 text-white disabled:opacity-40 hover:bg-black transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

              {/* Similar Inspirations */}
              {similarPins.length > 0 && (
                <div className="mt-8 border-t border-stone-100 pt-5">
                  <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-3">
                    More Like This
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {similarPins.map((simPin) => (
                      <div
                        key={simPin.id}
                        onClick={() => onSelectPin(simPin)}
                        className="group relative rounded-xl overflow-hidden aspect-[3/4] cursor-pointer"
                      >
                        <img
                          src={simPin.imageUrl}
                          alt={simPin.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                          <span className="text-white text-[10px] font-semibold truncate">
                            {simPin.title}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
