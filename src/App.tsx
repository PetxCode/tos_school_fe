/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Compass,
  Heart,
  Sparkles,
  X,
  Filter,
  Check,
  ShieldCheck,
  Lock,
  GraduationCap,
  BookOpen,
  Download,
  Share2,
  Trash2,
} from "lucide-react";
import { Pin, ViewTab, AuthUser } from "./types";
import { apiUrl } from "./api";
import { INITIAL_CATEGORIES } from "./data/initialData";
import { Navbar } from "./components/Navbar";
import { MasonryGrid } from "./components/MasonryGrid";
import { PinModal } from "./components/PinModal";
import { AdminUploadModal } from "./components/AdminUploadModal";
import { AdminLoginModal } from "./components/AdminLoginModal";
import { ShareModal } from "./components/ShareModal";
import { HighResViewerModal } from "./components/HighResViewerModal";
import { VisualSearchModal } from "./components/VisualSearchModal";
import { FavouritesView } from "./components/FavouritesView";

export default function App() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [favouriteIds, setFavouriteIds] = useState<string[]>(() => {
    try {
      const savedIds = localStorage.getItem("edupins_favourite_ids_v1");
      if (savedIds) return JSON.parse(savedIds);

      const cachedPins = JSON.parse(
        localStorage.getItem("pinspire_pins_v4") || "[]",
      );
      return Array.isArray(cachedPins)
        ? cachedPins.filter((pin) => pin.isFavourite).map((pin) => pin.id)
        : [];
    } catch {
      return [];
    }
  });
  const [isPinsLoading, setIsPinsLoading] = useState(true);
  const [pinsLoadError, setPinsLoadError] = useState<string | null>(null);

  // Admin Auth state
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  // Navigation and Filter States
  const [currentTab, setCurrentTab] = useState<ViewTab>("explore");
  const [activeCategory, setActiveCategory] = useState<string>("All Classes");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedColorHex, setSelectedColorHex] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<
    "all" | "24h" | "7d" | "30d" | "90d" | "1y"
  >("all");
  const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc");

  // Modals & Panels
  const [selectedPinForModal, setSelectedPinForModal] = useState<Pin | null>(
    null,
  );
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);
  const [visualSearchSeedPin, setVisualSearchSeedPin] = useState<Pin | null>(
    null,
  );
  const [isAdminUploadOpen, setIsAdminUploadOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [sharingPin, setSharingPin] = useState<Pin | null>(null);
  const [highResPin, setHighResPin] = useState<Pin | null>(null);

  // Floating Toast Alert
  const [activeToast, setActiveToast] = useState<{
    id: string;
    title: string;
    message: string;
  } | null>(null);

  const [deleteConfirmPin, setDeleteConfirmPin] = useState<Pin | null>(null);

  // Only favourite IDs are cached locally; image records always come from MongoDB.
  useEffect(() => {
    localStorage.setItem(
      "edupins_favourite_ids_v1",
      JSON.stringify(favouriteIds),
    );
  }, [favouriteIds]);

  // Toast trigger helper
  const showToast = (title: string, message: string) => {
    const toastId = `toast-${Date.now()}`;
    setActiveToast({ id: toastId, title, message });
    setTimeout(() => {
      setActiveToast((current) => (current?.id === toastId ? null : current));
    }, 3200);
  };

  // Load the gallery exclusively from the database API.
  useEffect(() => {
    let isCurrent = true;

    const fetchPins = async () => {
      setIsPinsLoading(true);
      setPinsLoadError(null);
      try {
        const res = await fetch(apiUrl("/api/pins"));
        const response = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(
            response?.error || "Could not load the image library.",
          );
        }
        if (!Array.isArray(response)) {
          throw new Error(
            "The database returned an invalid image library response.",
          );
        }
        if (!isCurrent) return;

        setPins(
          response.map((pin: Pin) => ({
            ...pin,
            id: pin.id || (pin as any)._id,
            isFavourite: favouriteIds.includes(pin.id || (pin as any)._id),
          })),
        );
      } catch (err) {
        if (!isCurrent) return;
        console.error("Could not load image records from the database:", err);
        setPins([]);
        setPinsLoadError(
          err instanceof Error
            ? err.message
            : "Could not load the image library from the database.",
        );
      } finally {
        if (isCurrent) setIsPinsLoading(false);
      }
    };

    void fetchPins();
    return () => {
      isCurrent = false;
    };
  }, []);

  // Restore Admin Session from token
  useEffect(() => {
    const token = localStorage.getItem("pinspire_admin_token");
    if (!token) return;

    fetch(apiUrl("/api/auth/me"), {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setAuthUser(data.user);
        } else {
          localStorage.removeItem("pinspire_admin_token");
        }
      })
      .catch(() => {
        localStorage.removeItem("pinspire_admin_token");
      });
  }, []);

  const handleAdminLogout = () => {
    localStorage.removeItem("pinspire_admin_token");
    setAuthUser(null);
    showToast("Signed Out", "Admin session has been terminated.");
  };

  const handleDeletePin = async (pinId: string) => {
    if (!authUser || authUser.role !== "admin") {
      showToast("Restricted", "Admin access is required to delete a pin.");
      return;
    }

    const targetPin = pins.find((pin) => pin.id === pinId);
    setDeleteConfirmPin(targetPin || null);
  };

  const confirmDeletePin = async () => {
    if (!deleteConfirmPin || !authUser || authUser.role !== "admin") {
      return;
    }

    try {
      const res = await fetch(apiUrl(`/api/pins/${deleteConfirmPin.id}`), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authUser.token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Could not delete pin.");
      }

      setPins((prev) => prev.filter((pin) => pin.id !== deleteConfirmPin.id));
      setSelectedPinForModal(null);
      setDeleteConfirmPin(null);
      showToast(
        "Pin Deleted",
        "The image was removed from Cloudinary and the library.",
      );
    } catch (error: any) {
      console.error("Delete pin failed:", error);
      setDeleteConfirmPin(null);
      showToast("Delete Failed", error.message || "Unable to delete this pin.");
    }
  };

  // Toggle favourite status
  const handleToggleFavourite = (pinId: string) => {
    const nowFavourited = !pins.find((pin) => pin.id === pinId)?.isFavourite;
    setFavouriteIds((current) =>
      nowFavourited
        ? Array.from(new Set([...current, pinId]))
        : current.filter((id) => id !== pinId),
    );
    setPins((prev) =>
      prev.map((p) => {
        if (p.id === pinId) {
          return {
            ...p,
            isFavourite: nowFavourited,
            savedCount: nowFavourited
              ? p.savedCount + 1
              : Math.max(0, p.savedCount - 1),
          };
        }
        return p;
      }),
    );

    const pin = pins.find((p) => p.id === pinId);
    if (nowFavourited) {
      showToast(
        "Saved to Favourites",
        `"${pin?.title || "Inspiration"}" was added to your collection.`,
      );
    } else {
      showToast(
        "Removed from Favourites",
        `"${pin?.title || "Inspiration"}" removed.`,
      );
    }
  };

  // Clear all favourites
  const handleClearAllFavourites = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all your favourite inspirations?",
      )
    ) {
      setPins((prev) => prev.map((p) => ({ ...p, isFavourite: false })));
      setFavouriteIds([]);
      showToast(
        "Favourites Cleared",
        "All saved inspirations have been cleared.",
      );
    }
  };

  // Add a comment to a pin
  const handleAddComment = async (pinId: string, commentText: string) => {
    const authorName = authUser?.name || "Visitor";
    const authorAvatar =
      authUser?.avatar ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80";

    const optimisticComment = {
      id: `c-${Date.now()}`,
      userName: authorName,
      userAvatar: authorAvatar,
      text: commentText,
      timestamp: "Just now",
    };

    setPins((prev) =>
      prev.map((p) =>
        p.id === pinId
          ? { ...p, comments: [...p.comments, optimisticComment] }
          : p,
      ),
    );

    // Sync to MongoDB
    try {
      await fetch(apiUrl(`/api/pins/${pinId}/comment`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: commentText,
          userName: authorName,
          userAvatar: authorAvatar,
        }),
      });
      showToast("Comment Posted", "Your comment was saved to the inspiration.");
    } catch {
      showToast("Comment Added", "Your comment was posted locally.");
    }
  };

  // Filter Pins
  const matchesDateRange = (pin: Pin) => {
    if (dateRange === "all") return true;

    const createdAt = new Date(pin.createdAt).getTime();
    if (Number.isNaN(createdAt)) return true;

    const now = Date.now();
    const rangeMs = {
      "24h": 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000,
      "30d": 30 * 24 * 60 * 60 * 1000,
      "90d": 90 * 24 * 60 * 60 * 1000,
      "1y": 365 * 24 * 60 * 60 * 1000,
    }[dateRange];

    return now - createdAt <= rangeMs;
  };

  const filteredPins = [...pins]
    .filter((pin) => {
      // Category / Class filter
      if (activeCategory !== "All Classes" && pin.category !== activeCategory) {
        return false;
      }

      // Date filter
      if (!matchesDateRange(pin)) {
        return false;
      }

      // Color filter
      if (
        selectedColorHex &&
        pin.dominantColor?.hex.toLowerCase() !== selectedColorHex.toLowerCase()
      ) {
        const colorMatches = pin.aiAnalysis?.dominantColors?.some(
          (c) => c.hex.toLowerCase() === selectedColorHex.toLowerCase(),
        );
        if (!colorMatches) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = pin.title.toLowerCase().includes(q);
        const inDesc = pin.description.toLowerCase().includes(q);
        const inCategory = pin.category.toLowerCase().includes(q);
        const inTags = pin.tags.some((t) => t.toLowerCase().includes(q));
        const inVibe = pin.aiAnalysis?.aestheticVibe?.toLowerCase().includes(q);
        if (!inTitle && !inDesc && !inCategory && !inTags && !inVibe) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();

      if (Number.isNaN(aTime) || Number.isNaN(bTime)) {
        return 0;
      }

      return sortDirection === "desc" ? bTime - aTime : aTime - bTime;
    });

  const favouritePins = pins.filter((p) => p.isFavourite);

  return (
    <div className="min-h-screen bg-stone-50/50 text-stone-900 font-sans antialiased selection:bg-red-600 selection:text-white pb-16">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        favouriteCount={favouritePins.length}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectTagSuggestion={(tag) => setSearchQuery(tag)}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setCurrentTab("explore");
        }}
        authUser={authUser}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenAdminUpload={() => setIsAdminUploadOpen(true)}
        onLogout={handleAdminLogout}
      />

      {/* Main Viewport Content */}
      <main className="mx-auto w-full min-w-0 max-w-7xl px-4 pt-3 md:px-7">
        {currentTab === "explore" ? (
          <div>
            <div className="mb-5 rounded-[28px] border border-stone-200/80 bg-[linear-gradient(135deg,#f5f5f4_0%,#ffffff_30%,#f2f7f5_100%)] p-2 shadow-[0_10px_30px_rgba(12,20,13,0.06)]">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none">
                  {INITIAL_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        activeCategory === cat
                          ? "bg-gradient-to-r from-emerald-800 to-teal-700 text-white shadow-[0_10px_18px_rgba(6,95,70,0.25)] scale-[1.01] ring-2 ring-emerald-600/20"
                          : "bg-stone-100/90 text-stone-700 hover:bg-stone-200 hover:text-stone-900"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-end">
                  <div className="inline-flex flex-wrap items-center justify-end gap-2 rounded-2xl border border-stone-200 bg-white/90 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                    <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-2 py-1.5">
                      <span className="text-[9px] font-black uppercase tracking-[0.18em] text-stone-500">
                        range
                      </span>
                      <select
                        value={dateRange}
                        onChange={(e) =>
                          setDateRange(e.target.value as typeof dateRange)
                        }
                        className="appearance-none rounded-full border border-stone-200 bg-white px-3 py-1.5 pr-8 text-xs font-semibold text-stone-700 outline-none focus:border-emerald-500"
                      >
                        <option value="all">All time</option>
                        <option value="24h">Last 24h</option>
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                        <option value="1y">Last year</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-2 py-1.5">
                      <span className="text-[9px] font-black uppercase tracking-[0.18em] text-stone-500">
                        order
                      </span>
                      <select
                        value={sortDirection}
                        onChange={(e) =>
                          setSortDirection(
                            e.target.value as typeof sortDirection,
                          )
                        }
                        className="appearance-none rounded-full border border-stone-200 bg-white px-3 py-1.5 pr-8 text-xs font-semibold text-stone-700 outline-none focus:border-emerald-500"
                      >
                        <option value="desc">Newest first</option>
                        <option value="asc">Oldest first</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Active Filters Bar */}
            {(searchQuery ||
              selectedColorHex ||
              activeCategory !== "All Classes" ||
              dateRange !== "all") && (
              <div className="flex items-center flex-wrap gap-2 mb-6 p-2 px-3.5 bg-white rounded-full border border-stone-200/90 text-xs text-stone-600 shadow-xs">
                <span className="font-semibold text-stone-800 flex items-center gap-1.5 pl-1">
                  <Filter className="w-3.5 h-3.5 text-stone-500" />
                  <span>Filters:</span>
                </span>

                {searchQuery && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-800 font-medium">
                    <span>Query: "{searchQuery}"</span>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="hover:text-emerald-700 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedColorHex && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-800 font-medium">
                    <span
                      className="w-3 h-3 rounded-full border border-stone-300"
                      style={{ backgroundColor: selectedColorHex }}
                    />
                    <span>Color: {selectedColorHex}</span>
                    <button
                      onClick={() => setSelectedColorHex(null)}
                      className="hover:text-emerald-700 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {activeCategory !== "All Classes" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Class: {activeCategory}</span>
                    <button
                      onClick={() => setActiveCategory("All Classes")}
                      className="hover:text-stone-900 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {dateRange !== "all" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                    <span>
                      {dateRange === "24h"
                        ? "Last 24 hours"
                        : dateRange === "7d"
                          ? "Last 7 days"
                          : dateRange === "30d"
                            ? "Last 30 days"
                            : dateRange === "90d"
                              ? "Last 90 days"
                              : "Last year"}
                    </span>
                    <button
                      onClick={() => setDateRange("all")}
                      className="hover:text-stone-900 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {sortDirection !== "desc" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 text-violet-800 border border-violet-200 font-bold">
                    <span>Oldest first</span>
                    <button
                      onClick={() => setSortDirection("desc")}
                      className="hover:text-stone-900 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedColorHex(null);
                    setActiveCategory("All Classes");
                    setDateRange("all");
                    setSortDirection("desc");
                  }}
                  className="ml-auto text-xs text-emerald-700 hover:underline font-bold pr-1 cursor-pointer"
                >
                  Clear all
                </button>
              </div>
            )}
            {isPinsLoading ? (
              <div className="py-24 text-center text-sm font-medium text-stone-500">
                Loading the image library from the database...
              </div>
            ) : pinsLoadError ? (
              <div
                role="alert"
                className="mx-auto my-12 max-w-xl rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center"
              >
                <p className="text-sm font-semibold text-rose-800">
                  The image library could not be loaded from the database.
                </p>
                <p className="mt-2 text-xs text-rose-700">{pinsLoadError}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 rounded-full bg-stone-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-black"
                >
                  Retry
                </button>
              </div>
            ) : (
              <MasonryGrid
                pins={filteredPins}
                onSelectPin={(pin) => setSelectedPinForModal(pin)}
                onToggleFavourite={handleToggleFavourite}
                onOpenVisualSearchWithPin={(pin) => {
                  setVisualSearchSeedPin(pin);
                  setIsVisualSearchOpen(true);
                }}
                onOpenShare={(pin) => setSharingPin(pin)}
              />
            )}
          </div>
        ) : (
          <FavouritesView
            favouritePins={favouritePins}
            onSelectPin={(pin) => setSelectedPinForModal(pin)}
            onToggleFavourite={handleToggleFavourite}
            onOpenVisualSearchWithPin={(pin) => {
              setVisualSearchSeedPin(pin);
              setIsVisualSearchOpen(true);
            }}
            onOpenShare={(pin) => setSharingPin(pin)}
            onExplore={() => setCurrentTab("explore")}
            onClearAllFavourites={handleClearAllFavourites}
          />
        )}
      </main>

      {/* Pin Detail Modal */}
      {selectedPinForModal && (
        <PinModal
          pin={selectedPinForModal}
          allPins={pins}
          isAdmin={Boolean(authUser && authUser.role === "admin")}
          onClose={() => setSelectedPinForModal(null)}
          onToggleFavourite={handleToggleFavourite}
          onAddComment={handleAddComment}
          onDeletePin={handleDeletePin}
          onSelectTag={(tag) => {
            setSearchQuery(tag);
            setCurrentTab("explore");
          }}
          onSelectColor={(hex) => {
            setSelectedColorHex(hex);
            setCurrentTab("explore");
          }}
          onSelectPin={(pin) => setSelectedPinForModal(pin)}
          onOpenShare={(pin) => setSharingPin(pin)}
          onViewHighRes={(pin) => setHighResPin(pin)}
        />
      )}

      {/* Admin Image Upload Studio Modal */}
      {isAdminUploadOpen && (
        <AdminUploadModal
          categories={INITIAL_CATEGORIES}
          adminToken={authUser?.token}
          onClose={() => setIsAdminUploadOpen(false)}
          onPublishPin={(newPin) => {
            setPins((prev) => [newPin, ...prev]);
            showToast(
              "Published",
              `"${newPin.title}" added to ${newPin.category}!`,
            );
          }}
          onPublishBatch={(newPins) => {
            setPins((prev) => [...newPins, ...prev]);
            showToast(
              "Batch Upload Successful",
              `${newPins.length} ${newPins.length === 1 ? "image" : "images"} published to the Tos School library.`,
            );
          }}
        />
      )}

      {/* Admin Login Modal */}
      {isAdminLoginOpen && (
        <AdminLoginModal
          onClose={() => setIsAdminLoginOpen(false)}
          onLoginSuccess={(user) => {
            setAuthUser(user);
            showToast(
              "Admin Logged In",
              `Welcome, ${user.name}! You can now upload and curate images.`,
            );
          }}
        />
      )}

      {/* Social Media Sharing Modal */}
      {sharingPin && (
        <ShareModal
          pin={sharingPin}
          onClose={() => setSharingPin(null)}
          onViewHighRes={() => {
            setHighResPin(sharingPin);
            setSharingPin(null);
          }}
        />
      )}

      {/* High-Resolution Machine Viewer & Lightbox */}
      {highResPin && (
        <HighResViewerModal
          pin={highResPin}
          onClose={() => setHighResPin(null)}
          onOpenShare={() => {
            setSharingPin(highResPin);
            setHighResPin(null);
          }}
        />
      )}

      {/* Visual Search Modal */}
      {isVisualSearchOpen && (
        <VisualSearchModal
          initialPin={visualSearchSeedPin}
          allPins={pins}
          onClose={() => {
            setIsVisualSearchOpen(false);
            setVisualSearchSeedPin(null);
          }}
          onSelectPin={(pin) => {
            setSelectedPinForModal(pin);
            setIsVisualSearchOpen(false);
          }}
          onApplySearchQuery={(query) => {
            setSearchQuery(query);
            setCurrentTab("explore");
          }}
        />
      )}

      {deleteConfirmPin && (
        <div className="fixed inset-0 z-[60] bg-stone-900/45 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-[28px] border border-stone-200 bg-white/95 p-6 shadow-[0_30px_80px_rgba(10,10,10,0.25)] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 shadow-inner">
                  <Trash2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-600">
                    Confirm deletion
                  </p>
                  <h3 className="mt-1 text-xl font-black text-stone-900">
                    Remove this pin?
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setDeleteConfirmPin(null)}
                className="rounded-full p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-800 cursor-pointer"
                aria-label="Close delete confirmation"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 rounded-2xl bg-stone-50 border border-stone-200 p-4">
              <p className="text-lg font-medium leading-relaxed text-stone-700">
                Delete{" "}
                <span className="font-bold text-stone-900">
                  "{deleteConfirmPin.title}"
                </span>{" "}
                from Cloudinary and the gallery?
              </p>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmPin(null)}
                className="rounded-full border border-stone-300 bg-white px-6 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-stone-400 hover:bg-stone-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeletePin}
                className="rounded-full bg-gradient-to-r from-red-500 to-red-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-500/30 transition hover:brightness-110 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Activity Toast */}
      {activeToast && (
        <div className="fixed top-20 right-6 z-50 max-w-sm bg-stone-900 text-white rounded-2xl p-4 shadow-2xl border border-stone-800 flex items-start gap-3 animate-in slide-in-from-top-4 duration-300">
          <div className="p-1.5 rounded-xl bg-red-600 text-white shrink-0 mt-0.5">
            <Check className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white">
              {activeToast.title}
            </div>
            <div className="text-[11px] text-stone-300 mt-0.5 leading-snug">
              {activeToast.message}
            </div>
          </div>
          <button
            onClick={() => setActiveToast(null)}
            className="text-stone-400 hover:text-white shrink-0 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
