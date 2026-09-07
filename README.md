# Sushi Game

A simple sushi-making game with a light horror progression.

Customers arrive and place random sushi orders. The player builds each order by selecting the correct ingredients and submitting it.

Correct orders keep the restaurant running smoothly.

Mistakes make things progressively worse.

## Core Game Loop

1. A customer appears.
2. The customer orders one of the available sushi recipes.
3. The player selects ingredients.
4. The player submits the order.
5. The game checks whether the selected ingredients match the recipe.
6. A correct order moves on to the next customer.
7. An incorrect order increases the failure count.

## Failure Progression

For the **initial MVP**, the game will support a 25-failure progression.

Failures are grouped into sets of five.

Within each set:

* Failure 1: character becomes slightly frazzled
* Failure 2: character becomes more frazzled
* Failure 3: character becomes increasingly stressed
* Failure 4: character reaches the most frazzled state
* Failure 5: the environment advances to the next horror level

After every fifth failure, the background and overall atmosphere become scarier.

The MVP will include five horror progression levels:

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

The full game will contain approximately **20 sushi recipes**.

Each recipe defines:

* Name
* Required ingredients
* Sushi image

Recipe data will be maintained in:

```text
data/sushi.json
```

Additional design notes can be found in:

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

The first playable version should stay very small.

It should include:

* One customer at a time
* Three sushi recipes
* Ingredient selection
* Submit button
* Correct/incorrect validation
* Failure counter
* Frazzled character states
* Basic horror-level progression

Once the basic loop works, the game can expand to all 20 sushi recipes and additional artwork, customers, sounds, animations, and horror effects.

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

Initial project setup and game design.
