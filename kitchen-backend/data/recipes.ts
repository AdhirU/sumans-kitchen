import { Recipe } from "../src/types";

const recipes: Recipe[] = [
  {
    id: 1,
    title: "Spaghetti Carbonara",
    description:
      "A classic Italian pasta dish with eggs, cheese, pancetta, and pepper.",
    image: null,
    ingredients: [
      "Spaghetti",
      "Eggs",
      "Pancetta",
      "Parmesan Cheese",
      "Black Pepper",
    ],
    directions: [
      "Cook spaghetti",
      "Fry pancetta",
      "Mix eggs and cheese",
      "Combine all ingredients",
    ],
  },
  {
    id: 2,
    title: "Chicken Curry",
    description:
      "A flavorful curry dish with tender chicken and aromatic spices.",
    image: null,
    ingredients: [
      "Chicken",
      "Onions",
      "Tomatoes",
      "Garlic",
      "Ginger",
      "Spices",
    ],
    directions: [
      "Sauté onions and garlic",
      "Add chicken",
      "Pour in tomatoes and spices",
      "Simmer until cooked",
    ],
  },
];

export default recipes;
