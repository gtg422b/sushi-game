# Game Concept

## Overview

Sushi Game is a simple sushi-making game with a horror progression mechanic.

Customers arrive and place sushi orders. The player must build the requested sushi using the correct ingredients.

Correct orders allow the restaurant to continue normally and increase the number of successfully served customers.

Incorrect orders increase the failure count and progressively make the player avatar and restaurant environment more unsettling.

The initial MVP will include a progression through 25 failures. Future versions may extend beyond this.

---
## Version 1.1.0 Game Setup

Version `1.1.0` adds a start screen that appears before gameplay begins.

The player must select:

* A sushi-chef avatar
* A game mode

### Avatar Selection

The available avatar choices are:

```text
female
male
```

The female avatar is the default selection.

The selected avatar remains active for the entire game session and determines which set of frazzled player images is used.

```text
Female -> player_frazzled_<frazzled_level>.png
Male   -> player_frazzled_m_<frazzled_level>.png
```
---

### Game-Mode Selection

The available game modes are:

```text
easy
hard
```

The selected game mode determines which sushi name is displayed in customer orders.

```text
Easy -> name
Hard -> hard_name
```

Easy mode uses the recipe's existing `name` field and displays familiar English sushi names.

Hard mode uses the recipe's `hard_name` field and displays Japanese sushi terminology written in Roman characters.

Example:

```text
Easy -> Shrimp Nigiri
Hard -> Ebi Nigiri
```

Game mode changes only the displayed order name. It does not change:

* Recipe IDs
* Required ingredients
* Sushi images
* Recipe validation
* Failure progression
* Horror progression

The existing `name` field is retained so the original game continues working before the mode-selection code is implemented.

The selected avatar and game mode remain fixed until the player starts a new game.

---

## Core Game Loop

1. The start screen appears.
2. The player selects a female or male sushi-chef avatar.
3. The player selects Easy or Hard mode.
4. The player starts the game.
5. A customer appears.
6. The customer places a random sushi order.
7. The order name is displayed using the selected game mode.
8. The player selects ingredients.
9. The player submits the order.
10. The game compares the selected ingredients to the requested recipe.
11. If correct:

    * The order is completed.
    * The successful customers served count increases by one.
    * A new customer and order are generated.
12. If incorrect:

    * The failure count increases.
    * The player's frazzled state and/or horror level changes.
    * The corresponding player-avatar and/or background image is updated.
    * A new customer and order are generated.
13. The game continues until the player starts a new game or reaches the current final state.

---

## Orders

Customers order one sushi item at a time.

Orders are selected randomly from the 20 sushi recipes available in the game.

Each recipe contains:

```text
id
name
hard_name
ingredients
```

The selected game mode determines which recipe name is displayed:

```text
easy -> name
hard -> hard_name
```

The underlying recipe ID and required ingredients remain the same in both modes.

Example:

```text
Recipe ID: shrimp_nigiri
Easy name: Shrimp Nigiri
Hard name: Ebi Nigiri
Ingredients: rice, shrimp
```

Recipe details are defined in:

```text
docs/SUSHI_RECIPES.md
```

Recipe data is stored in:

```text
data/sushi.json
```

---

## Customer Selection

Version `1.1.0` includes ten customer characters:

```text
customer_01.png
customer_02.png
customer_03.png
customer_04.png
customer_05.png
customer_06.png
customer_07.png
customer_08.png
customer_09.png
customer_10.png
```

A customer is randomly selected whenever a new order begins.

When practical, the newly selected customer should not be the same as the previous customer.

Customer selection is visual only. A customer's appearance does not affect:

* The requested recipe
* Required ingredients
* Recipe validation
* Game mode
* Failure progression

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

The player avatar is determined by:

```text
selected_avatar
frazzled_level
```

The player selects the female or male avatar on the start screen.

The female avatar uses the original default filenames:

```text
player_frazzled_0.png
player_frazzled_1.png
player_frazzled_2.png
player_frazzled_3.png
player_frazzled_4.png
```

The male avatar uses:

```text
player_frazzled_m_0.png
player_frazzled_m_1.png
player_frazzled_m_2.png
player_frazzled_m_3.png
player_frazzled_m_4.png
```

The filename is selected using:

```text
Female -> player_frazzled_<frazzled_level>.png
Male   -> player_frazzled_m_<frazzled_level>.png
```

The frazzled progression is:

```text
frazzled_level 0 -> Normal player avatar
frazzled_level 1 -> Frazzled avatar 1
frazzled_level 2 -> Frazzled avatar 2
frazzled_level 3 -> Frazzled avatar 3
frazzled_level 4 -> Frazzled avatar 4
```

The avatar should visually communicate increasing stress, exhaustion, panic, or disorganization.

When the fifth failure occurs, the game advances to the next horror level. `frazzled_level` returns to `0`, and the selected avatar returns to its normal state.

The selected avatar does not change when the frazzled level resets.

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
current_customer
previous_customer
selected_ingredients
selected_avatar
game_mode
failures
horror_level
frazzled_level
successful_customers_served
game_started
```

### Setup State

```text
selected_avatar = female | male
game_mode = easy | hard
game_started = true | false
```

The female avatar should be the default avatar selection.

Easy mode should be the default game-mode selection.

### Customer State

```text
current_customer
previous_customer
```

`previous_customer` may be used to prevent the same customer from being selected twice in succession.

### Session Reset

Starting a new game should:

* Return the player to the start screen
* Clear the current order
* Clear selected ingredients
* Reset failures to `0`
* Reset `horror_level` to `0`
* Reset `frazzled_level` to `0`
* Reset successful customers served to `0`
* Allow the player to choose a new avatar
* Allow the player to choose a new game mode

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

## Version 1.1.0 Scope

Version `1.1.0` adds:

* A start screen
* Female and male sushi-chef selection
* Five frazzled states for each avatar
* Easy and Hard game modes
* English sushi names in Easy mode
* Japanese sushi terminology in Hard mode
* Ten rotating customer characters
* Protection against immediately repeating the same customer
* A New Game or Back to Start option

Version `1.1.0` does not change:

* The number of available recipes
* Recipe ingredients
* Recipe validation
* Failure calculations
* Frazzled-level calculations
* Horror-level calculations
* Background progression

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
