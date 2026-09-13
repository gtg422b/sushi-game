import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { appReducer, createAppState, startGameAction, type AppState } from './app.ts';
import { avatarLevel, finishReactionAction, restartAction, type GameAction, type SessionOptions } from './game.ts';
import { recipes } from './recipes.ts';

function start(options: SessionOptions = { selected_avatar: 'female', game_mode: 'easy' }): AppState & { screen: 'playing' } {
  let state = createAppState();
  state = appReducer(state, { type: 'selectAvatar', avatar: options.selected_avatar });
  state = appReducer(state, { type: 'selectMode', mode: options.game_mode });
  state = appReducer(state, startGameAction(state, recipes, () => 0)!);
  assert.equal(state.screen, 'playing');
  return state as AppState & { screen: 'playing' };
}
function play(state: AppState, action: GameAction): AppState & { screen: 'playing' } {
  const next = appReducer(state, { type: 'game', action });
  assert.equal(next.screen, 'playing');
  return next as AppState & { screen: 'playing' };
}

test('setup defaults to Female/Easy with no active game or order and ignores all gameplay actions', () => {
  const state = createAppState();
  assert.deepEqual(state, { screen: 'start', setup: { selected_avatar: 'female', game_mode: 'easy' }, previous_customer: undefined, game: null });
  const reacting = play(start(), { type: 'submit' });
  for (const action of [
    { type: 'toggle', ingredient: 'rice' }, { type: 'clear' }, { type: 'submit' },
    restartAction(reacting.game, recipes), finishReactionAction(reacting.game, recipes)!,
  ] as GameAction[]) assert.equal(appReducer(state, { type: 'game', action }), state);
});

for (const selected_avatar of ['female', 'male'] as const) {
  for (const game_mode of ['easy', 'hard'] as const) {
    test(`${selected_avatar}/${game_mode}: start copies choices, gameplay locks choices, and restart fully resets`, () => {
      const options = { selected_avatar, game_mode };
      const initial = start(options);
      assert.equal(initial.game.selected_avatar, selected_avatar);
      assert.equal(initial.game.game_mode, game_mode);
      for (const action of [
        { type: 'selectAvatar', avatar: 'male' }, { type: 'selectMode', mode: 'hard' },
        { type: 'startGame', nextOrder: recipes[1], nextCustomer: 'customer_02' },
      ] as const) assert.equal(appReducer(initial, action), initial);
      assert.equal(startGameAction(initial, [], () => { throw Error('Must not generate'); }), null);
      let state = initial;
      // Earn a success, then exercise every failure boundary for both avatars and modes.
      for (const ingredient of state.game.order.ingredients) state = play(state, { type: 'toggle', ingredient });
      state = play(state, { type: 'submit' });
      assert.equal(state.game.successful_customers_served, 1);
      state = play(state, finishReactionAction(state.game, recipes, () => 0)!);
      const normal = play(state, { type: 'toggle', ingredient: 'rice' });
      const snapshots = [normal];
      for (let failures = 1; failures <= 25; failures++) {
        state = play(state, { type: 'submit' });
        assert.equal(state.game.failures, failures);
        assert.equal(state.game.successful_customers_served, 1);
        assert.equal(state.game.horror_level, Math.floor(failures / 5));
        assert.equal(state.game.frazzled_level, failures % 5);
        assert.equal(state.game.game_over, failures === 25);
        assert.equal(avatarLevel(state.game), failures === 25 ? 4 : failures % 5);
        assert.equal(state.game.selected_avatar, selected_avatar);
        assert.equal(state.game.game_mode, game_mode);
        if (failures === 1 || failures === 25) snapshots.push(state);
        state = play(state, finishReactionAction(state.game, recipes, () => 0)!);
      }
      snapshots.push(state);
      for (const before of snapshots) {
        const restarted = play(before, restartAction(before.game, [recipes[1]], () => 0));
        assert.deepEqual(restarted.game, {
          ...options, order: recipes[1], customer_id: before.game.customer_id === 'customer_01' ? 'customer_02' : 'customer_01',
          selected: [], feedback: null, reaction: null, failures: 0, successful_customers_served: 0,
          frazzled_level: 0, horror_level: 0, game_over: false,
        });
        const setup = appReducer(before, { type: 'backToStart' });
        assert.deepEqual(setup, { screen: 'start', game: null, setup: { selected_avatar: 'female', game_mode: 'easy' }, previous_customer: before.game.customer_id });
        const next = appReducer(setup, startGameAction(setup, recipes, () => 0)!);
        assert.equal(next.screen, 'playing');
        assert.ok(next.game);
        assert.notEqual(next.game.customer_id, before.game.customer_id);
        assert.equal(next.game.failures, 0);
        assert.equal(next.game.reaction, null);
      }
    });
  }
}

test('Back to Start invalidates an active reaction on setup, in the next session, and during a matching later reaction', () => {
  const reacting = play(start(), { type: 'submit' });
  const stale = finishReactionAction(reacting.game, recipes, () => 0)!;
  const setup = appReducer(reacting, { type: 'backToStart' });
  assert.equal(appReducer(setup, { type: 'game', action: stale }), setup);
  let next = appReducer(setup, startGameAction(setup, recipes, () => 0)!);
  assert.equal(appReducer(next, { type: 'game', action: stale }), next);
  next = play(next, { type: 'submit' });
  next = play(next, finishReactionAction(next.game!, recipes, () => 0)!);
  next = play(next, { type: 'submit' });
  assert.deepEqual(next.game!.reaction, reacting.game.reaction);
  assert.notEqual(next.game!.reaction, reacting.game.reaction);
  assert.equal(appReducer(next, { type: 'game', action: stale }), next);
});
