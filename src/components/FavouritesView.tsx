import React, { useState } from 'react';
import {
  Heart,
  Search,
  Compass,
  X,
} from 'lucide-react';
import { Pin } from '../types';
import { MasonryGrid } from './MasonryGrid';

interface FavouritesViewProps {
  favouritePins: Pin[];
  onSelectPin: (pin: Pin) => void;
  onToggleFavourite: (pinId: string) => void;
  onOpenVisualSearchWithPin?: (pin: Pin) => void;
  onOpenShare?: (pin: Pin) => void;
  onExplore: () => void;
  onClearAllFavourites: () => void;
}

export const FavouritesView: React.FC<FavouritesViewProps> = ({
  favouritePins,
  onSelectPin,
  onToggleFavourite,
  onOpenVisualSearchWithPin,
  onOpenShare,
  onExplore,
  onClearAllFavourites,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Derive unique categories from favourite pins
  const categories = ['All', ...Array.from(new Set(favouritePins.map((p) => p.category)))];

  // Filtered favourites
  const filteredFavourites = favouritePins.filter((pin) => {
    if (selectedCategory !== 'All' && pin.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const inTitle = pin.title.toLowerCase().includes(q);
      const inDesc = pin.description.toLowerCase().includes(q);
      const inTags = pin.tags.some((t) => t.toLowerCase().includes(q));
      if (!inTitle && !inDesc && !inTags) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-stone-200/80">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-[#E60023]">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2.5">
                <span>My Favourites</span>
                <span className="text-sm font-bold px-3 py-1 rounded-full bg-stone-100 text-stone-700">
                  {favouritePins.length}
                </span>
              </h1>
              <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
                Your personal study collection of saved curriculum charts and visual aids.
              </p>
            </div>
          </div>
        </div>

        {/* Search within favourites & Actions */}
        {favouritePins.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="relative w-56 sm:w-64">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search within favourites..."
                className="w-full pl-9 pr-8 py-2 text-xs rounded-full bg-stone-100 hover:bg-stone-200/60 focus:bg-white border border-transparent focus:border-stone-900 focus:outline-none text-stone-900 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <button
              onClick={onClearAllFavourites}
              className="px-3.5 py-2 rounded-full border border-stone-200 text-xs font-semibold text-stone-600 hover:text-[#E60023] hover:border-red-200 hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
              title="Clear all saved favourites"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Category Pills (if more than 1 category exists) */}
      {favouritePins.length > 0 && categories.length > 2 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Empty State */}
      {favouritePins.length === 0 ? (
        <div className="py-24 text-center max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto rounded-full bg-rose-50 flex items-center justify-center text-[#E60023] mb-4">
            <Heart className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h2 className="text-lg font-bold text-stone-900">No favourite inspirations yet</h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 mb-6 leading-relaxed">
            Click the Save button or Heart on any visual pin while browsing to add it to your favourite collection.
          </p>
          <button
            onClick={onExplore}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#E60023] hover:bg-[#b6001c] text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Inspirations</span>
          </button>
        </div>
      ) : filteredFavourites.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-sm text-stone-500">No favourites match your query "{searchQuery}".</p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-[#E60023] font-bold hover:underline mt-2 inline-block cursor-pointer"
          >
            Clear query
          </button>
        </div>
      ) : (
        /* Masonry Grid with ZERO details under images */
        <MasonryGrid
          pins={filteredFavourites}
          onSelectPin={onSelectPin}
          onToggleFavourite={onToggleFavourite}
          onOpenVisualSearchWithPin={onOpenVisualSearchWithPin}
          onOpenShare={onOpenShare}
        />
      )}
    </div>
  );
};
