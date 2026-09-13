import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { createGameState, progression, gameReducer, matchesRecipe, randomOrder, type Recipe } from './game.ts';

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
  const initial = createGameState(salmon);
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

test('success increments served count without undoing existing failures', () => {
  let state = gameReducer(createGameState(salmon), { type: 'submit', nextOrder: salmon });
  state = gameReducer(state, { type: 'toggle', ingredient: 'rice' });
  state = gameReducer(state, { type: 'toggle', ingredient: 'salmon' });
  state = gameReducer(state, { type: 'submit', nextOrder: tuna });
  assert.equal(state.successful_customers_served, 1);
  assert.equal(state.failures, 1);
  assert.equal(state.frazzled_level, 1);
  assert.equal(state.horror_level, 0);
  assert.equal(state.order, tuna);
});

test('all 25 failures advance frazzled and horror levels at the correct boundaries', () => {
  let state = createGameState(salmon);
  for (let failures = 1; failures <= 25; failures++) {
    state = gameReducer(state, { type: 'submit', nextOrder: tuna });
    assert.equal(state.failures, failures);
    assert.equal(state.successful_customers_served, 0);
    assert.equal(state.frazzled_level, failures % 5);
    assert.equal(state.horror_level, Math.floor(failures / 5));
    assert.equal(state.game_over, failures === 25);
    assert.equal(state.order, tuna);
  }
  assert.equal(state.horror_level, 5);
  assert.equal(state.frazzled_level, 0);
  assert.deepEqual(state.selected, []);
  assert.equal(gameReducer(state, { type: 'toggle', ingredient: 'rice' }), state);
  assert.equal(gameReducer(state, { type: 'submit', nextOrder: salmon }), state);
  assert.equal(gameReducer(state, { type: 'clear' }), state);
});

test('horror level stays capped beyond the final threshold', () => {
  assert.equal(progression(30).horror_level, 5);
  assert.equal(progression(100).horror_level, 5);
});

test('restart resets a finished session and permits play again', () => {
  let state = createGameState(salmon);
  state = { ...state, selected: ['rice', 'salmon'] };
  state = gameReducer(state, { type: 'submit', nextOrder: salmon });
  for (let i = 0; i < 25; i++) state = gameReducer(state, { type: 'submit', nextOrder: salmon });
  assert.equal(state.successful_customers_served, 1);
  assert.equal(state.game_over, true);
  const restarted = gameReducer(state, { type: 'restart', nextOrder: tuna });
  assert.deepEqual(restarted, {
    order: tuna, selected: [], feedback: null, failures: 0,
    successful_customers_served: 0, frazzled_level: 0, horror_level: 0, game_over: false,
  });
  assert.deepEqual(gameReducer(restarted, { type: 'toggle', ingredient: 'rice' }).selected, ['rice']);
  assert.deepEqual(gameReducer({ ...restarted, selected: ['rice'] }, { type: 'restart', nextOrder: salmon }), createGameState(salmon));
});
