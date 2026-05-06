'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import FilterCard from '@/components/ui/FilterCard';
import ServingStepper from '@/components/ui/ServingStepper';
import { useAppStore } from '@/lib/store';
import type {
  HealthGoal,
  MealComplexity,
  Occasion,
  DietaryRestriction,
  MealFormat,
} from '@/types';

const healthGoals: { value: HealthGoal; icon: string; label: string }[] = [
  { value: 'healthy', icon: '🥗', label: 'Healthy & Balanced' },
  { value: 'high-protein', icon: '💪', label: 'High Protein' },
  { value: 'keto', icon: '🥑', label: 'High Fat / Keto' },
  { value: 'plant-based', icon: '🌱', label: 'Plant-Based' },
  { value: 'low-calorie', icon: '⚡', label: 'Low Calorie' },
  { value: 'indulgent', icon: '🍭', label: 'Indulgent' },
];

const complexities: { value: MealComplexity; icon: string; label: string }[] = [
  { value: 'quick', icon: '⚡', label: 'Quick & Easy (<20 min)' },
  { value: 'home-cooked', icon: '🍳', label: 'Home Cooked (30–60 min)' },
  { value: 'full-meal', icon: '🍽️', label: 'Full Proper Meal (1–2 hrs)' },
  { value: 'fine-dining', icon: '👨‍🍳', label: 'Fine Dining (2+ hrs)' },
];

const occasions: { value: Occasion; label: string }[] = [
  { value: 'everyday', label: 'Everyday' },
  { value: 'date-night', label: 'Date Night' },
  { value: 'family-dinner', label: 'Family Dinner' },
  { value: 'dinner-party', label: 'Dinner Party' },
  { value: 'meal-prep', label: 'Meal Prep' },
  { value: 'birthday', label: 'Birthday' },
  { value: 'festive', label: 'Festive' },
  { value: 'late-night', label: 'Late Night' },
  { value: 'hangover-cure', label: 'Hangover Cure' },
  { value: 'lunchbox', label: 'Lunchbox' },
];

const dietaryRestrictions: { value: DietaryRestriction; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'gluten-free', label: 'Gluten-Free' },
  { value: 'dairy-free', label: 'Dairy-Free' },
  { value: 'nut-free', label: 'Nut-Free' },
  { value: 'halal', label: 'Halal' },
  { value: 'kosher', label: 'Kosher' },
  { value: 'low-sodium', label: 'Low Sodium' },
];

export default function PreferencesPage() {
  const router = useRouter();
  const { userPreferences, identifiedIngredients, actions } = useAppStore();

  const toggleHealthGoal = (goal: HealthGoal) => {
    const current = userPreferences.healthGoals;
    const updated = current.includes(goal)
      ? current.filter((g) => g !== goal)
      : [...current, goal];
    actions.setPreferences({ healthGoals: updated });
  };

  const toggleComplexity = (c: MealComplexity) => {
    const current = userPreferences.complexities;
    const updated = current.includes(c)
      ? current.filter((x) => x !== c)
      : [...current, c];
    actions.setPreferences({ complexities: updated });
  };

  const handleSubmit = () => {
    if (identifiedIngredients.length === 0) {
      toast.error('No ingredients found. Please scan your kitchen first.');
      router.push('/scan');
      return;
    }
    if (userPreferences.healthGoals.length === 0) {
      toast.error('Please select at least one health goal');
      return;
    }
    if (userPreferences.complexities.length === 0) {
      toast.error('Please select at least one meal complexity');
      return;
    }
    router.push('/results');
  };

  const toggleOccasion = (occ: Occasion) => {
    const current = userPreferences.occasions;
    const updated = current.includes(occ)
      ? current.filter((o) => o !== occ)
      : [...current, occ];
    actions.setPreferences({ occasions: updated });
  };

  const toggleRestriction = (r: DietaryRestriction) => {
    const current = userPreferences.dietaryRestrictions;
    if (r === 'none') {
      actions.setPreferences({ dietaryRestrictions: ['none'] });
      return;
    }
    const withoutNone = current.filter((x) => x !== 'none');
    const updated = withoutNone.includes(r)
      ? withoutNone.filter((x) => x !== r)
      : [...withoutNone, r];
    actions.setPreferences({ dietaryRestrictions: updated.length > 0 ? updated : [] });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-28">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-text mb-2">
          Set Your Preferences
        </h1>
        <p className="text-text-muted">
          Tell us what you&apos;re in the mood for
        </p>
        {identifiedIngredients.length > 0 && (
          <p className="text-sm text-success mt-2 font-medium">
            ✓ {identifiedIngredients.length} ingredients ready
          </p>
        )}
      </motion.div>

      <div className="space-y-8">
        {/* Section A: Health Goal */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface border border-border rounded-3xl p-6"
        >
          <h2 className="font-display text-lg font-bold text-text mb-4">
            🎯 Health Goal <span className="text-sm font-normal text-text-muted">(multi-select)</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {healthGoals.map((goal) => (
              <FilterCard
                key={goal.value}
                icon={goal.icon}
                label={goal.label}
                selected={userPreferences.healthGoals.includes(goal.value)}
                onClick={() => toggleHealthGoal(goal.value)}
              />
            ))}
          </div>
        </motion.section>

        {/* Section B: Meal Complexity */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-surface border border-border rounded-3xl p-6"
        >
          <h2 className="font-display text-lg font-bold text-text mb-4">
            ⏱️ Meal Complexity <span className="text-sm font-normal text-text-muted">(multi-select)</span>
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
            {complexities.map((c) => (
              <div key={c.value} className="flex-shrink-0 min-w-[140px]">
                <FilterCard
                  icon={c.icon}
                  label={c.label}
                  selected={userPreferences.complexities.includes(c.value)}
                  onClick={() => toggleComplexity(c.value)}
                  size="sm"
                />
              </div>
            ))}
          </div>
        </motion.section>

        {/* Section C: Occasion */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface border border-border rounded-3xl p-6"
        >
          <h2 className="font-display text-lg font-bold text-text mb-4">
            🎉 Occasion <span className="text-sm font-normal text-text-muted">(multi-select)</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {occasions.map((occ) => {
              const selected = userPreferences.occasions.includes(occ.value);
              return (
                <button
                  key={occ.value}
                  onClick={() => toggleOccasion(occ.value)}
                  className={`
                    px-4 py-2.5 rounded-full text-sm font-medium transition-all min-h-[44px] cursor-pointer
                    ${selected
                      ? 'gradient-primary text-white shadow-md shadow-primary/20'
                      : 'bg-bg border border-border text-text-muted hover:border-primary/40 hover:text-text'
                    }
                  `}
                >
                  {occ.label}
                </button>
              );
            })}
          </div>
        </motion.section>

        {/* Section D: Serving Size */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-surface border border-border rounded-3xl p-6"
        >
          <h2 className="font-display text-lg font-bold text-text mb-4">
            👥 Serving Size
          </h2>
          <div className="space-y-4">
            <ServingStepper
              value={userPreferences.servings}
              onChange={(v) => actions.setPreferences({ servings: v })}
            />

            <div className="flex gap-3">
              {(['single-dish', 'full-spread'] as MealFormat[]).map((format) => (
                <button
                  key={format}
                  onClick={() => actions.setPreferences({ mealFormat: format })}
                  className={`
                    flex-1 py-3 rounded-xl text-sm font-medium transition-all min-h-[44px] cursor-pointer
                    ${userPreferences.mealFormat === format
                      ? 'gradient-primary text-white shadow-md shadow-primary/20'
                      : 'bg-bg border border-border text-text-muted hover:border-primary/40'
                    }
                  `}
                >
                  {format === 'single-dish' ? '🍲 Single Dish' : '🍽️ Full Spread'}
                </button>
              ))}
            </div>

            {userPreferences.mealFormat === 'full-spread' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex gap-2 flex-wrap"
              >
                {[
                  { key: 'includeStarter' as const, label: '🥗 Starter' },
                  { key: 'includeMain' as const, label: '🍖 Main' },
                  { key: 'includeDessert' as const, label: '🍰 Dessert' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() =>
                      actions.setPreferences({
                        [item.key]: !userPreferences[item.key],
                      })
                    }
                    className={`
                      px-4 py-2.5 rounded-xl text-sm font-medium transition-all min-h-[44px] cursor-pointer
                      ${userPreferences[item.key]
                        ? 'bg-success/15 text-deep border border-success/30'
                        : 'bg-bg border border-border text-text-muted hover:border-success/40'
                      }
                    `}
                  >
                    {item.label}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* Section E: Dietary Restrictions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface border border-border rounded-3xl p-6"
        >
          <h2 className="font-display text-lg font-bold text-text mb-4">
            🚫 Dietary Restrictions <span className="text-sm font-normal text-text-muted">(multi-select)</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {dietaryRestrictions.map((r) => {
              const selected = userPreferences.dietaryRestrictions.includes(r.value);
              return (
                <button
                  key={r.value}
                  onClick={() => toggleRestriction(r.value)}
                  className={`
                    px-4 py-2.5 rounded-full text-sm font-medium transition-all min-h-[44px] cursor-pointer
                    ${selected
                      ? 'gradient-primary text-white shadow-md shadow-primary/20'
                      : 'bg-bg border border-border text-text-muted hover:border-primary/40 hover:text-text'
                    }
                  `}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </motion.section>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 glass border-t border-border/50 z-40">
        <div className="max-w-3xl mx-auto flex gap-3">
          <button
            onClick={() => router.push('/scan')}
            className="px-4 py-3.5 rounded-xl border-2 border-border bg-surface text-text font-medium
                       hover:border-primary/50 transition-all min-h-[48px] cursor-pointer flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3.5 rounded-xl gradient-primary text-white font-semibold text-lg
                       shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30
                       transition-all min-h-[48px] cursor-pointer flex items-center justify-center gap-2"
          >
            Find My Recipes
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
