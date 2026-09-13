# Sushi Game: Core MVP Progression

This document describes the progression update added to the existing Expo SDK 57, React Native, and TypeScript scaffold. It builds on the setup documented in `README-SKY.md`.

## 1. Scope of the update

The initial scaffold supported random orders, ingredient selection, submission feedback, and clearing ingredients. This update adds successful-customer and failure counters, visual progression, game over at 25 failures, and restarting.

The existing architecture remains in place: game rules live in `src/game`, and presentation lives in `src/screens`. No assets, recipe data, or existing documentation were deleted or moved.

## 2. Files changed

| File | Changes |
| --- | --- |
| `src/game/game.ts` | Extended state, added progression and initialization helpers, updated submission rules, added restart, and blocked gameplay after game over. |
| `src/screens/GameScreen.tsx` | Added counters, dynamic avatar/background selection, disabled controls after game over, and a GAME OVER overlay with Restart. |
| `src/game/game.test.ts` | Updated initialization in existing tests and added coverage for counters, progression, game over, and restart. |

`README-SKY2.md` was added afterward to document this work. No dependency or Expo configuration changes were needed for the progression update.

## 3. Extended the game state

`GameState` now contains:

| Field | Purpose | Initial value |
| --- | --- | --- |
| `order` | Current recipe requested by the customer. | Random recipe |
| `selected` | Selected ingredient IDs. | Empty array |
| `feedback` | Submission feedback text. | `null` |
| `successful_customers_served` | Number of correctly completed orders. | `0` |
| `failures` | Number of incorrect submissions. | `0` |
| `frazzled_level` | Player avatar state derived from failures. | `0` |
| `horror_level` | Restaurant background state derived from failures. | `0` |
| `game_over` | Whether the session has reached its failure limit. | `false` |

The new `createGameState(order)` helper constructs a fresh session. Both initial screen setup and Restart use it so their reset values stay consistent.

## 4. Added progression rules

The new `progression(failures)` helper calculates:

```ts
frazzled_level = failures % 5;
horror_level = Math.min(5, Math.floor(failures / 5));
game_over = failures >= 25;
```

These values are stored in state but calculated from the failure count rather than advanced independently.

| Failures | Horror level | Frazzled level | Game over |
| --- | --- | --- | --- |
| 0–4 | 0 | 0–4 | No |
| 5–9 | 1 | 0–4 | No |
| 10–14 | 2 | 0–4 | No |
| 15–19 | 3 | 0–4 | No |
| 20–24 | 4 | 0–4 | No |
| 25 | 5 | 0 | Yes |

Every fifth failure resets the avatar to frazzled level 0 and advances the background. The horror level is capped at 5 even if the helper receives a larger failure count. Normal gameplay stops accepting actions at failure 25.

## 5. Updated submission behavior

Ingredient validation continues to use exact set matching: all required ingredients must be present, extras fail, and selection order does not matter.

### Correct submission

1. Increment `successful_customers_served` by one.
2. Leave `failures` unchanged.
3. Derive the visual state from that unchanged failure count.
4. Replace the current order with a new random order.
5. Clear selected ingredients and show success feedback.

A successful order does not undo earlier mistakes or reverse visual progression.

### Incorrect submission

1. Increment `failures` by one.
2. Leave `successful_customers_served` unchanged.
3. Recalculate frazzled level, horror level, and game-over status.
4. Replace the current order with a new random order.
5. Clear selected ingredients and show mismatch feedback, or final-state feedback at game over.

The screen supplies the randomly selected next recipe in the action. Randomness remains outside the reducer, keeping state transitions deterministic and testable. A random order may repeat the preceding recipe.

As before, the screen disables Submit when no ingredients are selected. The reducer itself treats an empty selection as an incorrect recipe match.

## 6. Added game over at failure 25

At the 25th incorrect submission:

- `failures` becomes `25`.
- `horror_level` becomes `5`.
- `frazzled_level` becomes `0`.
- `game_over` becomes `true`.
- The final restaurant background, `background_horror_5.png`, is selected.
- Selected ingredients are cleared.
- A new order is assigned, consistent with the submission rule, but gameplay is locked.

The reducer ignores toggle, clear, and submit actions while `game_over` is true. This protects state even if an action is dispatched outside the disabled screen controls. Restart is handled before this guard so it remains available.

## 7. Updated the screen

`GameScreen` still uses React's `useReducer`, now initialized with `createGameState(randomOrder(recipes))`.

### Counters and images

- Added visible **Customers served** and **Failures** counters.
- Background selection now uses `state.horror_level` with the existing static registry.
- Player avatar selection now uses `state.frazzled_level` with the existing static registry.
- Customer selection and the ingredient-grid layout remain unchanged.

### Disabled controls and overlay

- Ingredient buttons are disabled after game over and expose that disabled state to accessibility tools.
- Submit is disabled after game over as well as when selection is empty.
- Clear is disabled after game over.
- A translucent overlay covers the screen, leaving the final background behind it.
- The overlay displays **GAME OVER**, the final failure/customer totals, and a **Restart** button.
- Underlying scroll content is hidden from accessibility navigation during game over using the relevant native properties, and the overlay is marked as modal for accessibility.

The overlay uses explicit absolute positioning. An initial attempt to use `StyleSheet.absoluteFillObject` failed TypeScript checking because that property is unavailable in this project's React Native types; explicit edges resolved the issue.

## 8. Added restart behavior

The new `restart` action accepts a fresh random recipe from the screen and returns `createGameState(nextOrder)`.

Restart resets:

```text
failures                    → 0
successful_customers_served  → 0
frazzled_level               → 0
horror_level                 → 0
game_over                   → false
selected                    → []
feedback                    → null
order                       → newly selected random recipe
```

The overlay disappears, normal artwork returns, and ingredient controls become usable again. The UI exposes Restart on the game-over overlay; the reducer also supports resetting an active session.

## 9. Expanded the tests

The suite now contains seven tests:

1. Exact recipe matching, including missing and extra ingredients.
2. Random recipe selection at both catalog boundaries and rejection of an empty catalog.
3. Ingredient toggling, clearing, and submission feedback.
4. Successful-customer increments without reducing existing failures.
5. Every failure from 1 through 25, checking counters, frazzled state, horror state, the game-over threshold, and ignored actions after game over.
6. Horror-level clamping beyond the final threshold.
7. Restarting a finished session, resetting all state, accepting input again, and clearing an active selection on restart.

These are reducer/helper tests. They do not automate tapping through the rendered screen on a device.

## 10. Verification performed

Ran:

```bash
npm run typecheck
npm test
npx expo export --platform all
```

Results:

- TypeScript passed after the overlay positioning correction.
- All seven tests passed.
- Production exports for iOS, Android, and web passed.

Also started the development server with:

```bash
npx expo start --go --offline --port 8085
```

Metro started successfully and reported that it was waiting at `http://localhost:8085`. Starting the server required running outside the environment's sandbox.

This verifies startup and bundling, not an actual iOS device launch or a visual inspection of all progression states. The offline server command was a local startup check; use the normal development workflow for phone testing.

## 11. Run and manually check the progression

Start the app using:

```bash
npm start
```

For iOS Expo Go, use a current compatible app and sign into the same Expo account in the CLI and on the phone, as documented in `README-SKY.md`.

Suggested manual checks:

1. Complete an order correctly and confirm Customers served increases.
2. Submit a nonempty incorrect selection and confirm Failures increases and the avatar changes.
3. Reach failure 5 and confirm the background advances while the avatar returns to level 0.
4. Continue to failure 25 and confirm the final background, GAME OVER overlay, and disabled gameplay.
5. Press Restart and confirm both counters reset, normal artwork returns, selection clears, and a new order is available.

## 12. Scope left unchanged

No timers, days, persistence, animations, or audio were added. Recipe data, artwork files, customer behavior, and the existing Expo / React Native / TypeScript architecture remain in place.
