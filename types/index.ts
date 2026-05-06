// ===== Ingredient Types =====
export type IngredientCategory =
  | 'protein'
  | 'vegetable'
  | 'fruit'
  | 'grain'
  | 'dairy'
  | 'fat'
  | 'spice'
  | 'condiment'
  | 'other';

export type Confidence = 'high' | 'medium' | 'low';

export interface Ingredient {
  name: string;
  category: IngredientCategory;
  estimated_quantity: string | null;
  confidence: Confidence;
}

// ===== Recipe Types =====
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface RecipeIngredient {
  name: string;
  quantity: string;
  unit: string | null;
  optional?: boolean;
}

export interface RecipeStep {
  step: number;
  title: string;
  detail: string;
}

export interface NutritionInfo {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fibre_g: number;
}

export interface Recipe {
  id: string;
  name: string;
  tagline: string;
  description: string;
  cuisine: string;
  difficulty: Difficulty;
  cook_time_minutes: number;
  prep_time_minutes: number;
  servings: number;
  health_tags: string[];
  occasion_tags: string[];
  ingredients_available: RecipeIngredient[];
  ingredients_needed: RecipeIngredient[];
  instructions: RecipeStep[];
  nutrition_per_serving: NutritionInfo;
  chef_tip: string;
}

// ===== User Preferences =====
export type HealthGoal =
  | 'healthy'
  | 'high-protein'
  | 'keto'
  | 'plant-based'
  | 'low-calorie'
  | 'indulgent';

export type MealComplexity =
  | 'quick'
  | 'home-cooked'
  | 'full-meal'
  | 'fine-dining';

export type Occasion =
  | 'everyday'
  | 'date-night'
  | 'family-dinner'
  | 'dinner-party'
  | 'meal-prep'
  | 'birthday'
  | 'festive'
  | 'late-night'
  | 'hangover-cure'
  | 'lunchbox';

export type DietaryRestriction =
  | 'none'
  | 'vegetarian'
  | 'vegan'
  | 'gluten-free'
  | 'dairy-free'
  | 'nut-free'
  | 'halal'
  | 'kosher'
  | 'low-sodium';

export type MealFormat = 'single-dish' | 'full-spread';

export interface UserPreferences {
  healthGoals: HealthGoal[];
  complexities: MealComplexity[];
  occasions: Occasion[];
  servings: number;
  mealFormat: MealFormat;
  includeStarter: boolean;
  includeMain: boolean;
  includeDessert: boolean;
  dietaryRestrictions: DietaryRestriction[];
}

// ===== API Types =====
export interface AnalyseKitchenRequest {
  imageUrls: string[];
}

export interface AnalyseKitchenResponse {
  ingredients: Ingredient[];
  notes: string | null;
}

export interface GenerateRecipesRequest {
  ingredients: Ingredient[];
  preferences: UserPreferences;
}

export interface GenerateRecipesResponse {
  recipes: Recipe[];
}

// ===== Store Types =====
export interface AppState {
  uploadedImages: string[];
  identifiedIngredients: Ingredient[];
  userPreferences: UserPreferences;
  generatedRecipes: Recipe[];
  savedRecipes: Recipe[];
  isAnalysing: boolean;
  isGenerating: boolean;
  actions: {
    setImages: (urls: string[]) => void;
    addImage: (url: string) => void;
    removeImage: (url: string) => void;
    setIngredients: (items: Ingredient[]) => void;
    removeIngredient: (name: string) => void;
    addIngredient: (item: Ingredient) => void;
    setPreferences: (prefs: Partial<UserPreferences>) => void;
    setRecipes: (recipes: Recipe[]) => void;
    saveRecipe: (recipe: Recipe) => void;
    removeSavedRecipe: (id: string) => void;
    setAnalysing: (v: boolean) => void;
    setGenerating: (v: boolean) => void;
    reset: () => void;
  };
}
