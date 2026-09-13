# Art Assets

## Overview

This document defines the visual assets needed for Sushi Game.

For the MVP, the major visual systems are:

* Player avatar progression
* Background horror progression
* Customer sprites
* Sushi images
* Ingredient images
* Basic UI elements

Asset filenames should use consistent IDs so the artwork can be mapped directly to game data.

---

## Player Avatar Assets

Version `1.1.0` allows the player to select a female or male sushi-chef avatar from the start screen.

The selected avatar remains active for the entire game session.

The player avatar image is controlled by:

```text
selected_avatar
frazzled_level
```

Each avatar requires five frazzled states:

```text
frazzled_level 0 -> Normal
frazzled_level 1 -> Slightly frazzled
frazzled_level 2 -> Moderately frazzled
frazzled_level 3 -> Very frazzled
frazzled_level 4 -> Extremely frazzled
```

The female avatar uses the existing default filenames:

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

The correct player image is determined by the selected avatar.

```text
Female -> player_frazzled_<frazzled_level>.png
Male   -> player_frazzled_m_<frazzled_level>.png
```

Examples:

```text
Female at frazzled level 2 -> player_frazzled_2.png
Male at frazzled level 4   -> player_frazzled_m_4.png
```

The female avatar is the default avatar and retains the original player filenames for backward compatibility.

Each avatar should remain clearly recognizable as the same character across all five images.

The female and male avatars should use a consistent:

* Art style
* Scale
* Framing
* Chef uniform
* Frazzled progression

Increasing frazzled levels should communicate greater stress, exhaustion, panic, and disorganization.

All player-avatar images must be PNG files with transparent backgrounds.

---

## Background Assets

The game background is controlled by:

```text
horror_level
```

The MVP requires six background states.

```text
horror_level 0 -> Normal sushi restaurant
horror_level 1 -> Slightly unsettling
horror_level 2 -> Clearly disturbing
horror_level 3 -> Strong horror atmosphere
horror_level 4 -> Severe horror state
horror_level 5 -> MVP final horror state
```

Required files:

```text
background_horror_0.png
background_horror_1.png
background_horror_2.png
background_horror_3.png
background_horror_4.png
background_horror_5.png
```

Each background should represent the same restaurant so the player can clearly see the environment degrading over time.

The progression should feel gradual rather than making each horror level appear to be an entirely different location.

---

## Customer Assets

Customers appear individually and place sushi orders.

Version `1.1.0` requires ten customer sprites:

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

When practical, the game should avoid displaying the same customer twice in succession.

Customer selection does not affect:

* The requested sushi
* Required ingredients
* Recipe validation
* Game difficulty

All customer images should:

* Use a consistent cartoon art style
* Use similar scale and framing
* Show the complete character
* Use transparent backgrounds
* Remain visually distinct from one another

Future versions may include:

* Additional customer types
* Different customer expressions
* Horror-level-specific customer variants
* Special customers
* Boss customers

---

## Sushi Assets

The MVP will contain 20 sushi types.

Each sushi type requires one completed sushi image.

The recipe ID defined in:

```text
docs/SUSHI_RECIPES.md
```

should also be used as the sushi image filename.

For example:

```text
california_roll -> california_roll.png
salmon_nigiri -> salmon_nigiri.png
dragon_roll -> dragon_roll.png
```

The authoritative list of sushi recipes, recipe IDs, and required ingredients is maintained in:

```text
docs/SUSHI_RECIPES.md
```

Runtime recipe data is maintained in:

```text
data/sushi.json
```

Required sushi files for the MVP:

```text
california_roll.png
salmon_nigiri.png
tuna_nigiri.png
shrimp_nigiri.png
eel_nigiri.png
spicy_tuna_roll.png
spicy_salmon_roll.png
philadelphia_roll.png
cucumber_roll.png
avocado_roll.png
salmon_avocado_roll.png
tuna_avocado_roll.png
shrimp_tempura_roll.png
dragon_roll.png
rainbow_roll.png
crab_roll.png
eel_avocado_roll.png
salmon_cucumber_roll.png
tuna_cucumber_roll.png
vegetable_roll.png
```

---

## Ingredient Assets

Each ingredient used by an MVP recipe requires its own selectable image.

The MVP ingredient set is:

```text
rice
nori
salmon
tuna
shrimp
eel
crab
avocado
cucumber
cream_cheese
spicy_mayo
tempura_shrimp
```

Required files:

```text
ingredient_rice.png
ingredient_nori.png
ingredient_salmon.png
ingredient_tuna.png
ingredient_shrimp.png
ingredient_eel.png
ingredient_crab.png
ingredient_avocado.png
ingredient_cucumber.png
ingredient_cream_cheese.png
ingredient_spicy_mayo.png
ingredient_tempura_shrimp.png
```

Ingredient IDs used by the artwork must match the ingredient IDs defined in:

```text
docs/SUSHI_RECIPES.md
```

and:

```text
data/sushi.json
```

Ingredient images should be clear and easy to distinguish because they will function as interactive game controls.

---

## UI Assets

Version `1.1.0` requires a start screen and the existing gameplay interface.

### Start Screen

The start screen should include:

* Game title
* Female-avatar selection
* Male-avatar selection
* Easy-mode selection
* Hard-mode selection
* Start Game button

The player must select one avatar and one game mode before beginning the game.

The selected avatar and game mode remain fixed for the entire game session.

Starting a new game returns the player to the start screen and allows the player to make new selections.

Easy and Hard modes do not require separate sushi or ingredient artwork. Both modes use the same recipe IDs, sushi images, ingredient images, and validation rules. Only the sushi name displayed in the customer order changes.

### Gameplay Interface

The gameplay interface should include:

* Submit Order button
* Clear Ingredients button
* Current customer display
* Current order display
* Failure counter
* Successful customers served counter
* Ingredient selection area
* Player avatar display
* Customer sprite display
* Current sushi image
* New Game or Back to Start option

These interface elements should initially be implemented using the native UI components of the chosen application framework unless a custom image asset is specifically required.

The game should be designed so visual assets can be reused across web and mobile implementations where practical.

---

## Asset Directory Structure

```text
assets/
├── backgrounds/
│   ├── background_horror_0.png
│   ├── background_horror_1.png
│   ├── background_horror_2.png
│   ├── background_horror_3.png
│   ├── background_horror_4.png
│   └── background_horror_5.png
│
├── player/
│   ├── player_frazzled_0.png
│   ├── player_frazzled_1.png
│   ├── player_frazzled_2.png
│   ├── player_frazzled_3.png
│   ├── player_frazzled_4.png
│   ├── player_frazzled_m_0.png
│   ├── player_frazzled_m_1.png
│   ├── player_frazzled_m_2.png
│   ├── player_frazzled_m_3.png
│   └── player_frazzled_m_4.png
│
├── customers/
│   ├── customer_01.png
│   ├── customer_02.png
│   ├── customer_03.png
│   ├── customer_04.png
│   ├── customer_05.png
│   ├── customer_06.png
│   ├── customer_07.png
│   ├── customer_08.png
│   ├── customer_09.png
│   └── customer_10.png
│
├── sushi/
│   ├── california_roll.png
│   ├── salmon_nigiri.png
│   ├── tuna_nigiri.png
│   ├── shrimp_nigiri.png
│   ├── eel_nigiri.png
│   ├── spicy_tuna_roll.png
│   ├── spicy_salmon_roll.png
│   ├── philadelphia_roll.png
│   ├── cucumber_roll.png
│   ├── avocado_roll.png
│   ├── salmon_avocado_roll.png
│   ├── tuna_avocado_roll.png
│   ├── shrimp_tempura_roll.png
│   ├── dragon_roll.png
│   ├── rainbow_roll.png
│   ├── crab_roll.png
│   ├── eel_avocado_roll.png
│   ├── salmon_cucumber_roll.png
│   ├── tuna_cucumber_roll.png
│   └── vegetable_roll.png
│
└── ingredients/
    ├── ingredient_rice.png
    ├── ingredient_nori.png
    ├── ingredient_salmon.png
    ├── ingredient_tuna.png
    ├── ingredient_shrimp.png
    ├── ingredient_eel.png
    ├── ingredient_crab.png
    ├── ingredient_avocado.png
    ├── ingredient_cucumber.png
    ├── ingredient_cream_cheese.png
    ├── ingredient_spicy_mayo.png
    └── ingredient_tempura_shrimp.png
```

---

## MVP Art Requirements

The MVP requires:

* 5 player avatar states
* 6 background states
* 5 customer sprites
* 20 sushi images
* 12 ingredient images

Placeholder art may be used during early development, but filenames and IDs should remain consistent with this document.

---

## Asset Consistency Rules

To keep artwork, game data, and code aligned:

* Sushi filenames must match sushi recipe IDs.
* Ingredient filenames must match ingredient IDs using the `ingredient_` prefix.
* Player avatar filenames must correspond to `frazzled_level`.
* Background filenames must correspond to `horror_level`.
* Existing IDs should not be renamed without also updating the game data and any code references.

---

## Future Art Ideas

Potential future additions include:

* Animated player avatar
* Animated customers
* Horror-specific customer variants
* Multiple restaurant environments
* Day and night versions
* Special event backgrounds
* Additional horror levels
* Animated background elements
* Screen distortion effects
* Particle effects
* Custom UI artwork
* Order completion animations
* Failure animations
