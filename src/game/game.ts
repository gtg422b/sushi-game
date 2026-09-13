export const ingredientIds = [
  'rice', 'nori', 'salmon', 'tuna', 'shrimp', 'eel', 'crab',
  'avocado', 'cucumber', 'cream_cheese', 'spicy_mayo', 'tempura_shrimp',
] as const;

export const customerIds = ['customer_01', 'customer_02', 'customer_03', 'customer_04', 'customer_05'] as const;
export type CustomerId = typeof customerIds[number];
export type CustomerReaction = { customer_id: CustomerId; correct: boolean };

export function randomCustomer(previous?: CustomerId, random = Math.random, available: readonly CustomerId[] = customerIds): CustomerId {
  if (!available.length) throw new Error('At least one customer is required.');
  const alternatives = available.filter(id => id !== previous);
  const pool = alternatives.length ? alternatives : available;
  return pool[Math.floor(random() * pool.length)];
}

export type IngredientId = typeof ingredientIds[number];
export type Recipe = { id: string; name: string; ingredients: IngredientId[] };
export type GameState = {
  order: Recipe;
  customer_id: CustomerId;
  reaction: CustomerReaction | null;
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

export function createGameState(order: Recipe, customer_id: CustomerId): GameState {
  return { order, customer_id, reaction: null, selected: [], feedback: null, successful_customers_served: 0,
    failures: 0, ...progression(0) };
}
export type GameAction =
  | { type: 'toggle'; ingredient: IngredientId }
  | { type: 'clear' }
  | { type: 'restart'; nextOrder: Recipe; nextCustomer: CustomerId }
  | { type: 'submit' }
  | { type: 'finishReaction'; reaction: CustomerReaction; nextOrder?: Recipe; nextCustomer?: CustomerId };

// Generate the next visit only after a reaction, and never after game over.
export function finishReactionAction(state: GameState, recipes: readonly Recipe[], random = Math.random): GameAction | null {
  if (!state.reaction) return null;
  if (state.game_over) return { type: 'finishReaction', reaction: state.reaction };
  return { type: 'finishReaction', reaction: state.reaction,
    nextOrder: randomOrder(recipes, random), nextCustomer: randomCustomer(state.customer_id, random) };
}

export function restartAction(state: GameState, recipes: readonly Recipe[], random = Math.random): GameAction {
  return { type: 'restart', nextOrder: randomOrder(recipes, random), nextCustomer: randomCustomer(state.customer_id, random) };
}

export function avatarLevel(state: GameState): number {
  return state.game_over ? 4 : state.frazzled_level;
}

export function randomOrder(recipes: readonly Recipe[], random = Math.random): Recipe {
  if (!recipes.length) throw new Error('At least one recipe is required.');
  return recipes[Math.floor(random() * recipes.length)];
}

export function matchesRecipe(selected: readonly IngredientId[], recipe: Recipe): boolean {
  const ingredients = new Set(selected);
  return ingredients.size === recipe.ingredients.length && recipe.ingredients.every(id => ingredients.has(id));
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  if (action.type === 'restart') return createGameState(action.nextOrder, action.nextCustomer);
  if (action.type === 'finishReaction') {
    // An expired callback from an older reaction/session must not change this one.
    if (!state.reaction || action.reaction !== state.reaction) return state;
    if (state.game_over) return { ...state, reaction: null };
    if (!action.nextOrder || !action.nextCustomer) return state;
    return { ...state, reaction: null, order: action.nextOrder, customer_id: action.nextCustomer };
  }
  if (state.game_over || state.reaction) return state;

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
        reaction: { customer_id: state.customer_id, correct }, selected: [],
        feedback: visualState.game_over ? 'The restaurant has reached its final horror state.'
          : correct ? `${state.order.name}: nicely done! New order ready.`
          : `${state.order.name}: ingredients didn't match. Try the next order!`,
      };
    }
  }
}
