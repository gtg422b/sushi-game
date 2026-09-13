import type { ImageSourcePropType } from 'react-native';
import type { CustomerId, IngredientId } from '../game/game';

export const backgrounds = {
  0: require('../../assets/backgrounds/background_horror_0.png'),
  1: require('../../assets/backgrounds/background_horror_1.png'),
  2: require('../../assets/backgrounds/background_horror_2.png'),
  3: require('../../assets/backgrounds/background_horror_3.png'),
  4: require('../../assets/backgrounds/background_horror_4.png'),
  5: require('../../assets/backgrounds/background_horror_5.png'),
} satisfies Record<string, ImageSourcePropType>;

export const playerAvatars = {
  0: require('../../assets/player/player_frazzled_0.png'),
  1: require('../../assets/player/player_frazzled_1.png'),
  2: require('../../assets/player/player_frazzled_2.png'),
  3: require('../../assets/player/player_frazzled_3.png'),
  4: require('../../assets/player/player_frazzled_4.png'),
} satisfies Record<string, ImageSourcePropType>;

export const customers = {
  customer_01: require('../../assets/customers/customer_01.png'),
  customer_02: require('../../assets/customers/customer_02.png'),
  customer_03: require('../../assets/customers/customer_03.png'),
  customer_04: require('../../assets/customers/customer_04.png'),
  customer_05: require('../../assets/customers/customer_05.png'),
} satisfies Record<CustomerId, ImageSourcePropType>;

export const sushiImages = {
  avocado_roll: require('../../assets/sushi/avocado_roll.png'),
  california_roll: require('../../assets/sushi/california_roll.png'),
  crab_roll: require('../../assets/sushi/crab_roll.png'),
  cucumber_roll: require('../../assets/sushi/cucumber_roll.png'),
  dragon_roll: require('../../assets/sushi/dragon_roll.png'),
  eel_avocado_roll: require('../../assets/sushi/eel_avocado_roll.png'),
  eel_nigiri: require('../../assets/sushi/eel_nigiri.png'),
  philadelphia_roll: require('../../assets/sushi/philadelphia_roll.png'),
  rainbow_roll: require('../../assets/sushi/rainbow_roll.png'),
  salmon_avocado_roll: require('../../assets/sushi/salmon_avocado_roll.png'),
  salmon_cucumber_roll: require('../../assets/sushi/salmon_cucumber_roll.png'),
  salmon_nigiri: require('../../assets/sushi/salmon_nigiri.png'),
  shrimp_nigiri: require('../../assets/sushi/shrimp_nigiri.png'),
  shrimp_tempura_roll: require('../../assets/sushi/shrimp_tempura_roll.png'),
  spicy_salmon_roll: require('../../assets/sushi/spicy_salmon_roll.png'),
  spicy_tuna_roll: require('../../assets/sushi/spicy_tuna_roll.png'),
  tuna_avocado_roll: require('../../assets/sushi/tuna_avocado_roll.png'),
  tuna_cucumber_roll: require('../../assets/sushi/tuna_cucumber_roll.png'),
  tuna_nigiri: require('../../assets/sushi/tuna_nigiri.png'),
  vegetable_roll: require('../../assets/sushi/vegetable_roll.png'),
} satisfies Record<string, ImageSourcePropType>;

export const ingredientImages = {
  avocado: require('../../assets/ingredients/ingredient_avocado.png'),
  crab: require('../../assets/ingredients/ingredient_crab.png'),
  cream_cheese: require('../../assets/ingredients/ingredient_cream_cheese.png'),
  cucumber: require('../../assets/ingredients/ingredient_cucumber.png'),
  eel: require('../../assets/ingredients/ingredient_eel.png'),
  nori: require('../../assets/ingredients/ingredient_nori.png'),
  rice: require('../../assets/ingredients/ingredient_rice.png'),
  salmon: require('../../assets/ingredients/ingredient_salmon.png'),
  shrimp: require('../../assets/ingredients/ingredient_shrimp.png'),
  spicy_mayo: require('../../assets/ingredients/ingredient_spicy_mayo.png'),
  tempura_shrimp: require('../../assets/ingredients/ingredient_tempura_shrimp.png'),
  tuna: require('../../assets/ingredients/ingredient_tuna.png'),
} satisfies Record<IngredientId, ImageSourcePropType>;
