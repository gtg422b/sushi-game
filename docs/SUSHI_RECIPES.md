# Sushi Recipes

## Overview

This document defines the sushi recipes available in Sushi Game.

This file is the authoritative source for:

* Sushi recipe IDs
* Easy-mode display names
* Hard-mode display names
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

## Difficulty-Based Display Names

Each recipe has one stable recipe ID and one ingredient set. Difficulty changes only the name shown in the customer's order; it does not change the recipe or its validation.

* **Easy mode** uses familiar English ingredient and roll names.
* **Hard mode** uses Japanese sushi terms written in Roman characters.

The selected game mode determines which display name is shown:

```text
EASY -> easy_name
HARD -> hard_name
```

Recipe IDs, sushi image filenames, ingredients, and validation rules remain identical in both modes.

---

## Ingredient IDs

The Current Game Vesion uses the following ingredient IDs:

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

**Easy Display Name**

```text
California Roll
```

**Hard Display Name**

```text
California Maki
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

**Easy Display Name**

```text
Salmon Nigiri
```

**Hard Display Name**

```text
Sake Nigiri
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

**Easy Display Name**

```text
Tuna Nigiri
```

**Hard Display Name**

```text
Maguro Nigiri
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

**Easy Display Name**

```text
Shrimp Nigiri
```

**Hard Display Name**

```text
Ebi Nigiri
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

**Easy Display Name**

```text
Eel Nigiri
```

**Hard Display Name**

```text
Unagi Nigiri
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

**Easy Display Name**

```text
Spicy Tuna Roll
```

**Hard Display Name**

```text
Spicy Maguro Maki
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

**Easy Display Name**

```text
Spicy Salmon Roll
```

**Hard Display Name**

```text
Spicy Sake Maki
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

**Easy Display Name**

```text
Philadelphia Roll
```

**Hard Display Name**

```text
Philadelphia Maki
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

**Easy Display Name**

```text
Cucumber Roll
```

**Hard Display Name**

```text
Kappa Maki
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

**Easy Display Name**

```text
Avocado Roll
```

**Hard Display Name**

```text
Avocado Maki
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

**Easy Display Name**

```text
Salmon Avocado Roll
```

**Hard Display Name**

```text
Sake Avocado Maki
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

**Easy Display Name**

```text
Tuna Avocado Roll
```

**Hard Display Name**

```text
Maguro Avocado Maki
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

**Easy Display Name**

```text
Shrimp Tempura Roll
```

**Hard Display Name**

```text
Ebi Tempura Maki
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

**Easy Display Name**

```text
Dragon Roll
```

**Hard Display Name**

```text
Dragon Maki
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

**Easy Display Name**

```text
Rainbow Roll
```

**Hard Display Name**

```text
Rainbow Maki
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

**Easy Display Name**

```text
Crab Roll
```

**Hard Display Name**

```text
Kani Maki
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

**Easy Display Name**

```text
Eel Avocado Roll
```

**Hard Display Name**

```text
Unagi Avocado Maki
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

**Easy Display Name**

```text
Salmon Cucumber Roll
```

**Hard Display Name**

```text
Sake Kyuri Maki
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

**Easy Display Name**

```text
Tuna Cucumber Roll
```

**Hard Display Name**

```text
Maguro Kyuri Maki
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

**Easy Display Name**

```text
Vegetable Roll
```

**Hard Display Name**

```text
Yasai Maki
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
easy_name
hard_name
ingredients
```

Example structure:

```json
{
  "id": "salmon_nigiri",
  "easy_name": "Salmon Nigiri",
  "hard_name": "Sake Nigiri",
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
* Easy mode displays each recipe's `easy_name`.
* Hard mode displays each recipe's `hard_name`.
* Difficulty does not change recipe IDs, ingredients, images, or validation.
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