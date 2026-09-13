import { strict as assert } from 'node:assert';
import { readFileSync, existsSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import { recipes, validateRecipes } from './recipes.ts';
import { avatarLevel, createGameState, customerIds, gameReducer, ingredientIds, matchesRecipe, recipeDisplayName } from './game.ts';

const root = new URL('../../', import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), 'utf8');

test('all 20 recipes match the source catalog and documented recipe definitions', () => {
  assert.equal(recipes.length, 20);
  assert.deepEqual(recipes, JSON.parse(read('data/sushi.json')));
  const documented = read('docs/SUSHI_RECIPES.md').split('**ID**').slice(1).map(section => {
    const fields = [...section.matchAll(/```text\s*([\s\S]*?)```/g)].slice(0, 4).map(match => match[1].trim());
    return { id: fields[0], name: fields[1], hard_name: fields[2], ingredients: fields[3].split(/\s+/) };
  });
  assert.deepEqual(recipes, documented);
});

test('all recipe names and submission feedback follow mode while matching, counters and reactions stay identical', () => {
  for (const recipe of recipes) {
    assert.equal(recipeDisplayName(recipe, 'easy'), recipe.name);
    assert.equal(recipeDisplayName(recipe, 'hard'), recipe.hard_name);
    const extra = ingredientIds.find(id => !recipe.ingredients.includes(id))!;
    for (const selected of [[...recipe.ingredients].reverse(), recipe.ingredients.slice(1), [...recipe.ingredients, extra]]) {
      const results = (['easy', 'hard'] as const).map(game_mode => {
        const before = { ...createGameState(recipe, 'customer_01', { selected_avatar: 'female', game_mode }), selected };
        const result = gameReducer(before, { type: 'submit' });
        assert.equal(result.reaction!.correct, matchesRecipe(selected, recipe));
        assert.ok(result.feedback!.startsWith(`${recipeDisplayName(recipe, game_mode)}:`));
        if (game_mode === 'hard') assert.ok(!result.feedback!.includes(recipe.name));
        const { game_mode: mode, feedback, ...rest } = result;
        return rest;
      });
      assert.deepEqual(results[0], results[1]);
    }
  }
});

test('catalog validation rejects missing/blank names and IDs, invalid ingredients and duplicate IDs/ingredients', () => {
  const valid = recipes[0];
  for (const field of ['id', 'name', 'hard_name']) {
    for (const value of [undefined, '', '  ', 42]) assert.throws(() => validateRecipes([{ ...valid, [field]: value }]), new RegExp(field));
  }
  assert.throws(() => validateRecipes([valid, valid]), /Duplicate recipe ID/);
  assert.throws(() => validateRecipes([{ ...valid, ingredients: ['rice', 'rice'] }]), /Duplicate ingredient/);
  assert.throws(() => validateRecipes([{ ...valid, ingredients: ['unknown'] }]), /Unknown ingredient/);
  for (const ingredients of [[], null, 'rice']) assert.throws(() => validateRecipes([{ ...valid, ingredients }]), /requires ingredients/);
  for (const catalog of [[], null, {}, [null]]) assert.throws(() => validateRecipes(catalog));
});

// Evaluate the registry's literal asset maps without loading React Native or PNGs in Node.
function assetRegistry(): {
  playerAvatars: Record<'female' | 'male', Record<number, string>>;
  customers: Record<string, string>;
  sushiImages: Record<string, string>;
  ingredientImages: Record<string, string>;
  backgrounds: Record<number, string>;
} {
  const source = read('src/assets/registry.ts').replace(/^import type .*;\n/gm, '')
    .replace(/export const /g, 'const ').replace(/ satisfies [^;]+;/g, ';');
  return runInNewContext(`${source}\n({ playerAvatars, customers, sushiImages, ingredientImages, backgrounds })`, {
    require: (path: string) => {
      assert.ok(existsSync(new URL(path, new URL('src/assets/registry.ts', root))), path);
      return path;
    },
  });
}

test('static registry covers both avatar sequences including final display, ten customers and all catalog artwork', () => {
  const registry = assetRegistry();
  assert.equal(customerIds.length, 10);
  assert.deepEqual(Object.keys(registry.customers), [...customerIds]);
  for (const avatar of ['female', 'male'] as const) {
    for (let failures = 0; failures <= 25; failures++) {
      const level = failures === 25 ? 4 : failures % 5;
      const game = { ...createGameState(recipes[0], 'customer_01', { selected_avatar: avatar, game_mode: 'easy' }), frazzled_level: failures % 5, game_over: failures === 25 };
      assert.equal(registry.playerAvatars[game.selected_avatar][avatarLevel(game)], `../../assets/player/player_frazzled_${avatar === 'male' ? 'm_' : ''}${level}.png`);
    }
  }
  for (const recipe of recipes) assert.equal(registry.sushiImages[recipe.id], `../../assets/sushi/${recipe.id}.png`);
  for (const id of ingredientIds) assert.equal(registry.ingredientImages[id], `../../assets/ingredients/ingredient_${id}.png`);
  for (let level = 0; level <= 5; level++) assert.equal(registry.backgrounds[level], `../../assets/backgrounds/background_horror_${level}.png`);
  for (const id of customerIds) {
    const image = readFileSync(new URL(`assets/customers/${id}.png`, root));
    assert.equal(image.readUInt32BE(16), 1254);
    assert.equal(image.readUInt32BE(20), 1254);
    assert.equal(image[25], 6); // RGBA PNG
  }
});
