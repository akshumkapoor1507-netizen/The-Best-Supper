'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ScanSearch, SlidersHorizontal, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import RecipeCard from '@/components/ui/RecipeCard';
import RecipeModal from '@/components/RecipeModal';
import { useAppStore } from '@/lib/store';
import type { Recipe } from '@/types';

export default function ResultsPage() {
  const router = useRouter();
  const { identifiedIngredients, userPreferences, generatedRecipes, isGenerating, actions } = useAppStore();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    if (identifiedIngredients.length > 0 && generatedRecipes.length === 0 && !isGenerating) {
      generateRecipes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateRecipes = async () => {
    if (identifiedIngredients.length === 0) {
      toast.error('No ingredients found. Please scan your kitchen first.');
      router.push('/scan');
      return;
    }
    actions.setGenerating(true);
    try {
      const response = await fetch('/api/generate-recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: identifiedIngredients, preferences: userPreferences }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Recipe generation failed');
      }
      const data = await response.json();
      actions.setRecipes(data.recipes);
      toast.success(`Generated ${data.recipes.length} recipes!`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast.error(message);
    } finally {
      actions.setGenerating(false);
    }
  };

  if (identifiedIngredients.length === 0 && !isGenerating) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-5xl mb-4">🍳</p>
        <h2 className="font-display text-2xl font-bold text-text mb-2">No ingredients yet</h2>
        <p className="text-text-muted mb-6">Scan your kitchen first to get personalised recipes</p>
        <button onClick={() => router.push('/scan')} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-white font-semibold hover:shadow-lg transition-all cursor-pointer">
          <ScanSearch size={20} /> Scan My Kitchen
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-text mb-1">Your Recipes</h1>
          <p className="text-text-muted">Personalised for your kitchen and taste</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => router.push('/preferences')} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-surface text-text font-medium text-sm hover:border-primary/50 transition-all min-h-[44px] cursor-pointer">
            <SlidersHorizontal size={16} /> Filters
          </button>
          <button onClick={() => router.push('/scan')} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-surface text-text font-medium text-sm hover:border-primary/50 transition-all min-h-[44px] cursor-pointer">
            <ScanSearch size={16} /> Scan Again
          </button>
        </div>
      </motion.div>

      {isGenerating && (
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-3 py-8">
            <Loader2 size={24} className="animate-spin text-primary" />
            <p className="text-lg text-text-muted font-medium">Your personal chef is thinking... 👨‍🍳</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-surface border border-border rounded-3xl overflow-hidden">
                <div className="h-2 skeleton" />
                <div className="p-5 space-y-3">
                  <div className="skeleton h-6 w-3/4 rounded" />
                  <div className="skeleton h-4 w-1/2 rounded" />
                  <div className="flex gap-2"><div className="skeleton h-6 w-16 rounded-full" /><div className="skeleton h-6 w-20 rounded-full" /><div className="skeleton h-6 w-14 rounded-full" /></div>
                  <div className="skeleton h-16 rounded" />
                  <div className="skeleton h-10 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isGenerating && generatedRecipes.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generatedRecipes.map((recipe, index) => (
              <RecipeCard key={recipe.id} recipe={recipe} onOpen={setSelectedRecipe} index={index} />
            ))}
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center mt-8">
            <button onClick={generateRecipes} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-border text-text font-medium hover:border-primary/50 transition-all cursor-pointer">
              🔄 Generate Different Recipes
            </button>
          </motion.div>
        </>
      )}

      {selectedRecipe && <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />}
    </div>
  );
}
