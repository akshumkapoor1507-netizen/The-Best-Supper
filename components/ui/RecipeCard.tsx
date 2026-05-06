'use client';

import { motion } from 'framer-motion';
import { Clock, ChefHat, Users } from 'lucide-react';
import type { Recipe } from '@/types';

interface RecipeCardProps {
  recipe: Recipe;
  onOpen: (recipe: Recipe) => void;
  index?: number;
}

const difficultyColors: Record<string, string> = {
  easy: 'bg-success/20 text-success',
  medium: 'bg-secondary/20 text-secondary',
  hard: 'bg-primary/20 text-primary',
  expert: 'bg-red-500/20 text-red-500',
};

export default function RecipeCard({ recipe, onOpen, index = 0 }: RecipeCardProps) {
  const totalTime = recipe.prep_time_minutes + recipe.cook_time_minutes;
  const availableCount = recipe.ingredients_available.length;
  const neededCount = recipe.ingredients_needed.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: 'easeOut' }}
      className="group bg-surface border border-border rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 flex flex-col"
    >
      {/* Header gradient bar */}
      <div className="h-2 gradient-primary" />

      <div className="p-5 flex flex-col flex-1">
        {/* Title and badges */}
        <div className="mb-3">
          <h3 className="font-display text-xl font-bold text-text leading-tight mb-1">
            {recipe.name}
          </h3>
          <p className="text-sm text-primary font-medium italic">{recipe.tagline}</p>
        </div>

        {/* Meta badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="inline-flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded-full bg-surface border border-border text-text-muted">
            <Clock size={12} />
            {totalTime} min
          </span>
          <span className={`inline-flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded-full ${difficultyColors[recipe.difficulty]}`}>
            <ChefHat size={12} />
            {recipe.difficulty}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded-full bg-surface border border-border text-text-muted">
            <Users size={12} />
            {recipe.servings}
          </span>
        </div>

        {/* Health tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {recipe.health_tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-success/15 text-deep font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="text-sm text-text-muted leading-relaxed mb-4 flex-1">
          {recipe.description}
        </p>

        {/* Ingredient summary */}
        <div className="text-xs space-y-1 mb-4">
          <p className="text-success font-medium">
            ✓ {availableCount} ingredient{availableCount !== 1 ? 's' : ''} you have
          </p>
          {neededCount > 0 && (
            <p className="text-text-muted">
              🛒 {neededCount} more to buy
            </p>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={() => onOpen(recipe)}
          className="w-full py-3 rounded-xl gradient-primary text-white font-semibold text-sm
                     hover:shadow-lg hover:shadow-primary/30 transition-all duration-200
                     active:scale-[0.98] cursor-pointer min-h-[44px]"
        >
          View Full Recipe →
        </button>
      </div>
    </motion.div>
  );
}
