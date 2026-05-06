'use client';

import { X } from 'lucide-react';
import type { IngredientCategory } from '@/types';

interface IngredientTagProps {
  name: string;
  category: IngredientCategory;
  onRemove?: () => void;
}

export default function IngredientTag({ name, category, onRemove }: IngredientTagProps) {
  return (
    <span
      className={`chip-${category} inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium font-mono transition-all duration-200 hover:scale-105`}
    >
      {name}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-0.5 p-0.5 rounded-full hover:bg-black/10 transition-colors"
          aria-label={`Remove ${name}`}
        >
          <X size={14} />
        </button>
      )}
    </span>
  );
}
