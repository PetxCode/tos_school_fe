import React, { useState } from 'react';
import {
  X,
  Download,
  Share2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { Pin } from '../types';

interface HighResViewerModalProps {
  pin: Pin;
  onClose: () => void;
  onOpenShare: () => void;
}

export const HighResViewerModal: React.FC<HighResViewerModalProps> = ({
  pin,
  onClose,
  onOpenShare,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleZoomIn = () => setZoomLevel((z) => Math.min(2.5, z + 0.3));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(0.7, z - 0.3));
  const handleResetZoom = () => setZoomLevel(1);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const res = await fetch(pin.imageUrl, { mode: 'cors' });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const cleanFilename = pin.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      a.download = `pinspire-${cleanFilename || 'image'}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      window.open(pin.imageUrl, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      {/* Top Floating Control Bar */}
      <div
        className="flex items-center justify-between gap-4 z-10 max-w-7xl mx-auto w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <div className="text-white text-sm font-bold truncate max-w-xs sm:max-w-md drop-shadow-md">
            {pin.title}
          </div>
          {pin.curatedByAdmin && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-semibold border border-amber-400/30">
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              <span>Admin Curated</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="hidden sm:flex items-center gap-1 bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/10">
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="text-[11px] font-mono text-stone-300 px-2 py-0.5 hover:text-white"
              title="Reset zoom"
            >
              {Math.round(zoomLevel * 100)}%
            </button>
            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Share */}
          <button
            onClick={onOpenShare}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            title="Share across social networks"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>

          {/* Download to Machine */}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="px-4 py-2.5 rounded-full bg-[#E60023] hover:bg-[#b6001c] text-white shadow-lg font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
            title="Save high-resolution image to your machine"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? 'Saving...' : 'Download Image'}</span>
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors cursor-pointer"
            title="Close viewer (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main High-Resolution Image Container */}
      <div
        className="flex-1 flex items-center justify-center overflow-hidden my-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="transition-transform duration-200 ease-out flex items-center justify-center max-w-full max-h-full"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <img
            src={pin.imageUrl}
            alt={pin.title}
            className="max-h-[82vh] max-w-[90vw] object-contain rounded-xl shadow-2xl pointer-events-auto"
          />
        </div>
      </div>

      {/* Bottom Subtitle Bar */}
      <div
        className="text-center text-xs text-stone-400 drop-shadow-sm z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <span>High-Resolution Inspection &bull; Click and scroll or use zoom controls &bull; Full visual clarity</span>
      </div>
    </div>
  );
};
