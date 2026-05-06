'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Plus, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ImageUploadZone from '@/components/ui/ImageUploadZone';
import IngredientTag from '@/components/ui/IngredientTag';
import { useAppStore } from '@/lib/store';
import type { Ingredient, IngredientCategory } from '@/types';

const loadingMessages = [
  'Peering into your kitchen... 👀',
  'Spotting the good stuff... 🔍',
  'Checking every shelf... 🗄️',
  'Identifying ingredients... 🥕',
  'Almost done... 🍳',
];

function ScanPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') || 'upload';

  const {
    uploadedImages,
    identifiedIngredients,
    isAnalysing,
    actions,
  } = useAppStore();

  const [newIngredient, setNewIngredient] = useState('');
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [hasAnalysed, setHasAnalysed] = useState(false);

  // Cycle loading messages
  useEffect(() => {
    if (!isAnalysing) return;
    const interval = setInterval(() => {
      setLoadingMsgIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isAnalysing]);

  const handleAnalyse = async () => {
    if (uploadedImages.length === 0) {
      toast.error('Please upload at least one image first');
      return;
    }

    actions.setAnalysing(true);
    setLoadingMsgIndex(0);

    try {
      const response = await fetch('/api/analyse-kitchen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrls: uploadedImages }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Analysis failed');
      }

      const data = await response.json();
      actions.setIngredients(data.ingredients);
      setHasAnalysed(true);
      toast.success(`Found ${data.ingredients.length} ingredients!`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast.error(message);
    } finally {
      actions.setAnalysing(false);
    }
  };

  const handleAddIngredient = () => {
    if (!newIngredient.trim()) return;
    const ingredient: Ingredient = {
      name: newIngredient.trim(),
      category: 'other' as IngredientCategory,
      estimated_quantity: null,
      confidence: 'high',
    };
    actions.addIngredient(ingredient);
    setNewIngredient('');
    toast.success(`Added "${ingredient.name}"`);
  };

  const handleProceed = () => {
    if (identifiedIngredients.length === 0) {
      toast.error('No ingredients found. Analyse your kitchen first!');
      return;
    }
    router.push('/preferences');
  };

  // Group ingredients by category
  const groupedIngredients = identifiedIngredients.reduce((acc, ingredient) => {
    const cat = ingredient.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(ingredient);
    return acc;
  }, {} as Record<string, Ingredient[]>);

  const categoryLabels: Record<string, string> = {
    protein: '🥩 Proteins',
    vegetable: '🥬 Vegetables',
    fruit: '🍎 Fruits',
    grain: '🌾 Grains',
    dairy: '🧀 Dairy',
    fat: '🫒 Fats & Oils',
    spice: '🌶️ Spices',
    condiment: '🥫 Condiments',
    other: '📦 Other',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-text mb-2">
          Kitchen Scanner
        </h1>
        <p className="text-text-muted">
          Upload photos of your fridge, pantry, or countertop
        </p>
      </motion.div>

      {/* Upload Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <ImageUploadZone
          images={uploadedImages}
          onImagesChange={(images) => actions.setImages(images)}
          initialMode={initialMode as 'upload' | 'camera'}
        />
      </motion.div>

      {/* Analyse Button */}
      {!hasAnalysed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <button
            onClick={handleAnalyse}
            disabled={uploadedImages.length === 0 || isAnalysing}
            className="w-full py-4 rounded-2xl gradient-primary text-white font-semibold text-lg
                       shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30
                       transition-all disabled:opacity-50 disabled:cursor-not-allowed
                       min-h-[56px] cursor-pointer flex items-center justify-center gap-2"
          >
            {isAnalysing ? (
              <>
                <Loader2 size={22} className="animate-spin" />
                {loadingMessages[loadingMsgIndex]}
              </>
            ) : (
              <>
                Analyse My Kitchen
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </motion.div>
      )}

      {/* Analysing Loading State */}
      <AnimatePresence>
        {isAnalysing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton h-10 rounded-full" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {hasAnalysed && identifiedIngredients.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Category groups */}
            <div className="bg-surface border border-border rounded-3xl p-6">
              <h2 className="font-display text-xl font-bold text-text mb-4">
                Found {identifiedIngredients.length} Ingredients
              </h2>

              <div className="space-y-4">
                {Object.entries(groupedIngredients).map(([category, items]) => (
                  <div key={category}>
                    <h3 className="text-sm font-medium text-text-muted mb-2">
                      {categoryLabels[category] || category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {items.map((ingredient) => (
                        <IngredientTag
                          key={ingredient.name}
                          name={ingredient.name}
                          category={ingredient.category}
                          onRemove={() => actions.removeIngredient(ingredient.name)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add manually */}
            <div className="bg-surface border border-border rounded-3xl p-6">
              <h3 className="font-semibold text-text mb-3">Missing something?</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddIngredient()}
                  placeholder="Add an ingredient..."
                  className="flex-1 px-4 py-3 rounded-xl border border-border bg-bg text-text
                             placeholder:text-text-muted/50 focus:outline-none focus:border-primary
                             transition-colors min-h-[44px]"
                />
                <button
                  onClick={handleAddIngredient}
                  disabled={!newIngredient.trim()}
                  className="px-4 py-3 rounded-xl gradient-primary text-white font-medium
                             disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
                             min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {/* Re-analyse and Proceed */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setHasAnalysed(false);
                  actions.setIngredients([]);
                }}
                className="flex-1 py-3.5 rounded-xl border-2 border-border bg-surface text-text font-medium
                           hover:border-primary/50 transition-all min-h-[48px] cursor-pointer"
              >
                Re-analyse
              </button>
              <button
                onClick={handleProceed}
                className="flex-1 py-3.5 rounded-xl gradient-primary text-white font-semibold
                           shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30
                           transition-all min-h-[48px] cursor-pointer flex items-center justify-center gap-2"
              >
                Set My Preferences
                <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No results state */}
      {hasAnalysed && identifiedIngredients.length === 0 && !isAnalysing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-4xl mb-3">🤔</p>
          <p className="text-text-muted">
            No ingredients found. Try uploading clearer photos of your kitchen.
          </p>
          <button
            onClick={() => setHasAnalysed(false)}
            className="mt-4 px-6 py-2.5 rounded-xl border border-border text-text font-medium
                       hover:border-primary/50 transition-all cursor-pointer"
          >
            Try Again
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default function ScanPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    }>
      <ScanPageContent />
    </Suspense>
  );
}
