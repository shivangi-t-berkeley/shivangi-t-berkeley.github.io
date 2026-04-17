// Mise en Place — Puzzle Data
// Grids are generated at runtime by generator.js and cached in localStorage.

const PUZZLES = [
  {
    id: "2026-04-03",
    dish_name: "Cacio e Pepe",
    dish_display_name: "Cacio e Pepe",
    cuisine: "Italian",
    difficulty: "medium",
    words: [
      { word: "PECORINO",  emoji: "🧀", display: "Pecorino Romano" },
      { word: "PASTA",     emoji: "🍝", display: "Pasta" },
      { word: "PEPPER",    emoji: "🌶️", display: "Black Pepper" },
      { word: "GUANCIALE", emoji: "🥩", display: "Guanciale" },
      { word: "OLIVEOIL",  emoji: "🫒", display: "Olive Oil" },
      { word: "SALT",      emoji: "🧂", display: "Salt" },
      { word: "WATER",     emoji: "💧", display: "Water" },
      { word: "STARCH",    emoji: "🌾", display: "Pasta Starch" },
      { word: "EGG",       emoji: "🥚", display: "Egg Yolk" }
    ],
    recipe_url: "https://cooking.nytimes.com/recipes/1017965-cacio-e-pepe",
    illustration_emoji: "🍝",
    illustration_asset: null
  },
  {
    id: "2026-04-04",
    dish_name: "Chicken Tikka Masala",
    dish_display_name: "Chicken Tikka Masala",
    cuisine: "Indian",
    difficulty: "hard",
    words: [
      { word: "CHICKEN",  emoji: "🍗", display: "Chicken" },
      { word: "TOMATO",   emoji: "🍅", display: "Tomato" },
      { word: "CREAM",    emoji: "🥛", display: "Heavy Cream" },
      { word: "GARAM",    emoji: "🫙", display: "Garam Masala" },
      { word: "GINGER",   emoji: "🫚", display: "Ginger" },
      { word: "GARLIC",   emoji: "🧄", display: "Garlic" },
      { word: "CUMIN",    emoji: "🌿", display: "Cumin" },
      { word: "YOGURT",   emoji: "🥣", display: "Yogurt" },
      { word: "BUTTER",   emoji: "🧈", display: "Butter" }
    ],
    recipe_url: "https://cooking.nytimes.com/recipes/1017351-chicken-tikka-masala",
    illustration_emoji: "🍛",
    illustration_asset: null
  },
  {
    id: "2026-04-17",
    dish_name: "Guacamole",
    dish_display_name: "Guacamole",
    cuisine: "Mexican",
    difficulty: "easy",
    words: [
      { word: "AVOCADO",  emoji: "🥑", display: "Avocado" },
      { word: "LIME",     emoji: "🍋", display: "Lime" },
      { word: "CILANTRO", emoji: "🌿", display: "Cilantro" },
      { word: "ONION",    emoji: "🧅", display: "Red Onion" },
      { word: "JALAPENO", emoji: "🌶️", display: "Jalapeño" },
      { word: "GARLIC",   emoji: "🧄", display: "Garlic" },
      { word: "SALT",     emoji: "🧂", display: "Salt" }
    ],
    recipe_url: "https://www.seriouseats.com/the-best-guacamole",
    illustration_emoji: "🥑",
    illustration_asset: null
  },
  {
    id: "2026-04-06",
    dish_name: "Ramen",
    dish_display_name: "Tonkotsu Ramen",
    cuisine: "Japanese",
    difficulty: "hard",
    words: [
      { word: "PORK",     emoji: "🐷", display: "Pork Belly" },
      { word: "NOODLES",  emoji: "🍜", display: "Ramen Noodles" },
      { word: "MISO",     emoji: "🫙", display: "Miso Paste" },
      { word: "SHOYU",    emoji: "🍶", display: "Soy Sauce" },
      { word: "KOMBU",    emoji: "🌊", display: "Kombu" },
      { word: "GINGER",   emoji: "🫚", display: "Ginger" },
      { word: "GARLIC",   emoji: "🧄", display: "Garlic" },
      { word: "EGGS",     emoji: "🥚", display: "Soft-boiled Eggs" },
      { word: "SCALLION", emoji: "🌱", display: "Scallion" }
    ],
    recipe_url: "https://www.seriouseats.com/rich-and-creamy-tonkotsu-ramen-broth-recipe",
    illustration_emoji: "🍜",
    illustration_asset: null
  },
  {
    id: "2026-04-07",
    dish_name: "Tiramisu",
    dish_display_name: "Tiramisu",
    cuisine: "Italian",
    difficulty: "medium",
    words: [
      { word: "MASCARPONE", emoji: "🧀", display: "Mascarpone" },
      { word: "ESPRESSO",   emoji: "☕", display: "Espresso" },
      { word: "SAVOIARDI",  emoji: "🍪", display: "Ladyfingers" },
      { word: "EGGS",       emoji: "🥚", display: "Eggs" },
      { word: "SUGAR",      emoji: "🍬", display: "Sugar" },
      { word: "COCOA",      emoji: "🍫", display: "Cocoa Powder" },
      { word: "MARSALA",    emoji: "🍷", display: "Marsala Wine" },
      { word: "CREAM",      emoji: "🥛", display: "Heavy Cream" }
    ],
    recipe_url: "https://cooking.nytimes.com/recipes/1018684-classic-tiramisu",
    illustration_emoji: "🍰",
    illustration_asset: null
  }
];
