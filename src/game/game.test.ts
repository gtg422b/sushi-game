import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { gameReducer, matchesRecipe, randomOrder, type Recipe } from './game.ts';

const salmon: Recipe = { id: 'salmon_nigiri', name: 'Salmon Nigiri', ingredients: ['rice', 'salmon'] };
const tuna: Recipe = { id: 'tuna_nigiri', name: 'Tuna Nigiri', ingredients: ['rice', 'tuna'] };

test('recipes match unordered ingredient sets and reject missing or extra ingredients', () => {
  assert.equal(matchesRecipe(['salmon', 'rice'], salmon), true);
  assert.equal(matchesRecipe(['salmon'], salmon), false);
  assert.equal(matchesRecipe(['salmon', 'rice', 'nori'], salmon), false);
});

test('random selection reaches both ends of the catalog', () => {
  assert.equal(randomOrder([salmon, tuna], () => 0), salmon);
  assert.equal(randomOrder([salmon, tuna], () => 0.999), tuna);
  assert.throws(() => randomOrder([]));
});

test('selection toggles, clear resets, and submit advances with feedback', () => {
  const initial = { order: salmon, selected: [], feedback: null };
  let state = gameReducer(initial, { type: 'toggle', ingredient: 'rice' });
  assert.deepEqual(gameReducer(state, { type: 'toggle', ingredient: 'rice' }).selected, []);
  assert.deepEqual(gameReducer(state, { type: 'clear' }), initial);
  state = gameReducer(state, { type: 'toggle', ingredient: 'salmon' });
  const served = gameReducer(state, { type: 'submit', nextOrder: tuna });
  assert.equal(served.order, tuna);
  assert.deepEqual(served.selected, []);
  assert.match(served.feedback!, /nicely done/);
  assert.match(gameReducer(initial, { type: 'submit', nextOrder: tuna }).feedback!, /didn't match/);
});
