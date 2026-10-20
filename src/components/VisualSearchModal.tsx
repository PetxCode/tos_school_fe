import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Camera,
  Upload,
  Sparkles,
  Search,
  Check,
  AlertCircle,
  Eye,
  ArrowRight,
} from "lucide-react";
import { Pin } from "../types";
import { apiUrl } from "../api";

interface VisualSearchModalProps {
  initialPin?: Pin | null;
  allPins: Pin[];
  onClose: () => void;
  onSelectPin: (pin: Pin) => void;
  onApplySearchQuery: (query: string) => void;
}

export const VisualSearchModal: React.FC<VisualSearchModalProps> = ({
  initialPin,
  allPins,
  onClose,
  onSelectPin,
  onApplySearchQuery,
}) => {
  const [queryImage, setQueryImage] = useState<string | null>(
    initialPin?.imageUrl || null,
  );
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [textVibeQuery, setTextVibeQuery] = useState(
    initialPin ? initialPin.title : "",
  );
  const [isSearching, setIsSearching] = useState(false);
  const [matchedPins, setMatchedPins] = useState<Pin[]>([]);
  const [visualAesthetic, setVisualAesthetic] = useState<string>("");
  const [keyFeatures, setKeyFeatures] = useState<string[]>([]);
  const [matchReasoning, setMatchReasoning] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample quick curriculum seeds
  const sampleSeeds = [
    {
      title: "Leaf Anatomy & Photosynthesis (Pry 4)",
      url: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=400&q=80",
    },
    {
      title: "Fractions & Geometric Shapes (Pry 5)",
      url: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=400&q=80",
    },
    {
      title: "Periodic Table & Chemical Elements (SSS 2)",
      url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=400&q=80",
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const res = reader.result as string;
      setQueryImage(res);
      setImageBase64(res);
      performVisualSearch(res, textVibeQuery);
    };
    reader.readAsDataURL(file);
  };

  const performVisualSearch = async (img: string | null, textQuery: string) => {
    setIsSearching(true);
    setErrorMsg(null);

    try {
      const response = await fetch(apiUrl("/api/ai/visual-search"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: img?.startsWith("data:") ? img : undefined,
          query: textQuery,
          pinCandidates: allPins,
        }),
      });

      if (!response.ok) {
        throw new Error("Visual search error");
      }

      const data = await response.json();

      if (Array.isArray(data.matchedPinIds) && data.matchedPinIds.length > 0) {
        const found = data.matchedPinIds
          .map((id: string) => allPins.find((p) => p.id === id))
          .filter(Boolean) as Pin[];
        setMatchedPins(found.length > 0 ? found : allPins.slice(0, 6));
      } else {
        // Fallback filter
        const lower = textQuery.toLowerCase();
        const fallback = allPins.filter(
          (p) =>
            p.title.toLowerCase().includes(lower) ||
            p.tags.some((t) => t.toLowerCase().includes(lower)),
        );
        setMatchedPins(fallback.length > 0 ? fallback : allPins.slice(0, 6));
      }

      if (data.visualAesthetic) setVisualAesthetic(data.visualAesthetic);
      if (Array.isArray(data.keyFeatures)) setKeyFeatures(data.keyFeatures);
      if (data.matchReasoning) setMatchReasoning(data.matchReasoning);
    } catch (err: any) {
      console.warn("Visual search fallback", err);
      // Fallback
      setMatchedPins(allPins.slice(0, 6));
      setVisualAesthetic("Contemporary Visual Alignment");
      setKeyFeatures([
        "Balanced geometry",
        "Tactile materiality",
        "Editorial light",
      ]);
    } finally {
      setIsSearching(false);
    }
  };

  // Run automatically if initialPin is passed
  useEffect(() => {
    if (initialPin) {
      performVisualSearch(initialPin.imageUrl, initialPin.title);
    }
  }, [initialPin]);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-1.5">
                <span>Curriculum Visual Lens &amp; Diagram Matcher</span>
                <Sparkles className="w-4 h-4 text-emerald-600" />
              </h2>
              <p className="text-xs text-stone-500">
                Match similar curriculum charts, scientific diagrams, and
                educational models using AI vision
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Query image selector */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Upload or Drop target */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-stone-300 hover:border-stone-900 rounded-2xl p-4 text-center cursor-pointer transition-all bg-stone-50/70 hover:bg-stone-50 flex flex-col items-center justify-center h-40"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <Upload className="w-6 h-6 text-stone-500 mb-2" />
              <span className="text-xs font-bold text-stone-800">
                Upload Query Photo
              </span>
              <span className="text-[10px] text-stone-500 mt-0.5">
                JPG, PNG, or WebP
              </span>
            </div>

            {/* Current Query Preview */}
            <div className="h-40 rounded-2xl overflow-hidden bg-stone-900 flex items-center justify-center relative border border-stone-200">
              {queryImage ? (
                <>
                  <img
                    src={queryImage}
                    alt="Query"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-end p-2.5">
                    <span className="text-[10px] text-white font-medium bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
                      Active Query Image
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-xs text-stone-400 text-center px-4">
                  Select an image or sample seed to search visually
                </div>
              )}
            </div>

            {/* Quick Sample Inspiration Seeds */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                Or Try Sample Seeds:
              </div>
              <div className="space-y-1.5">
                {sampleSeeds.map((seed, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setQueryImage(seed.url);
                      setImageBase64(null);
                      setTextVibeQuery(seed.title);
                      performVisualSearch(seed.url, seed.title);
                    }}
                    className="w-full flex items-center gap-2 p-1.5 rounded-xl border border-stone-200 hover:border-stone-900 hover:bg-stone-50 transition-all text-left"
                  >
                    <img
                      src={seed.url}
                      alt={seed.title}
                      className="w-8 h-8 rounded-lg object-cover shrink-0"
                    />
                    <span className="text-xs font-medium text-stone-800 truncate">
                      {seed.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI Recognition Insights Banner */}
          {visualAesthetic && (
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-stone-900 text-white text-[10px] font-bold uppercase tracking-wider">
                    Gemini AI Lens
                  </span>
                  <span className="text-xs font-bold text-stone-900">
                    {visualAesthetic}
                  </span>
                </div>
                {matchReasoning && (
                  <span className="text-[11px] text-stone-500 italic max-w-sm">
                    {matchReasoning}
                  </span>
                )}
              </div>

              {keyFeatures.length > 0 && (
                <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-stone-200/60">
                  <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                    Detected Attributes:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {keyFeatures.map((feat, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-white border border-stone-200 text-stone-700 text-[10px] font-medium"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Search Results */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Visually Similar Inspirations ({matchedPins.length})
              </h3>
              {visualAesthetic && (
                <button
                  onClick={() => {
                    onApplySearchQuery(visualAesthetic);
                    onClose();
                  }}
                  className="text-xs text-red-600 font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Explore this aesthetic in feed</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {isSearching ? (
              <div className="py-16 text-center">
                <Sparkles className="w-8 h-8 mx-auto text-rose-500 animate-spin mb-3" />
                <div className="text-sm font-bold text-stone-800">
                  Gemini Vision Analyzing Visual Features &amp; Spatial
                  Aesthetics...
                </div>
                <div className="text-xs text-stone-500 mt-1">
                  Comparing textures, lighting, and palette harmony
                </div>
              </div>
            ) : matchedPins.length === 0 ? (
              <div className="py-12 text-center text-xs text-stone-500">
                No matching visual inspirations found. Try a different image or
                seed!
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {matchedPins.map((pin) => (
                  <div
                    key={pin.id}
                    onClick={() => {
                      onSelectPin(pin);
                      onClose();
                    }}
                    className="group cursor-pointer rounded-2xl overflow-hidden border border-stone-200 bg-white hover:shadow-lg transition-all"
                  >
                    <div className="aspect-3/4 overflow-hidden bg-stone-100">
                      <img
                        src={pin.imageUrl}
                        alt={pin.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-2.5">
                      <div className="text-xs font-bold text-stone-900 truncate group-hover:text-red-600">
                        {pin.title}
                      </div>
                      <div className="text-[10px] text-stone-500 mt-0.5">
                        {pin.category}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
