# Sushi Recipes

## Overview

This document defines the sushi recipes available in Sushi Game.

For the MVP, the game will contain 20 sushi recipes.

This file is the authoritative source for:

* Sushi recipe IDs
* Sushi display names
* Required ingredients
* Ingredient IDs

The same IDs should be used consistently across:

* Documentation
* Runtime game data
* Code
* Sushi image filenames
* Ingredient image filenames

Runtime recipe data will be stored in:

```text
data/sushi.json
```

Artwork requirements are defined in:

```text
docs/ART_ASSETS.md
```

---

## Ingredient IDs

The MVP uses the following ingredient IDs:

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

These ingredient IDs should remain consistent in:

* Recipe definitions
* `data/sushi.json`
* Game logic
* Ingredient asset filenames

Ingredient image filenames use the following format:

```text
ingredient_<ingredient_id>.png
```

Example:

```text
ingredient_salmon.png
ingredient_avocado.png
ingredient_spicy_mayo.png
```

---

# Recipes

## California Roll

**ID**

```text
california_roll
```

**Display Name**

```text
California Roll
```

**Ingredients**

```text
rice
nori
crab
avocado
cucumber
```

---

## Salmon Nigiri

**ID**

```text
salmon_nigiri
```

**Display Name**

```text
Salmon Nigiri
```

**Ingredients**

```text
rice
salmon
```

---

## Tuna Nigiri

**ID**

```text
tuna_nigiri
```

**Display Name**

```text
Tuna Nigiri
```

**Ingredients**

```text
rice
tuna
```

---

## Shrimp Nigiri

**ID**

```text
shrimp_nigiri
```

**Display Name**

```text
Shrimp Nigiri
```

**Ingredients**

```text
rice
shrimp
```

---

## Eel Nigiri

**ID**

```text
eel_nigiri
```

**Display Name**

```text
Eel Nigiri
```

**Ingredients**

```text
rice
eel
```

---

## Spicy Tuna Roll

**ID**

```text
spicy_tuna_roll
```

**Display Name**

```text
Spicy Tuna Roll
```

**Ingredients**

```text
rice
nori
tuna
spicy_mayo
```

---

## Spicy Salmon Roll

**ID**

```text
spicy_salmon_roll
```

**Display Name**

```text
Spicy Salmon Roll
```

**Ingredients**

```text
rice
nori
salmon
spicy_mayo
```

---

## Philadelphia Roll

**ID**

```text
philadelphia_roll
```

**Display Name**

```text
Philadelphia Roll
```

**Ingredients**

```text
rice
nori
salmon
cream_cheese
cucumber
```

---

## Cucumber Roll

**ID**

```text
cucumber_roll
```

**Display Name**

```text
Cucumber Roll
```

**Ingredients**

```text
rice
nori
cucumber
```

---

## Avocado Roll

**ID**

```text
avocado_roll
```

**Display Name**

```text
Avocado Roll
```

**Ingredients**

```text
rice
nori
avocado
```

---

## Salmon Avocado Roll

**ID**

```text
salmon_avocado_roll
```

**Display Name**

```text
Salmon Avocado Roll
```

**Ingredients**

```text
rice
nori
salmon
avocado
```

---

## Tuna Avocado Roll

**ID**

```text
tuna_avocado_roll
```

**Display Name**

```text
Tuna Avocado Roll
```

**Ingredients**

```text
rice
nori
tuna
avocado
```

---

## Shrimp Tempura Roll

**ID**

```text
shrimp_tempura_roll
```

**Display Name**

```text
Shrimp Tempura Roll
```

**Ingredients**

```text
rice
nori
tempura_shrimp
avocado
```

---

## Dragon Roll

**ID**

```text
dragon_roll
```

**Display Name**

```text
Dragon Roll
```

**Ingredients**

```text
rice
nori
tempura_shrimp
avocado
eel
```

---

## Rainbow Roll

**ID**

```text
rainbow_roll
```

**Display Name**

```text
Rainbow Roll
```

**Ingredients**

```text
rice
nori
crab
avocado
cucumber
salmon
tuna
shrimp
```

---

## Crab Roll

**ID**

```text
crab_roll
```

**Display Name**

```text
Crab Roll
```

**Ingredients**

```text
rice
nori
crab
```

---

## Eel Avocado Roll

**ID**

```text
eel_avocado_roll
```

**Display Name**

```text
Eel Avocado Roll
```

**Ingredients**

```text
rice
nori
eel
avocado
```

---

## Salmon Cucumber Roll

**ID**

```text
salmon_cucumber_roll
```

**Display Name**

```text
Salmon Cucumber Roll
```

**Ingredients**

```text
rice
nori
salmon
cucumber
```

---

## Tuna Cucumber Roll

**ID**

```text
tuna_cucumber_roll
```

**Display Name**

```text
Tuna Cucumber Roll
```

**Ingredients**

```text
rice
nori
tuna
cucumber
```

---

## Vegetable Roll

**ID**

```text
vegetable_roll
```

**Display Name**

```text
Vegetable Roll
```

**Ingredients**

```text
rice
nori
avocado
cucumber
```

---

# Recipe Validation

For the MVP, recipe validation should remain simple.

A submitted sushi order is correct when:

* Every required ingredient is selected.
* No additional ingredients are selected.
* Ingredient order does not matter.
* Duplicate ingredients are not required.

The selected ingredient set must exactly match the recipe ingredient set.

Example:

```text
Order:
salmon_nigiri

Required:
rice
salmon
```

This is correct:

```text
rice
salmon
```

This is incorrect:

```text
rice
salmon
avocado
```

This is also incorrect:

```text
salmon
```

---

# Sushi Image Mapping

Each recipe requires one completed sushi image.

The image filename should match the recipe ID.

Example:

```text
california_roll -> california_roll.png
salmon_nigiri -> salmon_nigiri.png
dragon_roll -> dragon_roll.png
```

Sushi artwork is stored under:

```text
assets/sushi/
```

The complete asset requirements are defined in:

```text
docs/ART_ASSETS.md
```

---

# Runtime Data

The actual game should load recipe data from:

```text
data/sushi.json
```

The JSON data should use the same IDs and ingredient definitions documented here.

A recipe should contain at minimum:

```text
id
name
ingredients
```

Example structure:

```json
{
  "id": "salmon_nigiri",
  "name": "Salmon Nigiri",
  "ingredients": [
    "rice",
    "salmon"
  ]
}
```

---

# MVP Rules

For the initial MVP:

* There are 20 available sushi recipes.
* Customers request one sushi item at a time.
* Customer orders are selected randomly from the available recipes.
* The player selects ingredients from the ingredient list.
* The player submits the completed order.
* Correct orders increase `successful_customers_served`.
* Incorrect orders increase `failures`.

Recipe selection and failure progression are defined in:

```text
docs/GAME_CONCEPT.md
```

---

# Future Recipe Ideas

Future versions may add:

* Additional sushi recipes
* More ingredients
* Ingredient quantities
* Multiple pieces per order
* Multi-step preparation
* Sauces and toppings
* Cooked versus raw ingredients
* Ingredient preparation steps
* Recipe unlocks
* Day-specific recipes
* Difficulty-based recipes
* Rare customer orders
* Special-event recipes
