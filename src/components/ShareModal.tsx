import React, { useState } from "react";
import {
  X,
  Share2,
  Copy,
  Check,
  Download,
  ExternalLink,
  Smartphone,
  Eye,
} from "lucide-react";
import { Pin } from "../types";

interface ShareModalProps {
  pin: Pin;
  onClose: () => void;
  onViewHighRes?: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  pin,
  onClose,
  onViewHighRes,
}) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = pin.title;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Direct download to user machine
  const handleDownloadImage = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch(pin.imageUrl, { mode: "cors" });
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      const cleanFilename = pin.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      a.download = `Tos School-${cleanFilename || "curriculum-chart"}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      // Fallback direct link download
      window.open(pin.imageUrl, "_blank");
    } finally {
      setIsDownloading(false);
    }
  };

  const shareText = `Check out this ${pin.category ? `${pin.category} ` : ""}curriculum visual: "${pin.title}" on Tos School`;

  // Social share URLs
  const socialNetworks = [
    {
      name: "WhatsApp",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.01-1.24-.74-.66-1.24-1.48-1.39-1.73-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.43 1.03 2.6c.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.11-.23-.17-.48-.3z" />
        </svg>
      ),
      color: "bg-[#25D366] text-white hover:bg-[#20b858]",
      shareUrl: `https://api.whatsapp.com/send?text=${encodeURIComponent(
        `${shareText} - ${shareUrl}`,
      )}`,
    },
    {
      name: "X (Twitter)",
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      color: "bg-black text-white hover:bg-stone-800",
      shareUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText,
      )}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "Pinterest",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.171-2.911 1.024 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.373-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
        </svg>
      ),
      color: "bg-[#E60023] text-white hover:bg-[#b6001c]",
      shareUrl: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
        shareUrl,
      )}&media=${encodeURIComponent(pin.imageUrl)}&description=${encodeURIComponent(shareText)}`,
    },
    {
      name: "Facebook",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      color: "bg-[#1877F2] text-white hover:bg-[#1566cf]",
      shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "LinkedIn",
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" />
        </svg>
      ),
      color: "bg-[#0077B5] text-white hover:bg-[#006097]",
      shareUrl: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
  ];

  // Native share sheet if available
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: pin.title,
          text: pin.description,
          url: shareUrl,
        });
      } catch {
        // User cancelled or unsupported
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200/60 shadow-xs">
            <Share2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900">
              Share Curriculum Visual
            </h3>
            <p className="text-xs text-stone-500">
              Share with students, teachers, study groups, or across social
              apps.
            </p>
          </div>
        </div>

        {/* Pin Preview Snippet */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-100 mb-5">
          <img
            src={pin.imageUrl}
            alt={pin.title}
            className="w-14 h-14 rounded-xl object-cover shrink-0 shadow-xs"
          />
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-stone-900 truncate">
              {pin.title}
            </div>
            <div className="text-[11px] text-stone-500 truncate">
              {pin.category}
            </div>
          </div>
        </div>

        {/* Social Media Networks Grid */}
        <div className="mb-5">
          <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2.5">
            Share Across Social Networks
          </div>
          <div className="grid grid-cols-5 gap-2">
            {socialNetworks.map((net) => (
              <a
                key={net.name}
                href={net.shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all shadow-xs active:scale-95 cursor-pointer ${net.color}`}
                title={`Share on ${net.name}`}
              >
                {net.icon}
                <span className="text-[10px] font-semibold mt-1 tracking-tight truncate w-full text-center">
                  {net.name}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Native Mobile OS Share (if supported) */}
        {typeof navigator !== "undefined" &&
          typeof navigator.share === "function" && (
            <div className="mb-4">
              <button
                onClick={handleNativeShare}
                className="w-full py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-stone-600" />
                <span>Share via Device Menu...</span>
              </button>
            </div>
          )}

        {/* Copy Link Strip */}
        <div className="mb-5">
          <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2">
            Direct Link
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-stone-100 text-stone-700 text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 select-all focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 flex items-center gap-1.5 cursor-pointer ${
                copied
                  ? "bg-emerald-600 text-white"
                  : "bg-stone-900 hover:bg-black text-white"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* View on Machine / Download Image */}
        <div className="border-t border-stone-100 pt-4 flex items-center justify-between gap-2">
          {onViewHighRes && (
            <button
              onClick={() => {
                onClose();
                onViewHighRes();
              }}
              className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:text-stone-900 hover:bg-stone-50 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-stone-500" />
              <span>Inspect Full-Res</span>
            </button>
          )}

          <button
            onClick={handleDownloadImage}
            disabled={isDownloading}
            className="flex-1 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isDownloading ? "Downloading..." : "Download Image"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
