import { useCallback, useReducer } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { appReducer, createAppState, startGameAction } from './src/game/app';
import { recipes } from './src/game/recipes';
import type { GameAction } from './src/game/game';
import { GameScreen } from './src/screens/GameScreen';
import { StartScreen } from './src/screens/StartScreen';

export default function App() {
  const [state, dispatch] = useReducer(appReducer, undefined, () => createAppState());
  const dispatchGame = useCallback((action: GameAction) => dispatch({ type: 'game', action }), []);
  return (
    <SafeAreaProvider>
      {state.screen === 'start' ? (
        <StartScreen setup={state.setup}
          onSelectAvatar={avatar => dispatch({ type: 'selectAvatar', avatar })}
          onSelectMode={mode => dispatch({ type: 'selectMode', mode })}
          onStart={() => { const action = startGameAction(state, recipes); if (action) dispatch(action); }} />
      ) : (
        <GameScreen state={state.game}
          dispatch={dispatchGame}
          onBackToStart={() => dispatch({ type: 'backToStart' })} />
      )}
    </SafeAreaProvider>
  );
}
