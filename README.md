# Sushi Game

A simple sushi-making game with a light horror progression.

Customers arrive and place random sushi orders. The player builds each order by selecting the correct ingredients and submitting it.

Correct orders keep the restaurant running smoothly.

Mistakes make things progressively worse.

## Core Game Loop

1. The player selects a female or male sushi-chef avatar.
2. The player selects Easy or Hard mode.
3. The player starts the game.
4. A customer appears.
5. The customer orders one of the available sushi recipes.
6. The order name is displayed using the selected game mode.
7. The player selects ingredients.
8. The player submits the order.
9. The game checks whether the selected ingredients match the recipe.
10. A correct order increases the successful customers served count and moves to the next customer.
11. An incorrect order increases the failure count.

## Failure Progression

The initial MVP supports a 25-failure progression.

Failures are grouped into sets of five.

Within each set:

* Failure 1: character becomes slightly frazzled
* Failure 2: character becomes more frazzled
* Failure 3: character becomes increasingly stressed
* Failure 4: character reaches the most frazzled state
* Failure 5: the environment advances to the next horror level

After every fifth failure, the background and overall atmosphere become scarier.

The MVP includes six background states across five horror-level increases:

```text
Failures 0-4   -> Horror Level 0
Failures 5-9   -> Horror Level 1
Failures 10-14 -> Horror Level 2
Failures 15-19 -> Horror Level 3
Failures 20-24 -> Horror Level 4
Failure 25     -> Horror Level 5 / MVP Final State
```

The game state can be derived from the total number of failures:

```text
horror_level = floor(failures / 5)
frazzled_level = failures % 5
```

Future versions may extend the game beyond 25 failures with additional horror levels, character states, environments, mechanics, and progression.


## Sushi

The game contains 20 sushi recipes.

Each recipe defines:

* A stable recipe ID
* An Easy-mode display name
* A Hard-mode display name
* Required ingredients
* A sushi image

Easy mode uses familiar English sushi names. Hard mode uses Japanese sushi terminology written in Roman characters.

Game mode changes only the displayed order name. It does not change the required ingredients, sushi image, or recipe validation.

Recipe data is maintained in:

```text
data/sushi.json
```

Additional design details are defined in:

```text
docs/SUSHI_RECIPES.md
```

## Visual Progression

The game will use two main types of visual progression.

### Character

The player character becomes progressively more frazzled after each mistake within the current horror level.

The character will have several visual states ranging from normal to extremely stressed.

### Environment

Every fifth mistake changes the restaurant environment.

Possible changes may include:

* Darker lighting
* Strange objects appearing
* Customers becoming unsettling
* Background details changing
* Visual distortion
* Increasingly creepy restaurant surroundings

Asset planning will be maintained in:

```text
docs/ART_ASSETS.md
```

## Initial MVP

The first playable version was intentionally kept small.

It includes:

* One customer at a time
* Twenty sushi recipes
* Ingredient selection
* Submit button
* Correct/incorrect validation
* Failure counter
* Successful customers served counter
* Frazzled character states
* Basic horror-level progression

## Current Development — Version 1.1.0

Development is now focused on version `1.1.0`.

Version `1.1.0` will add:

* A new start screen
* Male and female sushi-chef avatar selection
* Five frazzled states for each avatar
* Easy and Hard game-mode selection
* Familiar English sushi names in Easy mode
* Japanese sushi terminology in Hard mode
* Ten rotating customer characters, increased from the original five

The female chef remains the default avatar and uses the original player filenames:

```text
player_frazzled_0.png through player_frazzled_4.png
```

The male chef uses:

```text
player_frazzled_m_0.png through player_frazzled_m_4.png
```

Difficulty changes only the sushi names displayed in customer orders. Recipe IDs, required ingredients, sushi artwork, and order validation remain the same in both modes.

Example:

```text
Easy: Shrimp Nigiri
Hard: Ebi Nigiri
```


## Project Structure

```text
sushi-game/
├── README.md
├── docs/
│   ├── GAME_CONCEPT.md
│   ├── SUSHI_RECIPES.md
│   └── ART_ASSETS.md
├── data/
│   └── sushi.json
└── src/
```

## Current Status

Developing Version 1.1.0
