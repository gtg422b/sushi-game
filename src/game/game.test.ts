import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import {
  avatarLevel, createGameState, customerIds, finishReactionAction, gameReducer,
  matchesRecipe, progression, randomCustomer, randomOrder, restartAction,
  type GameState, type Recipe,
} from './game.ts';

const salmon: Recipe = { id: 'salmon_nigiri', name: 'Salmon Nigiri', ingredients: ['rice', 'salmon'] };
const tuna: Recipe = { id: 'tuna_nigiri', name: 'Tuna Nigiri', ingredients: ['rice', 'tuna'] };
const initial = () => createGameState(salmon, randomCustomer(undefined, () => 0));
function finish(state: GameState) {
  const action = finishReactionAction(state, [tuna], () => 0);
  assert.ok(action);
  return gameReducer(state, action);
}
function lose() {
  let state = initial();
  for (let i = 0; i < 25; i++) {
    state = gameReducer(state, { type: 'submit' });
    if (i < 24) state = finish(state);
  }
  return state;
}

test('recipes match unordered sets and reject missing or extra ingredients', () => {
  assert.equal(matchesRecipe(['salmon', 'rice'], salmon), true);
  assert.equal(matchesRecipe(['salmon'], salmon), false);
  assert.equal(matchesRecipe(['salmon', 'rice', 'nori'], salmon), false);
});

test('random order selection reaches both ends and rejects an empty catalog', () => {
  assert.equal(randomOrder([salmon, tuna], () => 0), salmon);
  assert.equal(randomOrder([salmon, tuna], () => 0.999), tuna);
  assert.throws(() => randomOrder([]));
});

test('initial random customer is stored and all five customers are selectable', () => {
  for (let i = 0; i < customerIds.length; i++) {
    const customer = randomCustomer(undefined, () => (i + 0.5) / customerIds.length);
    assert.equal(customer, customerIds[i]);
    assert.equal(createGameState(salmon, customer).customer_id, customer);
  }
  assert.equal(initial().reaction, null);
});

test('rotation excludes the current customer when possible and supports a single customer', () => {
  for (const previous of customerIds) {
    for (const value of [0, 0.25, 0.5, 0.999]) assert.notEqual(randomCustomer(previous, () => value), previous);
  }
  assert.equal(randomCustomer('customer_01', () => 0, ['customer_01']), 'customer_01');
  assert.throws(() => randomCustomer(undefined, Math.random, []));
});

test('selection toggles and clear resets it', () => {
  const state = gameReducer(initial(), { type: 'toggle', ingredient: 'rice' });
  assert.deepEqual(state.selected, ['rice']);
  assert.deepEqual(gameReducer(state, { type: 'toggle', ingredient: 'rice' }), initial());
  assert.deepEqual(gameReducer(state, { type: 'clear' }), initial());
});

for (const correct of [true, false]) {
  test(`${correct ? 'correct' : 'incorrect'} reaction belongs to outgoing customer, then rotates customer and order`, () => {
    const before = initial();
    const state = gameReducer({ ...before, selected: correct ? ['rice', 'salmon'] : ['nori'] }, { type: 'submit' });
    assert.deepEqual(state.reaction, { customer_id: before.customer_id, correct });
    assert.equal(state.customer_id, before.customer_id);
    assert.equal(state.order, before.order);
    assert.equal(state.successful_customers_served, correct ? 1 : 0);
    assert.equal(state.failures, correct ? 0 : 1);
    assert.match(state.feedback!, correct ? /nicely done/ : /didn't match/);
    assert.deepEqual(state.selected, []);
    assert.equal(gameReducer(state, { type: 'submit' }), state);
    assert.equal(gameReducer(state, { type: 'toggle', ingredient: 'rice' }), state);
    assert.equal(gameReducer(state, { type: 'clear' }), state);
    const next = finish(state);
    assert.notEqual(next.customer_id, before.customer_id);
    assert.equal(next.order, tuna);
    assert.equal(next.reaction, null);
    assert.equal(next.feedback, state.feedback);
  });
}

test('success preserves previous failures and progression', () => {
  let state = finish(gameReducer(initial(), { type: 'submit' }));
  state = gameReducer({ ...state, selected: [...state.order.ingredients] }, { type: 'submit' });
  assert.equal(state.successful_customers_served, 1);
  assert.equal(state.failures, 1);
  assert.equal(state.frazzled_level, 1);
  assert.equal(state.horror_level, 0);
});

test('all 25 failure boundaries and final avatar appearance', () => {
  let state = initial();
  for (let failures = 1; failures <= 25; failures++) {
    state = gameReducer(state, { type: 'submit' });
    assert.equal(state.failures, failures);
    assert.equal(state.successful_customers_served, 0);
    assert.equal(state.frazzled_level, failures % 5);
    assert.equal(state.horror_level, Math.floor(failures / 5));
    assert.equal(state.game_over, failures === 25);
    assert.equal(avatarLevel(state), failures === 25 ? 4 : failures % 5);
    if (failures < 25) state = finish(state);
  }
  assert.equal(progression(100).horror_level, 5);
});

test('game over retains final order/customer and never invokes random generation', () => {
  const state = lose();
  assert.equal(state.game_over, true);
  const action = finishReactionAction(state, [], () => { throw new Error('Must not generate a new visit'); });
  assert.ok(action);
  const final = gameReducer(state, action);
  assert.equal(final.order, state.order);
  assert.equal(final.customer_id, state.customer_id);
  assert.equal(final.reaction, null);
  assert.equal(final.horror_level, 5);
  assert.equal(avatarLevel(final), 4);
  assert.equal(gameReducer(final, { type: 'submit' }), final);
  assert.equal(gameReducer(final, { type: 'toggle', ingredient: 'rice' }), final);
  assert.equal(finishReactionAction(final, []), null);
});

test('restart resets horror to zero, normal avatar, counters, order, customer, reaction and overlay conditions', () => {
  const lost = lose();
  const stale = finishReactionAction(lost, []);
  assert.ok(stale);
  for (const before of [lost, finish(lost), { ...lost, selected: ['rice'] as GameState['selected'], successful_customers_served: 3 }]) {
    const state = gameReducer(before, restartAction(before, [salmon], () => 0));
    assert.deepEqual(state, {
      order: salmon, customer_id: randomCustomer(before.customer_id, () => 0),
      reaction: null, selected: [], feedback: null, failures: 0,
      successful_customers_served: 0, frazzled_level: 0, horror_level: 0, game_over: false,
    });
    assert.notEqual(state.customer_id, before.customer_id);
    assert.equal(avatarLevel(state), 0);
    assert.equal(gameReducer(state, stale), state);
    assert.deepEqual(gameReducer(state, { type: 'toggle', ingredient: 'rice' }).selected, ['rice']);
  }
});

test('stale reaction completion cannot advance a restarted session or a later reaction', () => {
  const reacting = gameReducer(initial(), { type: 'submit' });
  const stale = finishReactionAction(reacting, [tuna], () => 0)!;
  const restarted = gameReducer(reacting, restartAction(reacting, [salmon], () => 0));
  assert.equal(restarted.reaction, null);
  assert.equal(gameReducer(restarted, stale), restarted);
  const later = gameReducer(restarted, { type: 'submit' });
  assert.equal(gameReducer(later, stale), later);
});
