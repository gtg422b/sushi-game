import data from '../../data/sushi.json' with { type: 'json' };
import { ingredientIds, type IngredientId, type Recipe } from './game.ts';

export function validateRecipes(catalog: unknown): Recipe[] {
  if (!Array.isArray(catalog) || !catalog.length) throw new Error('At least one recipe is required.');
  const ids = new Set<string>();
  return catalog.map((value: unknown) => {
    if (!value || typeof value !== 'object') throw new Error('Invalid recipe.');
    const recipe = value as Record<string, unknown>;
    for (const field of ['id', 'name', 'hard_name'] as const) {
      if (typeof recipe[field] !== 'string' || !recipe[field].trim()) {
        throw new Error(`Recipe requires a nonempty ${field}.`);
      }
    }
    const id = recipe.id as string;
    if (ids.has(id)) throw new Error(`Duplicate recipe ID: ${id}`);
    ids.add(id);
    if (!Array.isArray(recipe.ingredients) || !recipe.ingredients.length) throw new Error(`Recipe ${id} requires ingredients.`);
    const ingredients = recipe.ingredients.map((ingredient: unknown) => {
      if (!ingredientIds.includes(ingredient as IngredientId)) throw new Error(`Unknown ingredient: ${String(ingredient)}`);
      return ingredient as IngredientId;
    });
    if (new Set(ingredients).size !== ingredients.length) throw new Error(`Duplicate ingredient in recipe: ${id}`);
    return { id, name: recipe.name as string, hard_name: recipe.hard_name as string, ingredients };
  });
}

export const recipes = validateRecipes(data);
