'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  mockArtworks,
  mockCategories,
  standardFramingOptions,
} from '@/lib/mock-data';
import { Artwork, ArtworkMedium, ArtworkStyle } from '@/types';
import { formatINR } from '@/lib/utils';
import { useCart } from '@/lib/cart-context';
import { RoomVisualizer } from '@/components/artwork/RoomVisualizer';
import { STYLE_CLASSES } from '@/constants';
import {
  Search,
  SlidersHorizontal,
  X,
  Eye,
  ShoppingBag,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

export default function ArtworksPage() {
  const { addItem, openCart } = useCart();
  const [visualizerArtwork, setVisualizerArtwork] = useState<Artwork | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedMedium, setSelectedMedium] = useState<string>('ALL');
  const [selectedStyle, setSelectedStyle] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL'); // 'ALL' | 'ORIGINAL' | 'PRINT'
  const [priceRange, setPriceRange] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Filter options
  const mediums: string[] = [
    'Oil on Canvas',
    'Acrylic on Canvas',
    'Charcoal & Graphite',
    'Watercolor on Arches Paper',
    'Gouache & Gold Leaf',
    'Digital Mixed Media',
  ];

  const styles: string[] = [
    'Contemporary',
    'Abstract Expressionism',
    'Realism',
    'Indian Folk & Heritage',
    'Minimalism',
    'Surrealism',
  ];

  const filteredArtworks = useMemo(() => {
    return mockArtworks.filter(artwork => {
      // Category filter
      if (selectedCategory !== 'ALL' && artwork.categoryId !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = artwork.title.toLowerCase().includes(q);
        const matchesArtist = artwork.artistName.toLowerCase().includes(q);
        const matchesMedium = artwork.medium.toLowerCase().includes(q);
        if (!matchesTitle && !matchesArtist && !matchesMedium) return false;
      }

      // Medium filter
      if (selectedMedium !== 'ALL' && artwork.medium !== selectedMedium) {
        return false;
      }

      // Style filter
      if (selectedStyle !== 'ALL' && artwork.style !== selectedStyle) {
        return false;
      }

      // Type filter
      if (selectedType === 'ORIGINAL' && !artwork.isOriginalAvailable) {
        return false;
      }
      if (selectedType === 'PRINT' && !artwork.minPrintPrice) {
        return false;
      }

      // Price filter (based on starting variant price)
      const basePrice = artwork.originalPrice;
      if (priceRange === 'under-25k' && basePrice > 25000) return false;
      if (priceRange === '25k-50k' && (basePrice < 25000 || basePrice > 50000)) return false;
      if (priceRange === '50k-100k' && (basePrice < 50000 || basePrice > 100000)) return false;
      if (priceRange === 'above-100k' && basePrice < 100000) return false;

      return true;
    }).sort((a, b) => {
      const priceA = a.originalPrice;
      const priceB = b.originalPrice;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'newest') return b.year - a.year;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [searchQuery, selectedCategory, selectedMedium, selectedStyle, selectedType, priceRange, sortBy]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedMedium('ALL');
    setSelectedStyle('ALL');
    setSelectedType('ALL');
    setPriceRange('ALL');
    setSortBy('featured');
  };

  return (
    <div className={STYLE_CLASSES.layout.pageContainer + " py-10 space-y-8"}>
      {/* Page Header */}
      <div className={STYLE_CLASSES.layout.pageHeader}>
        <span className={STYLE_CLASSES.typography.eyebrow}>Catalog Archive</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mt-1">
          Explore Fine Artworks &amp; Original Masterpieces
        </h1>
        <p className={STYLE_CLASSES.typography.sectionSubtitle}>
          Filter through 1-of-1 paintings, limited edition cotton-rag prints, and fine charcoal sketches.
          Every piece is accompanied by a tamper-proof digital Certificate of Authenticity.
        </p>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => {
            setSelectedCategory('ALL');
            setSelectedMedium('ALL');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            selectedCategory === 'ALL'
              ? 'bg-foreground text-background shadow-xs'
              : 'bg-card border border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          All Pieces ({mockArtworks.length})
        </button>

        {mockCategories.map(cat => {
          const count = mockArtworks.filter(a => a.categoryId === cat.id).length;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setSelectedMedium('ALL');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-primary dark:bg-purple-600 text-white shadow-xs'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              <span>{cat.name}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isSelected ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Top Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by title, artist, or medium..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40 dark:focus:ring-purple-500/40 transition placeholder:text-muted-foreground"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="md:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border text-sm font-semibold text-foreground hover:bg-muted"
          >
            <SlidersHorizontal className="w-4 h-4 text-primary dark:text-purple-400" />
            Filters
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="px-3.5 py-2.5 rounded-xl bg-card border border-border text-xs font-semibold text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40 dark:focus:ring-purple-500/40"
            >
              <option value="featured">Curator’s Picks</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Year: Newest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout (Sidebar Filters + Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside
          className={`lg:block ${
            isMobileFiltersOpen ? 'block' : 'hidden'
          } space-y-6 bg-card dark:bg-card/80 border border-border dark:border-purple-900/30 rounded-2xl p-6 h-fit shadow-xs`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="font-serif font-bold text-base text-foreground flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-primary dark:text-purple-400" />
              Filter By
            </h3>
            <button
              onClick={clearAllFilters}
              className="text-xs text-primary dark:text-purple-400 font-semibold hover:underline"
            >
              Reset
            </button>
          </div>

          {/* Format / Type Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Artwork Edition Type
            </label>
            <div className="space-y-1.5 text-xs">
              {[
                { label: 'All Editions', value: 'ALL' },
                { label: '1-of-1 Unique Originals', value: 'ORIGINAL' },
                { label: 'Limited Edition Prints', value: 'PRINT' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedType(opt.value)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg transition ${
                    selectedType === opt.value
                      ? 'bg-primary dark:bg-purple-600 text-primary-foreground font-semibold shadow-xs'
                      : 'text-foreground hover:bg-muted dark:hover:bg-purple-950/30'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Medium Filter */}
          <div className="space-y-2 pt-2 border-t border-border">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Medium &amp; Technique
            </label>
            <div className="space-y-1.5 text-xs">
              <button
                onClick={() => setSelectedMedium('ALL')}
                className={`w-full text-left px-3 py-1.5 rounded-lg transition ${
                  selectedMedium === 'ALL'
                    ? 'bg-primary dark:bg-purple-600 text-primary-foreground font-semibold shadow-xs'
                    : 'text-foreground hover:bg-muted dark:hover:bg-purple-950/30'
                }`}
              >
                All Mediums
              </button>
              {mediums.map(m => (
                <button
                  key={m}
                  onClick={() => setSelectedMedium(m)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg transition ${
                    selectedMedium === m
                      ? 'bg-primary dark:bg-purple-600 text-primary-foreground font-semibold shadow-xs'
                      : 'text-foreground hover:bg-muted dark:hover:bg-purple-950/30'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Style Filter */}
          <div className="space-y-2 pt-2 border-t border-border">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Artistic Style
            </label>
            <div className="space-y-1.5 text-xs">
              <button
                onClick={() => setSelectedStyle('ALL')}
                className={`w-full text-left px-3 py-1.5 rounded-lg transition ${
                  selectedStyle === 'ALL'
                    ? 'bg-primary dark:bg-purple-600 text-primary-foreground font-semibold shadow-xs'
                    : 'text-foreground hover:bg-muted dark:hover:bg-purple-950/30'
                }`}
              >
                All Styles
              </button>
              {styles.map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedStyle(s)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg transition ${
                    selectedStyle === s
                      ? 'bg-primary dark:bg-purple-600 text-primary-foreground font-semibold shadow-xs'
                      : 'text-foreground hover:bg-muted dark:hover:bg-purple-950/30'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2 pt-2 border-t border-border">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Price Range (INR)
            </label>
            <div className="space-y-1.5 text-xs">
              {[
                { label: 'Any Price', value: 'ALL' },
                { label: 'Under ₹25,000', value: 'under-25k' },
                { label: '₹25,000 – ₹50,000', value: '25k-50k' },
                { label: '₹50,000 – ₹1,00,000', value: '50k-100k' },
                { label: 'Above ₹1,00,000', value: 'above-100k' },
              ].map(p => (
                <button
                  key={p.value}
                  onClick={() => setPriceRange(p.value)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg transition ${
                    priceRange === p.value
                      ? 'bg-primary dark:bg-purple-600 text-primary-foreground font-semibold shadow-xs'
                      : 'text-foreground hover:bg-muted dark:hover:bg-purple-950/30'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Artworks Grid */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Showing {filteredArtworks.length} of {mockArtworks.length} artworks</span>
            {(selectedMedium !== 'ALL' || selectedStyle !== 'ALL' || selectedType !== 'ALL' || priceRange !== 'ALL' || searchQuery) && (
              <button
                onClick={clearAllFilters}
                className="text-primary dark:text-purple-400 font-bold hover:underline"
              >
                Clear all active filters
              </button>
            )}
          </div>

          {filteredArtworks.length === 0 ? (
            <div className="bg-card dark:bg-card/70 border border-border dark:border-purple-900/30 rounded-2xl p-12 text-center space-y-4">
              <Sparkles className="w-10 h-10 text-muted-foreground mx-auto stroke-1" />
              <h3 className="font-serif text-lg font-bold text-foreground">No artworks match your criteria</h3>
              <p className={STYLE_CLASSES.typography.bodySmall + " max-w-sm mx-auto"}>
                Try clearing or loosening your filters, or search for another artist or medium.
              </p>
              <button
                onClick={clearAllFilters}
                className={STYLE_CLASSES.buttons.primary + " mx-auto"}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArtworks.map(artwork => {
                const originalVariant = artwork.variants.find(v => v.type === 'ORIGINAL') || artwork.variants[0];

                return (
                  <div
                    key={artwork.id}
                    className={STYLE_CLASSES.cards.interactive}
                  >
                    {/* Artwork Image */}
                    <div className="relative aspect-4/5 overflow-hidden bg-muted">
                      <Link href={`/artworks/${artwork.id}`} className="block w-full h-full">
                        <img
                          src={artwork.images[0]}
                          alt={artwork.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      </Link>

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        {artwork.isOriginalAvailable && (
                          <span className={STYLE_CLASSES.badges.originalGold}>
                            1-of-1 Original
                          </span>
                        )}
                        {artwork.minPrintPrice && (
                          <span className={STYLE_CLASSES.badges.printPurple}>
                            Limited Edition
                          </span>
                        )}
                      </div>

                      {/* View in Room Quick Icon */}
                      <button
                        onClick={() => setVisualizerArtwork(artwork)}
                        className="absolute bottom-3 right-3 p-2 rounded-xl bg-card/90 text-foreground hover:bg-card hover:text-primary dark:hover:text-purple-400 transition shadow-md backdrop-blur-md border border-border/80"
                        title="Preview on your wall"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Meta info */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                          <span className="truncate max-w-[130px]">{artwork.medium}</span>
                          <span>
                            {originalVariant.dimensions.heightCm}&times;{originalVariant.dimensions.widthCm}cm
                          </span>
                        </div>

                        <Link href={`/artworks/${artwork.id}`}>
                          <h3 className={STYLE_CLASSES.typography.cardTitle + " text-base line-clamp-1"}>
                            {artwork.title}
                          </h3>
                        </Link>

                        <Link
                          href={`/artists/${artwork.artistId}`}
                          className="text-xs text-muted-foreground hover:text-foreground transition inline-block mt-0.5"
                        >
                          {artwork.artistName} &bull; {artwork.artistLocation}
                        </Link>
                      </div>

                      {/* Price & Action */}
                      <div className="pt-2 border-t border-border/70 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-muted-foreground">Original from</p>
                          <p className="font-serif text-base font-bold text-foreground">
                            {formatINR(artwork.originalPrice)}
                          </p>
                          {artwork.minPrintPrice && (
                            <p className="text-[10px] text-muted-foreground">
                              Prints from {formatINR(artwork.minPrintPrice)}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            addItem(artwork, originalVariant, standardFramingOptions[0]);
                            openCart();
                          }}
                          className={STYLE_CLASSES.buttons.primary + " px-3 py-1.5 text-xs"}
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          Acquire
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Room Visualizer Modal */}
      {visualizerArtwork && (
        <RoomVisualizer
          artwork={visualizerArtwork}
          selectedFraming={standardFramingOptions[0]}
          isOpen={!!visualizerArtwork}
          onClose={() => setVisualizerArtwork(null)}
        />
      )}
    </div>
  );
}
