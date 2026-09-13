# Sushi Game: Customer Rotation, Reactions, and Restart Rendering

This document describes the update following the core MVP progression in `README-SKY2.md`. The project continues to use Expo SDK 57, React Native, and TypeScript.

## 1. Scope

This round adds customer rotation, temporary customer reactions, and protection against stale background rendering after Restart. It also adjusts the final game-over appearance and prevents generating another order or customer after failure 25.

Game rules remain in `src/game`, presentation remains in `src/screens`, and image references remain in the static asset registry. No assets, recipe data, or existing documents were moved or deleted. No dependencies were added.

## 2. Files changed

| File | Purpose of the changes |
| --- | --- |
| `src/game/game.ts` | Added customer IDs, customer selection, reaction state, delayed order advancement, restart action generation, stale-action protection, and final-avatar selection. |
| `src/game/game.test.ts` | Expanded the suite to 12 tests covering customer selection, reaction sequencing, final-state behavior, and complete restart resets. |
| `src/screens/GameScreen.tsx` | Displays the active customer, shows temporary reactions, schedules reaction completion, disables input during reactions, and renders a background image whose lifecycle follows the horror level. |
| `src/assets/registry.ts` | Types the customer registry against `CustomerId`, ensuring all supported customers have image mappings. Existing image paths remain in place. |

`README-SKY3.md` was added afterward to document this round.

## 3. Added customer IDs and selection rules

`src/game/game.ts` now exports these five customer IDs:

```text
customer_01
customer_02
customer_03
customer_04
customer_05
```

The `CustomerId` type is derived from this list. `GameState.customer_id` stores the active customer's identity.

The `randomCustomer(previous, random, available)` helper:

1. Rejects an empty customer list.
2. Removes the previous customer from the selection pool when alternatives exist.
3. Randomly selects from that pool.
4. Allows the same customer if it is the only available choice.

The random function and available list can be supplied in tests. Normal gameplay uses `Math.random` and all five customers.

Initial screen setup independently selects a random recipe and customer. Restart selects another random customer while excluding the customer from the previous session. Recipes can still repeat randomly; the no-repeat rule applies to customers.

## 4. Added reaction state

`GameState` now includes:

```ts
customer_id: CustomerId;
reaction: CustomerReaction | null;
```

A reaction records the customer whose order was submitted and whether the selection was correct:

```ts
type CustomerReaction = {
  customer_id: CustomerId;
  correct: boolean;
};
```

`createGameState(order, customer_id)` initializes a session with the supplied order and customer, empty selection, no feedback, no reaction, zero counters, normal visual levels, and `game_over: false`.

## 5. Separated submission from advancing the order

Previously, Submit immediately replaced the order. Now submission and advancing to the next customer happen in two stages.

### Stage A: Submit

The `submit` action no longer carries a new recipe. The reducer:

1. Validates the selected ingredients against the current order.
2. Increments either the success count or the failure count.
3. Recalculates progression and game-over status.
4. Clears selected ingredients.
5. Updates the existing bottom feedback text.
6. Creates a reaction for the current customer.
7. Retains the current order and customer while the reaction is visible.

This ensures the reaction belongs to the customer who actually received the submitted order.

### Stage B: Finish the reaction

The screen waits 1.8 seconds, then calls `finishReactionAction(state, recipes)` and dispatches its result.

For an active session, this helper generates a new random order and a different random customer. The reducer installs both and clears the reaction. Bottom submission feedback remains until the next ingredient interaction or Clear action, matching the existing behavior.

At game over, the helper generates neither a recipe nor a customer. It returns an action that only clears the final reaction.

Random generation happens in helpers outside the reducer so the reducer remains deterministic and testable.

## 6. Added the reaction presentation

The screen displays a large message over the outgoing customer image:

| Submission | Message | Color |
| --- | --- | --- |
| Correct | `THANK YOU!` | Bright green, `#39ff14` |
| Incorrect | `THIS IS NOT WHAT I ORDERED!` | Bright red, `#ff3030` |

The message sits on a dark translucent panel for contrast and disappears after 1.8 seconds. No animation library or animated transition is used.

On phones, Submit can be below the customer image in the scrollable layout. When a reaction begins, the screen scrolls directly to the top with `animated: false` so the reacting customer is visible.

During a reaction:

- Ingredient selection is disabled.
- Submit is disabled.
- Clear is disabled.
- The reducer also ignores those actions, preventing duplicate submissions even if an action bypasses the UI.

The existing bottom feedback text remains in the screen. The temporary customer message supplements it.

## 7. Protected reaction sequencing from stale callbacks

The reaction timer is created in a React effect. Its cleanup calls `clearTimeout`, so a state change, Restart, or unmount cancels the pending timer.

Each `finishReaction` action also carries the reaction object it was created for. The reducer accepts completion only if that object is still the active reaction.

This guards against an older callback advancing a restarted session or clearing a later customer's reaction. The state checks supplement timer cleanup rather than depending on timing alone.

No timers unrelated to displaying the temporary reaction were added.

## 8. Updated failure-25 behavior

The 25th failure immediately sets `game_over: true` and selects horror background 5. Gameplay is locked immediately.

The final customer remains visible long enough to show the incorrect-order reaction. After 1.8 seconds, the reaction clears and the GAME OVER overlay appears. No next customer or sushi order is generated.

The new `avatarLevel(state)` helper returns:

```ts
state.game_over ? 4 : state.frazzled_level
```

This displays `player_frazzled_4.png` during game over. The underlying `frazzled_level` still follows `failures % 5`, so its stored value at failure 25 is 0; the final avatar is an explicit game-over display rule.

The GAME OVER overlay remains derived from game state:

```ts
state.game_over && state.reaction === null
```

There is no separate local overlay flag to survive Restart.

## 9. Investigated the restart-background bug

The reported symptom was that Restart reset the game state but left the final horror background visible.

Inspection found that the existing reducer already reset `horror_level` to 0, and the existing screen already looked up the background using that state value. No incorrect reset calculation was found.

The exact native rendering cause was not reproduced on a device in this environment. Retention of the previous native image was a suspected rendering issue, not a confirmed root cause.

### Rendering change

The screen now uses a separate background `Image` behind the game content instead of wrapping the content in `ImageBackground`.

Its source continues to come directly from the static registry and `state.horror_level`:

```tsx
const activeBackground =
  backgrounds[state.horror_level as keyof typeof backgrounds];

<Image
  key={state.horror_level}
  source={activeBackground}
  style={styles.backgroundImage}
  resizeMode="cover"
/>
```

The state-derived key replaces the image component whenever the horror level changes, including level 5 to level 0 on Restart. Only the image is remounted; the screen and its reducer are not remounted by a background change.

This removes reuse of the previous background image view across levels. It is a general state-driven rendering fix, not a one-time hardcoded reset or a separate local background value.

On-device confirmation of the reported symptom remains outstanding.

## 10. Restart behavior after this update

`restartAction(state, recipes)` chooses a random order and a random customer different from the previous customer. The reducer then calls `createGameState` with those values.

Restart resets:

| Value | Result |
| --- | --- |
| `failures` | `0` |
| `successful_customers_served` | `0` |
| `frazzled_level` | `0` |
| `horror_level` | `0` |
| `game_over` | `false` |
| `selected` | Empty array |
| `feedback` | `null` |
| `reaction` | `null` |
| `order` | Newly selected random recipe |
| `customer_id` | Newly selected random customer, excluding the previous one |

As a result, the screen selects `background_horror_0.png` and `player_frazzled_0.png`, removes the overlay, clears the reaction, and enables gameplay. Expired reaction actions cannot overwrite this fresh state.

## 11. Test coverage

The suite now contains 12 tests covering:

1. Exact ingredient matching and missing/extra ingredient rejection.
2. Random recipe selection and empty-catalog rejection.
3. Initial customer selection, state storage, and availability of all five customers.
4. Avoiding consecutive customer repeats, with single-customer fallback and empty-list rejection.
5. Ingredient toggling and clearing.
6. Correct reactions belonging to the outgoing customer, followed by customer/order advancement.
7. Incorrect reactions belonging to the outgoing customer, followed by customer/order advancement.
8. Success preserving previous failures and progression.
9. Every failure boundary through 25, horror clamping, and the final avatar rule.
10. Game over retaining the final order/customer without invoking random generation.
11. Restart restoring normal state, horror level 0, avatar level 0, a new customer, cleared reaction, and usable controls.
12. Stale reaction completion being ignored after Restart and during a later reaction.

The tests exercise game logic and state transitions. They do not provide native screenshot assertions or automate a physical phone.

## 12. Verification results

Ran the requested commands after implementation:

```bash
npm run typecheck
npm test
npx expo export --platform all
```

Results:

- TypeScript passed.
- All 12 tests passed.
- iOS export passed.
- Android export passed.
- Web export passed.

Exports were generated under ignored `dist/`. Bundling verifies source and asset resolution, but does not replace on-device visual testing.

## 13. Suggested manual checks

Start the app with `npm start`, then:

1. Submit a correct order and confirm the current customer shows the green reaction before changing.
2. Submit an incorrect order and confirm the current customer shows the red reaction before changing.
3. Confirm consecutive orders use different customers.
4. Confirm controls cannot submit twice during a reaction.
5. Reach failure 25 and confirm background 5 and avatar 4 appear, the final customer reacts, and then GAME OVER appears without a new order/customer.
6. Press Restart and confirm normal background/avatar, zero counters, a different customer, a fresh order, and no lingering reaction or overlay.

## 14. Scope preserved

No audio, day progression, persistence, animation libraries, or complex transitions were added. The only new timer controls the temporary customer reaction. Existing recipe rules, progression counters, ingredient layout, and asset files remain in place.
