export const ingredientIds = [
  'rice', 'nori', 'salmon', 'tuna', 'shrimp', 'eel', 'crab',
  'avocado', 'cucumber', 'cream_cheese', 'spicy_mayo', 'tempura_shrimp',
] as const;

export type IngredientId = typeof ingredientIds[number];
export type Recipe = { id: string; name: string; ingredients: IngredientId[] };
export type GameState = { order: Recipe; selected: IngredientId[]; feedback: string | null };
export type GameAction =
  | { type: 'toggle'; ingredient: IngredientId }
  | { type: 'clear' }
  | { type: 'submit'; nextOrder: Recipe };

export function randomOrder(recipes: readonly Recipe[], random = Math.random): Recipe {
  if (!recipes.length) throw new Error('At least one recipe is required.');
  return recipes[Math.floor(random() * recipes.length)];
}

export function matchesRecipe(selected: readonly IngredientId[], recipe: Recipe): boolean {
  const ingredients = new Set(selected);
  return ingredients.size === recipe.ingredients.length && recipe.ingredients.every(id => ingredients.has(id));
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'toggle':
      return { ...state, feedback: null, selected: state.selected.includes(action.ingredient)
        ? state.selected.filter(id => id !== action.ingredient)
        : [...state.selected, action.ingredient] };
    case 'clear': return { ...state, selected: [], feedback: null };
    case 'submit': return {
      order: action.nextOrder, selected: [],
      feedback: matchesRecipe(state.selected, state.order)
        ? `${state.order.name}: nicely done! New order ready.`
        : `${state.order.name}: ingredients didn't match. Try the next order!`,
    };
  }
}
