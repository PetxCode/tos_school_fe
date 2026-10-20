import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Compass,
  Heart,
  X,
  Sparkles,
  Upload,
  ShieldCheck,
  Lock,
  LogOut,
  User,
} from "lucide-react";
import { ViewTab, AuthUser, SCHOOL_CLASSES } from "../types";
import { apiUrl } from "../api";
import { BrandLogo } from "./BrandLogo";
import pix from "../logo.png";

interface NavbarProps {
  currentTab: ViewTab;
  setCurrentTab: (tab: ViewTab) => void;
  favouriteCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectTagSuggestion: (tag: string) => void;
  activeCategory?: string;
  onSelectCategory?: (cat: string) => void;
  authUser: AuthUser | null;
  onOpenAdminLogin: () => void;
  onOpenAdminUpload: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  favouriteCount,
  searchQuery,
  setSearchQuery,
  onSelectTagSuggestion,
  activeCategory,
  onSelectCategory,
  authUser,
  onOpenAdminLogin,
  onOpenAdminUpload,
  onLogout,
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Fetch AI tag suggestions when user types
  useEffect(() => {
    if (!isSearchFocused && !searchQuery) return;

    const timer = setTimeout(async () => {
      setIsLoadingTags(true);
      try {
        const res = await fetch(apiUrl("/api/ai/suggest-tags"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: searchQuery }),
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.suggestions)) {
            setTagSuggestions(data.suggestions);
          }
        }
      } catch (err) {
        console.warn("Tag suggestion error", err);
      } finally {
        setIsLoadingTags(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [searchQuery, isSearchFocused]);

  // Click outside to close menus
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchFocused(false);
      }
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-3 sm:px-4 md:px-7 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-x-3 gap-y-2">
        {/* Brand Logo & Nav Tabs */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-6 shrink-0">
          {/* <BrandLogo
            size="sm"
            showSubtitle={false}
            onClick={() => setCurrentTab("explore")}

          /> */}
          <div className="mr-10 flex flex-col">
            <img className="h-10 object-contain" src={pix} />
            <p className="font-bold -mt-1">Tos School</p>
          </div>

          {/* Nav Tabs: Explore & Favourites */}
          <nav className="flex items-center gap-0.5 sm:gap-1.5">
            <button
              onClick={() => setCurrentTab("explore")}
              className={`flex items-center gap-1 px-2.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                currentTab === "explore"
                  ? "bg-stone-900 text-white shadow-xs"
                  : "text-stone-700 hover:text-stone-900 hover:bg-stone-100"
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Explore</span>
            </button>

            <button
              onClick={() => setCurrentTab("favourites")}
              className={`flex items-center gap-1.5 px-2.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                currentTab === "favourites"
                  ? "bg-stone-900 text-white shadow-xs"
                  : "text-stone-700 hover:text-stone-900 hover:bg-stone-100"
              }`}
            >
              <Heart
                className={`w-4 h-4 ${
                  currentTab === "favourites"
                    ? "fill-[#E60023] text-[#E60023]"
                    : "text-stone-600"
                }`}
              />
              <span>Favourites</span>
              {favouriteCount > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    currentTab === "favourites"
                      ? "bg-[#E60023] text-white"
                      : "bg-rose-100 text-[#E60023]"
                  }`}
                >
                  {favouriteCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Full-Width Search Bar */}
        <div
          ref={searchContainerRef}
          className="relative order-3 basis-full min-w-0 sm:order-none sm:basis-auto flex-1 max-w-2xl mx-0 sm:mx-2"
        >
          <div
            className={`flex items-center transition-all rounded-full px-4 py-2.5 ${
              isSearchFocused
                ? "bg-white ring-2 ring-stone-900 shadow-md"
                : "bg-stone-100 hover:bg-stone-200/70 border border-transparent"
            }`}
          >
            <Search className="w-4 h-4 text-stone-500 mr-2.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search Primary 4, Jun. Sec Sch 1, Sen. Sec Sch 3..."
              className="w-full bg-transparent text-sm text-stone-900 placeholder:text-stone-500 focus:outline-none"
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="p-1 text-stone-500 hover:text-stone-900 rounded-full hover:bg-stone-200 mr-1 cursor-pointer"
                title="Clear query"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Class Filter & AI Tag Suggestions Dropdown */}
          {isSearchFocused && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-stone-200 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Quick Class Filters in Search */}
              <div className="pb-2.5 mb-2.5 border-b border-stone-100">
                <div className="flex items-center justify-between px-1 mb-2">
                  <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#E60023]" />
                    Filter by Class Level
                  </span>
                  <span className="text-[11px] text-stone-500">
                    Pry 4 to SSS 3
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <button
                    onMouseDown={() => {
                      if (onSelectCategory) onSelectCategory("All Classes");
                      setSearchQuery("");
                      setIsSearchFocused(false);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      activeCategory === "All Classes" && !searchQuery
                        ? "bg-stone-900 text-white"
                        : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                    }`}
                  >
                    All Classes
                  </button>
                  {SCHOOL_CLASSES.map((cls) => (
                    <button
                      key={cls}
                      onMouseDown={() => {
                        if (onSelectCategory) onSelectCategory(cls);
                        setSearchQuery("");
                        setIsSearchFocused(false);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeCategory === cls
                          ? "bg-[#E60023] text-white shadow-xs"
                          : "bg-stone-100 text-stone-800 hover:bg-red-50 hover:text-[#E60023]"
                      }`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Tag Suggestions */}
              <div>
                <div className="flex items-center justify-between px-1 mb-1.5">
                  <span className="text-xs font-semibold text-stone-600 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Suggested Learning Topics &amp; Tags
                  </span>
                  {isLoadingTags && (
                    <span className="text-[11px] text-stone-500 animate-pulse">
                      Generating tags...
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-1">
                  {tagSuggestions.length > 0 ? (
                    tagSuggestions.map((tag, idx) => (
                      <button
                        key={idx}
                        onMouseDown={() => {
                          onSelectTagSuggestion(tag);
                          setIsSearchFocused(false);
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs bg-stone-100 hover:bg-stone-900 hover:text-white text-stone-700 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Search className="w-3 h-3 text-stone-400 group-hover:text-white" />
                        <span>{tag}</span>
                      </button>
                    ))
                  ) : (
                    <div className="py-2 text-xs text-stone-500 px-1">
                      Type subject (e.g. "Pry 4", "JSS 2 Math", "SSS 3
                      Chemistry") to search...
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Navigation: Admin Controls & Profile */}
        <div className="ml-auto flex items-center gap-2 shrink-0">
          {/* If Admin is logged in, show direct Upload button */}
          {authUser?.role === "admin" ? (
            <button
              onClick={onOpenAdminUpload}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full bg-stone-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Pin</span>
            </button>
          ) : (
            <button
              onClick={onOpenAdminLogin}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-stone-300 text-stone-700 hover:text-stone-900 hover:border-stone-900 hover:bg-stone-50 text-xs font-semibold transition-colors cursor-pointer"
              title="Admin login to upload to Cloudinary & MongoDB"
            >
              <Lock className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden sm:inline">Admin Login</span>
            </button>
          )}

          {/* Profile Menu */}
          <div
            ref={profileMenuRef}
            className="relative flex items-center shrink-0"
          >
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="w-10 h-10 rounded-full overflow-hidden border border-stone-200 ring-2 ring-stone-100 hover:ring-stone-300 transition-all cursor-pointer focus:outline-none"
              title={
                authUser ? `Signed in as ${authUser.name}` : "Curator Profile"
              }
            >
              <img
                src={
                  authUser?.avatar ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                }
                alt={authUser?.name || "User"}
                className="w-full h-full object-cover"
              />
            </button>

            {/* Profile Dropdown */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 top-12 w-64 bg-white border border-stone-200 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center gap-2.5 p-2 pb-3 border-b border-stone-100">
                  <img
                    src={
                      authUser?.avatar ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                    }
                    alt="User"
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-stone-900 truncate flex items-center gap-1">
                      <span>{authUser?.name || "Visitor"}</span>
                      {authUser?.role === "admin" && (
                        <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                          ADMIN
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-stone-500 truncate">
                      {authUser?.email || "Guest Mode"}
                    </div>
                  </div>
                </div>

                <div className="pt-2 space-y-1">
                  {authUser?.role === "admin" ? (
                    <>
                      <button
                        onClick={() => {
                          onOpenAdminUpload();
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-stone-500" />
                        <span>Upload Curated Pin (Cloudinary)</span>
                      </button>

                      <button
                        onClick={() => {
                          onLogout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out Admin</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        onOpenAdminLogin();
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5 text-stone-500" />
                      <span>Admin Login</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
