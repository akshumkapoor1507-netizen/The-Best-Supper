'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Trash2, ScanSearch } from 'lucide-react';
import toast from 'react-hot-toast';
import RecipeCard from '@/components/ui/RecipeCard';
import RecipeModal from '@/components/RecipeModal';
import { useAppStore } from '@/lib/store';
import type { Recipe } from '@/types';

export default function SavedPage() {
  const router = useRouter();
  const { savedRecipes, actions } = useAppStore();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="skeleton h-8 w-48 mx-auto rounded mb-4" />
          <div className="skeleton h-4 w-64 mx-auto rounded" />
        </div>
      </div>
    );
  }

  const allTags = Array.from(
    new Set(savedRecipes.flatMap((r) => [...r.health_tags, ...r.occasion_tags]))
  );

  const filteredRecipes = filterTag
    ? savedRecipes.filter(
        (r) => r.health_tags.includes(filterTag) || r.occasion_tags.includes(filterTag)
      )
    : savedRecipes;

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    actions.removeSavedRecipe(id);
    toast.success('Recipe removed');
  };

  // Empty state
  if (savedRecipes.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* SVG illustration */}
          <div className="mb-6">
            <svg
              width="200"
              height="200"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto"
            >
              <circle cx="100" cy="100" r="80" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="2" />
              <path d="M70 110 C70 80 130 80 130 110" stroke="var(--color-text-muted)" strokeWidth="3" strokeLinecap="round" fill="none" />
              <circle cx="80" cy="90" r="4" fill="var(--color-text-muted)" />
              <circle cx="120" cy="90" r="4" fill="var(--color-text-muted)" />
              <text x="100" y="145" textAnchor="middle" fontSize="40">🍽️</text>
            </svg>
          </div>
          <h2 className="font-display text-2xl font-bold text-text mb-2">
            No saved recipes yet
          </h2>
          <p className="text-text-muted mb-6">
            Let&apos;s cook something! Scan your kitchen to get started.
          </p>
          <button
            onClick={() => router.push('/scan')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-white font-semibold
                       hover:shadow-lg transition-all cursor-pointer"
          >
            <ScanSearch size={20} />
            Scan My Kitchen
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-text mb-2">
          Saved Recipes
        </h1>
        <p className="text-text-muted">
          {savedRecipes.length} recipe{savedRecipes.length !== 1 ? 's' : ''} saved
        </p>
      </motion.div>

      {/* Filter tags */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilterTag(null)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
              !filterTag
                ? 'gradient-primary text-white'
                : 'bg-surface border border-border text-text-muted hover:border-primary/40'
            }`}
          >
            All
          </button>
          {allTags.slice(0, 10).map((tag) => (
            <button
              key={tag}
              onClick={() => setFilterTag(filterTag === tag ? null : tag)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                filterTag === tag
                  ? 'gradient-primary text-white'
                  : 'bg-surface border border-border text-text-muted hover:border-primary/40'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Recipe grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe, index) => (
          <div key={recipe.id} className="relative group">
            <RecipeCard recipe={recipe} onOpen={setSelectedRecipe} index={index} />
            <button
              onClick={(e) => handleRemove(recipe.id, e)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-500/80 text-white
                         flex items-center justify-center opacity-0 group-hover:opacity-100
                         transition-opacity hover:bg-red-600 cursor-pointer z-10"
              aria-label="Remove saved recipe"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {selectedRecipe && (
        <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
      )}
    </div>
  );
}
