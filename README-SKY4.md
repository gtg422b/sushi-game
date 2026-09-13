# Sushi Game 1.1.0 Implementation Handoff

Implemented and verified September 13, 2026. The completed working MVP is designated 1.0.0; release metadata now advances directly from its old 0.1.0 values to 1.1.0.

## What changed

The app opens on a start screen with Female and Easy selected. Players can choose Female/Male and Easy/Hard before starting. Session settings stay fixed during gameplay. Both avatar sequences and all ten customers are registered with explicit static image references. No artwork or recipe data was changed, and no dependencies were added.

Easy uses `recipe.name`; Hard uses `recipe.hard_name`. The shared `recipeDisplayName` helper supplies both the current order and named submission feedback. Difficulty does not affect ingredients, matching, artwork, counters, reactions, progression, or game over.

## Files created

- `src/game/app.ts`: application setup/session state, reducer, and start action helper.
- `src/game/app.test.ts`: setup, session options, reset, progression, and stale-action tests.
- `src/game/recipes.test.ts`: schema validation, catalog/document consistency, display behavior, and static asset coverage.
- `src/screens/StartScreen.tsx`: accessible chef/mode controls and Start Game.
- `README-SKY4.md`: this handoff, created after source implementation and verification completed.

## Files modified

- `App.tsx`: owns the application reducer and switches screens.
- `src/game/game.ts`: session option types, required Hard name, display-name helper, ten customer IDs, and option-preserving restart.
- `src/game/recipes.ts`: validates catalog structure and fields before exporting recipes.
- `src/game/game.test.ts`: retains the original tests with extended fixtures/state expectations; expands customer exclusion coverage and explicitly tests consecutive recipe repeats.
- `src/assets/registry.ts`: female/male avatar maps and customer 06–10 entries.
- `src/screens/GameScreen.tsx`: receives state/callbacks, renders selected avatar/name, and exposes Back to Start during gameplay and on the final overlay.
- `package.json`: version 1.1.0 and test glob covering all three test files.
- `package-lock.json`: only the two root package version fields changed to 1.1.0.
- `app.json`: Expo version 1.1.0. No native build numbers added.

## Architecture and application state

Gameplay rules remain in the pure `gameReducer`. `App.tsx` now owns a small `appReducer`; there is no navigation dependency. `GameScreen` owns its display effect and scroll reference, but receives game state and callbacks.

`AppState` is a discriminated union:

- `screen: 'start'`: setup options, optional previous customer, and `game: null`. No order or active session is retained.
- `screen: 'playing'`: an active `GameState` containing copied session options.

`SessionOptions` contains `selected_avatar: 'female' | 'male'` and `game_mode: 'easy' | 'hard'`. Initialization copies these scalar settings rather than retaining a mutable setup object.

Application actions are `selectAvatar`, `selectMode`, `startGame`, `backToStart`, and a `game` wrapper around existing game actions. Selection and start actions are ignored while playing. Gameplay actions are ignored while on setup. Random order/customer generation remains in action helpers outside reducers.

The gameplay dispatch callback is stable, avoiding unnecessary timer rescheduling on unrelated parent renders.

## Avatar, customer, and progression behavior

The registry is indexed by avatar and then display level. Female filenames are unchanged; male filenames use `player_frazzled_m_0.png` through `player_frazzled_m_4.png`. All character images retain contain rendering.

`avatarLevel` remains the final display authority: at failure 25, stored frazzled level is 0 but the displayed avatar is level 4 for either choice. Horror progression remains capped at background 5. Background images retain their horror-level key so the native image remounts when progression changes, including Restart from 5 to 0.

Customers 01–10 use the unchanged `randomCustomer` helper. Alternatives exclude the outgoing customer; a single available customer is still allowed to repeat, and an empty pool is rejected. All ten current files were confirmed as 1254 by 1254 RGBA PNGs. Recipe repetition remains allowed.

## Start, Restart, and Back to Start

- **Start Game:** selects a fresh visit and begins with the setup choices. The previous session's last customer is excluded when alternatives exist.
- **Restart:** remains on the game-over overlay. Immediately creates a fresh session with the same avatar/mode, zero counters/progression, cleared selection/feedback/reaction, and a fresh order and different customer.
- **Back to Start:** is available in gameplay, during reactions (including the final reaction), and on the game-over overlay. Discards the active session, returns to Female/Easy setup, and retains only the last customer ID for exclusion on the next start.

No duplicate New Game action was added. Restart is still supported by the reducer during an active session, as before, although its UI remains on the game-over overlay.

## Reaction and stale-action protection

Submission updates counters/progression and creates a new reaction object while retaining the outgoing customer and order. Input is locked during reactions. The screen scrolls to show the reacting customer, and schedules completion after the unchanged 1800 milliseconds.

The effect clears its timeout on cleanup. Back to Start unmounts the game screen, cancelling the timer. The application reducer ignores gameplay actions while on setup. A completion reaching a new or restarted session is also rejected unless its reaction object is identical to the active reaction. Objects are never reused between submissions/sessions.

At failure 25, gameplay locks immediately, the final background/avatar appear, and the incorrect reaction remains visible. Completion clears that reaction without generating another order/customer. The overlay stays derived from `game_over && reaction === null`.

## Recipe validation

The loader checks a nonempty catalog, object entries, nonempty string `id`, `name`, and `hard_name`, unique recipe IDs, nonempty ingredient arrays, supported ingredient IDs, and no repeated ingredients within a recipe. JSON import attributes and explicit TypeScript import extensions allow the same loader to run under Node's existing test runner and Metro. No JSON values were rewritten.

## Test coverage

All original 12 tests remain, with required Hard-name fixtures and session-option reset expectations updated. The suite now has 23 tests, including parameterized cases covering:

- Female/Easy defaults and absence of an active game/order on setup.
- All four avatar/mode combinations; copied settings and ignored setup actions during gameplay.
- Every failure boundary through 25, both final avatars, and counters across modes.
- Complete Restart and Back to Start behavior from normal gameplay, active reactions, final reactions, and the final overlay state.
- Stale completions ignored on setup, after a new start, and during a later reaction with identical customer/correctness values but a different object.
- Every customer and every alternative selection slot, plus the existing single/empty pool cases.
- Recipe repetition alongside customer rotation and distinct reaction objects.
- All 20 Easy/Hard names and correct/incorrect feedback, with mode-independent matching, counters, and reaction values.
- Catalog equality with JSON and documented recipe definitions; invalid schema cases.
- Literal registry paths, both avatar sets at every display level, backgrounds, sushi/ingredient coverage, and all ten customer canvas dimensions.

Registry tests evaluate its static maps with a path-checking require stub, without loading React Native or PNG modules in Node. They verify mapping, not native rendering.

## Verification results

Final source checks all passed:

```text
npm run typecheck                  PASS
npm test                           PASS — 23 tests, 0 failures
npx expo export --platform all      PASS — iOS, Android, web
 git diff --check                  PASS
```

Production output is under ignored `dist/`. Export checks bundling and asset resolution; it does not install native binaries. Node's existing module-type warning and Metro color-environment warnings are nonblocking. No dependency/module-system migration was made to suppress them.

The tracked diff was inspected. No existing Markdown, anything under `docs/`, `data/sushi.json`, artwork, `index.ts`, `tsconfig.json`, or GitHub workflow changed. This is the only new Markdown file.

## Manual checks still required

No automated browser interaction tool or installed browser test package was available. No interactive browser, simulator, or physical-device verification was performed. Reducer tests and exports do not verify visual appearance or actual timer presentation.

On phone/tablet and web, check:

1. Start-screen spacing, scroll access, radio selection states, and accessibility at larger text sizes.
2. All four setup combinations and long Hard-mode names in orders and feedback.
3. Both complete avatar sequences and all ten customers for framing and apparent scale.
4. Correct/incorrect outgoing-customer reactions and the 1.8-second delay.
5. Back to Start during an ordinary and final reaction, then immediately start again and check for stale effects.
6. Failure 25's final background/avatar, delayed overlay, Restart retaining options, and normal background restoration.
7. Back to Start restoring Female/Easy and customer exclusion across session boundaries.

## Protected documentation inconsistencies and limitations

Existing Markdown was deliberately left unchanged:

- `README.md` still describes 1.1.0 as in development/future additions rather than this completed implementation.
- `docs/GAME_CONCEPT.md` and `docs/ART_ASSETS.md` describe avatar selection from frazzled level without the final game-over level-4 override. The override from the working MVP is preserved.
- The concept document's simplified loop does not describe the full reaction delay or distinct same-options Restart behavior. This handoff records those details.
- `README-SKY.md` and `README-SKY2.md` are historical: their earlier test counts, fixed customers, immediate order advancement, and final-avatar descriptions are superseded by subsequent work. `README-SKY3.md` describes the five-customer MVP, while this handoff describes ten customers and the added setup flow.

The earlier analysis's mixed customer canvas sizes no longer apply: the supplied assets now all use 1254 by 1254 canvases, confirmed without editing them. Artwork optimization, persistent sessions, navigation history, audio, and native release packaging remain outside this change.
