# Game Concept

## Overview

Sushi Game is a simple sushi-making game with a horror progression mechanic.

Customers arrive and place sushi orders. The player must build the requested sushi using the correct ingredients.

Correct orders allow the restaurant to continue normally and increase the number of successfully served customers.

Incorrect orders increase the failure count and progressively make the player avatar and restaurant environment more unsettling.

The initial MVP will include a progression through 25 failures. Future versions may extend beyond this.

---

## Core Game Loop

1. A customer appears.
2. The customer places a random sushi order.
3. The player selects ingredients.
4. The player submits the order.
5. The game compares the selected ingredients to the requested recipe.
6. If correct:

   * The order is completed.
   * The successful customers served count increases by one.
   * A new customer/order is generated.
7. If incorrect:

   * The failure count increases.
   * The player's frazzled state and/or horror level changes.
   * The corresponding player avatar and/or background image is updated.
   * A new order begins.

---

## Orders

Customers order one sushi item at a time.

Orders are selected randomly from the sushi recipes currently available in the game.

The MVP may begin with only a few recipes during development.

The target initial recipe set is approximately 20 sushi types.

Recipe details are defined in:

```text
docs/SUSHI_RECIPES.md
```

Recipe data is stored in:

```text
data/sushi.json
```

---

## Building Sushi

The player creates sushi by selecting ingredients from the user interface.

A completed order consists of the ingredients currently selected by the player.

When the player presses the submit button, the selected ingredients are compared against the required ingredients for the customer's order.

The exact validation rules should remain simple for the MVP.

For example:

* Required ingredients must all be present.
* Extra ingredients should cause the order to fail.
* Ingredient order does not need to matter unless a future mechanic requires it.

---

## Successful Customers

The game tracks the total number of customers successfully served.

Each correctly completed order increases the successful customer count by one.

Incorrect orders do not increase the count.

For the MVP, this is a simple counter for the current game session.

```text
successful_customers_served += 1
```

This value should be visible in the user interface so the player can see how many customers they have successfully served.

---

## Failure System

The MVP tracks a total failure count.

Failures are grouped into sets of five.

Each set contains four player-avatar deterioration states followed by an environmental change.

### Frazzled Progression

Within each horror level:

* 0 failures within the level: normal state
* 1 failure: frazzled state 1
* 2 failures: frazzled state 2
* 3 failures: frazzled state 3
* 4 failures: frazzled state 4
* 5th failure: advance to the next horror level

The frazzled state can be calculated using:

```text
frazzled_level = failures % 5
```

---

## Horror Progression

Every fifth failure advances the environment to the next horror level.

For the MVP:

```text
Failures 0-4   -> Horror Level 0
Failures 5-9   -> Horror Level 1
Failures 10-14 -> Horror Level 2
Failures 15-19 -> Horror Level 3
Failures 20-24 -> Horror Level 4
Failure 25     -> Horror Level 5 / MVP Final State
```

The horror level can be calculated using:

```text
horror_level = floor(failures / 5)
```

Future versions may add additional horror levels beyond the MVP.

---

## Visual State

The game's visual progression is driven directly by two state values:

```text
frazzled_level
horror_level
```

These values control the two primary visual elements of the game.

### Player Avatar

The player avatar image is determined by `frazzled_level`.

As the player makes mistakes within the current horror level, the avatar becomes progressively more frazzled.

```text
frazzled_level 0 -> Normal player avatar
frazzled_level 1 -> Frazzled avatar 1
frazzled_level 2 -> Frazzled avatar 2
frazzled_level 3 -> Frazzled avatar 3
frazzled_level 4 -> Frazzled avatar 4
```

The avatar should visually communicate increasing stress, exhaustion, panic, or disorganization.

When the fifth failure occurs and the game advances to the next horror level, `frazzled_level` returns to 0 and the player avatar returns to its normal frazzled state for the new horror level.

### Background

The primary game background image is determined by `horror_level`.

Every fifth failure increases the horror level and changes the restaurant background to a progressively scarier version.

```text
horror_level 0 -> Normal restaurant background
horror_level 1 -> Horror background 1
horror_level 2 -> Horror background 2
horror_level 3 -> Horror background 3
horror_level 4 -> Horror background 4
horror_level 5 -> MVP final horror background
```

The background should be the primary way the overall horror progression is communicated to the player.

Future versions may also use `horror_level` to affect other visual or audio elements such as:

* Customers
* Lighting
* Music
* Sound effects
* Animations
* Environmental details

Exact art assets are defined separately in:

```text
docs/ART_ASSETS.md
```

---

## Game State

At minimum, the game should track:

```text
current_order
selected_ingredients
failures
horror_level
frazzled_level
successful_customers_served
```

Additional state can be added as the game develops.

---

## MVP Scope

The first playable MVP should include:

* One customer at a time
* Random sushi orders
* Ingredient selection
* Submit order
* Correct/incorrect validation
* Failure counter
* Successful customers served counter
* Frazzled player avatar progression
* Horror background progression
* A small set of working sushi recipes

The goal of the MVP is to prove the core game loop before adding more content.

---

## Future Ideas

Potential future additions include:

* More than 25 failures
* Additional horror levels
* More sushi recipes
* Different customer types
* Customer patience timers
* Combo scoring
* Increasing difficulty
* Ingredient animations
* Sound effects
* Music that changes with horror level
* Special events
* Boss customers
* Multiple orders at once
* Unlockable recipes
* Different restaurant environments
* Day-based progression
* A required number of customers to successfully serve each day
* Increasing customer targets as days progress
* Completing a day to unlock the next day
* Different difficulty or events depending on the day
* End-of-day summaries showing customers served and failures
* Longer-term progression across multiple days
