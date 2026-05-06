'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bookmark, ChefHat } from 'lucide-react';
import toast from 'react-hot-toast';
import StepCard from '@/components/ui/StepCard';
import NutritionBadge from '@/components/ui/NutritionBadge';
import ServingStepper from '@/components/ui/ServingStepper';
import { useAppStore } from '@/lib/store';
import type { Recipe } from '@/types';

interface RecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
}

function scaleQuantity(quantity: string, baseServings: number, newServings: number): string {
  const num = parseFloat(quantity);
  if (isNaN(num)) return quantity;
  const scaled = (num * newServings) / baseServings;
  return parseFloat(scaled.toFixed(1)).toString();
}

export default function RecipeModal({ recipe, onClose }: RecipeModalProps) {
  const { actions } = useAppStore();
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [modalServings, setModalServings] = useState(recipe?.servings ?? 2);
  const [cookMode, setCookMode] = useState(false);

  const toggleStep = (step: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      next.has(step) ? next.delete(step) : next.add(step);
      return next;
    });
  };

  const handleSave = () => {
    if (recipe) {
      actions.saveRecipe(recipe);
      toast.success('Recipe saved!');
    }
  };

  if (!recipe) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full md:max-w-2xl md:mx-4 max-h-[90vh] bg-bg rounded-t-3xl md:rounded-3xl border border-border overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-bg border-b border-border px-6 py-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-text truncate pr-4">{recipe.name}</h2>
            <div className="flex items-center gap-2">
              <button onClick={handleSave} className="p-2 rounded-xl hover:bg-surface transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Save recipe">
                <Bookmark size={20} className="text-text-muted hover:text-primary" />
              </button>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-surface transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Close">
                <X size={20} className="text-text-muted" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="overflow-y-auto flex-1 px-6 py-6 space-y-6">
            {cookMode ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold text-text flex items-center gap-2">
                    <ChefHat size={20} className="text-primary" /> Cook Mode
                  </h3>
                  <button onClick={() => setCookMode(false)} className="text-sm text-primary font-medium cursor-pointer">Exit Cook Mode</button>
                </div>
                <p className="text-sm text-text-muted">{completedSteps.size} of {recipe.instructions.length} steps completed</p>
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <motion.div className="h-full gradient-primary" animate={{ width: `${(completedSteps.size / recipe.instructions.length) * 100}%` }} />
                </div>
                {recipe.instructions.map((inst) => (
                  <StepCard key={inst.step} step={inst.step} title={inst.title} detail={inst.detail} completed={completedSteps.has(inst.step)} onToggle={() => toggleStep(inst.step)} />
                ))}
              </div>
            ) : (
              <>
                <div>
                  <p className="text-primary italic font-medium mb-2">{recipe.tagline}</p>
                  <p className="text-text-muted leading-relaxed">{recipe.description}</p>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
                  <p className="text-sm"><span className="font-semibold text-primary">👨‍🍳 Chef&apos;s Tip: </span><span className="text-text-muted">{recipe.chef_tip}</span></p>
                </div>

                <div>
                  <h3 className="font-semibold text-text mb-3">Adjust Servings</h3>
                  <ServingStepper value={modalServings} onChange={setModalServings} />
                </div>

                <div>
                  <h3 className="font-semibold text-text mb-3">Ingredients</h3>
                  <div className="space-y-2">
                    {recipe.ingredients_available.map((ing) => (
                      <div key={ing.name} className="flex items-center gap-2 py-1.5">
                        <span className="text-success font-bold text-sm">✓</span>
                        <span className="text-text"><span className="font-mono text-sm font-medium">{scaleQuantity(ing.quantity, recipe.servings, modalServings)}{ing.unit ? ` ${ing.unit}` : ''}</span> {ing.name}</span>
                      </div>
                    ))}
                    {recipe.ingredients_needed.map((ing) => (
                      <div key={ing.name} className="flex items-center gap-2 py-1.5">
                        <span className="text-text-muted text-sm">🛒</span>
                        <span className="text-text-muted"><span className="font-mono text-sm font-medium">{scaleQuantity(ing.quantity, recipe.servings, modalServings)}{ing.unit ? ` ${ing.unit}` : ''}</span> {ing.name}{ing.optional && <span className="text-xs ml-1 opacity-60">(optional)</span>}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-text mb-3">Instructions</h3>
                  <div className="space-y-2">
                    {recipe.instructions.map((inst) => (
                      <StepCard key={inst.step} step={inst.step} title={inst.title} detail={inst.detail} completed={completedSteps.has(inst.step)} onToggle={() => toggleStep(inst.step)} />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-text mb-3">Nutrition per Serving</h3>
                  <NutritionBadge nutrition={recipe.nutrition_per_serving} servings={modalServings} baseServings={recipe.servings} />
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-bg border-t border-border px-6 py-4 flex gap-3">
            <button onClick={handleSave} className="flex-1 py-3 rounded-xl border-2 border-border bg-surface text-text font-medium hover:border-primary/50 transition-all min-h-[48px] cursor-pointer flex items-center justify-center gap-2">
              <Bookmark size={18} /> Save Recipe
            </button>
            <button onClick={() => setCookMode(!cookMode)} className="flex-1 py-3 rounded-xl gradient-primary text-white font-semibold shadow-lg shadow-primary/20 transition-all min-h-[48px] cursor-pointer flex items-center justify-center gap-2">
              <ChefHat size={18} /> {cookMode ? 'View Details' : 'Cook Mode'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
