import data from '../../data/sushi.json';
import { ingredientIds, type IngredientId, type Recipe } from './game';

// Validate the shared catalog rather than silently accepting unknown ingredient IDs.
export const recipes: Recipe[] = data.map(recipe => ({
  ...recipe,
  ingredients: recipe.ingredients.map(id => {
    if (!ingredientIds.includes(id as IngredientId)) throw new Error(`Unknown ingredient: ${id}`);
    return id as IngredientId;
  }),
}));
