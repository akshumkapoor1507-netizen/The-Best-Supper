'use client';

import { create } from 'zustand';
import type { AppState, Ingredient, Recipe, UserPreferences } from '@/types';

const defaultPreferences: UserPreferences = {
  healthGoal: null,
  complexity: null,
  occasions: [],
  servings: 2,
  mealFormat: 'single-dish',
  includeStarter: false,
  includeMain: true,
  includeDessert: false,
  dietaryRestrictions: [],
};

// Load saved recipes from localStorage
function loadSavedRecipes(): Recipe[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('the-best-supper-saved-recipes');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

// Persist saved recipes to localStorage
function persistSavedRecipes(recipes: Recipe[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('the-best-supper-saved-recipes', JSON.stringify(recipes));
  } catch {
    console.error('Failed to save recipes to localStorage');
  }
}

export const useAppStore = create<AppState>((set, get) => ({
  uploadedImages: [],
  identifiedIngredients: [],
  userPreferences: { ...defaultPreferences },
  generatedRecipes: [],
  savedRecipes: [],
  isAnalysing: false,
  isGenerating: false,
  actions: {
    setImages: (urls: string[]) => set({ uploadedImages: urls }),

    addImage: (url: string) =>
      set((state) => ({ uploadedImages: [...state.uploadedImages, url] })),

    removeImage: (url: string) =>
      set((state) => ({
        uploadedImages: state.uploadedImages.filter((u) => u !== url),
      })),

    setIngredients: (items: Ingredient[]) =>
      set({ identifiedIngredients: items }),

    removeIngredient: (name: string) =>
      set((state) => ({
        identifiedIngredients: state.identifiedIngredients.filter(
          (i) => i.name !== name
        ),
      })),

    addIngredient: (item: Ingredient) =>
      set((state) => ({
        identifiedIngredients: [...state.identifiedIngredients, item],
      })),

    setPreferences: (prefs: Partial<UserPreferences>) =>
      set((state) => ({
        userPreferences: { ...state.userPreferences, ...prefs },
      })),

    setRecipes: (recipes: Recipe[]) => set({ generatedRecipes: recipes }),

    saveRecipe: (recipe: Recipe) => {
      const current = get().savedRecipes;
      if (current.some((r) => r.id === recipe.id)) return;
      const updated = [...current, recipe];
      persistSavedRecipes(updated);
      set({ savedRecipes: updated });
    },

    removeSavedRecipe: (id: string) => {
      const updated = get().savedRecipes.filter((r) => r.id !== id);
      persistSavedRecipes(updated);
      set({ savedRecipes: updated });
    },

    setAnalysing: (v: boolean) => set({ isAnalysing: v }),

    setGenerating: (v: boolean) => set({ isGenerating: v }),

    reset: () =>
      set({
        uploadedImages: [],
        identifiedIngredients: [],
        userPreferences: { ...defaultPreferences },
        generatedRecipes: [],
        isAnalysing: false,
        isGenerating: false,
      }),
  },
}));

// Initialize saved recipes from localStorage (client-side only)
if (typeof window !== 'undefined') {
  const saved = loadSavedRecipes();
  if (saved.length > 0) {
    useAppStore.setState({ savedRecipes: saved });
  }
}
