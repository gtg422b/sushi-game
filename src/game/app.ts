import {
  createGameState, gameReducer, randomCustomer, randomOrder,
  type AvatarId, type CustomerId, type GameAction, type GameMode,
  type GameState, type Recipe, type SessionOptions,
} from './game.ts';

export type AppState =
  | { screen: 'start'; setup: SessionOptions; previous_customer?: CustomerId; game: null }
  | { screen: 'playing'; game: GameState };

export type AppAction =
  | { type: 'selectAvatar'; avatar: AvatarId }
  | { type: 'selectMode'; mode: GameMode }
  | { type: 'startGame'; nextOrder: Recipe; nextCustomer: CustomerId }
  | { type: 'backToStart' }
  | { type: 'game'; action: GameAction };

export function createAppState(previous_customer?: CustomerId): AppState {
  return { screen: 'start', setup: { selected_avatar: 'female', game_mode: 'easy' },
    previous_customer, game: null };
}

export function startGameAction(state: AppState, recipes: readonly Recipe[], random = Math.random): AppAction | null {
  if (state.screen !== 'start') return null;
  return { type: 'startGame', nextOrder: randomOrder(recipes, random),
    nextCustomer: randomCustomer(state.previous_customer, random) };
}

export function appReducer(state: AppState, action: AppAction): AppState {
  if (state.screen === 'start') {
    switch (action.type) {
      case 'selectAvatar': return { ...state, setup: { ...state.setup, selected_avatar: action.avatar } };
      case 'selectMode': return { ...state, setup: { ...state.setup, game_mode: action.mode } };
      case 'startGame': return { screen: 'playing', game: createGameState(action.nextOrder, action.nextCustomer, state.setup) };
      default: return state;
    }
  }
  if (action.type === 'backToStart') return createAppState(state.game.customer_id);
  if (action.type !== 'game') return state;
  const game = gameReducer(state.game, action.action);
  return game === state.game ? state : { ...state, game };
}
