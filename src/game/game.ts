export const ingredientIds = [
  'rice', 'nori', 'salmon', 'tuna', 'shrimp', 'eel', 'crab',
  'avocado', 'cucumber', 'cream_cheese', 'spicy_mayo', 'tempura_shrimp',
] as const;

export type IngredientId = typeof ingredientIds[number];
export type Recipe = { id: string; name: string; ingredients: IngredientId[] };
export type GameState = {
  order: Recipe;
  selected: IngredientId[];
  feedback: string | null;
  successful_customers_served: number;
  failures: number;
  frazzled_level: number;
  horror_level: number;
  game_over: boolean;
};

export function progression(failures: number) {
  return {
    frazzled_level: failures % 5,
    horror_level: Math.min(5, Math.floor(failures / 5)),
    game_over: failures >= 25,
  };
}

export function createGameState(order: Recipe): GameState {
  return { order, selected: [], feedback: null, successful_customers_served: 0,
    failures: 0, ...progression(0) };
}
export type GameAction =
  | { type: 'toggle'; ingredient: IngredientId }
  | { type: 'clear' }
  | { type: 'restart'; nextOrder: Recipe }
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
  if (action.type === 'restart') return createGameState(action.nextOrder);
  if (state.game_over) return state;

  switch (action.type) {
    case 'toggle':
      return { ...state, feedback: null, selected: state.selected.includes(action.ingredient)
        ? state.selected.filter(id => id !== action.ingredient)
        : [...state.selected, action.ingredient] };
    case 'clear': return { ...state, selected: [], feedback: null };
    case 'submit': {
      const correct = matchesRecipe(state.selected, state.order);
      const failures = state.failures + (correct ? 0 : 1);
      const visualState = progression(failures);
      return {
        ...state, ...visualState, failures,
        successful_customers_served: state.successful_customers_served + (correct ? 1 : 0),
        order: action.nextOrder, selected: [],
        feedback: visualState.game_over ? 'The restaurant has reached its final horror state.'
          : correct ? `${state.order.name}: nicely done! New order ready.`
          : `${state.order.name}: ingredients didn't match. Try the next order!`,
      };
    }
  }
}
