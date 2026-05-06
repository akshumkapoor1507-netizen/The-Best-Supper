'use client';

import type { NutritionInfo } from '@/types';

interface NutritionBadgeProps {
  nutrition: NutritionInfo;
  servings?: number;
  baseServings?: number;
}

export default function NutritionBadge({ nutrition, servings, baseServings }: NutritionBadgeProps) {
  const scale = servings && baseServings ? servings / baseServings : 1;

  const items = [
    { label: 'Cal', value: Math.round(nutrition.calories * scale), unit: '' },
    { label: 'Pro', value: Math.round(nutrition.protein_g * scale), unit: 'g' },
    { label: 'Carb', value: Math.round(nutrition.carbs_g * scale), unit: 'g' },
    { label: 'Fat', value: Math.round(nutrition.fat_g * scale), unit: 'g' },
    { label: 'Fibre', value: Math.round(nutrition.fibre_g * scale), unit: 'g' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col items-center px-3 py-2 rounded-xl bg-surface border border-border min-w-[56px]"
        >
          <span className="text-xs text-text-muted font-medium">{item.label}</span>
          <span className="text-sm font-mono font-bold text-text">
            {item.value}{item.unit}
          </span>
        </div>
      ))}
    </div>
  );
}
