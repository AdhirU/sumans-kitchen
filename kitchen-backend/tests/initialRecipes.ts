import { IRecipe } from "../src/types";

const recipes: IRecipe[] = [
  {
    id: "57ac3a70-f321-11ef-848c-251b2404b223",
    title: "Spaghetti Carbonara",
    description:
      "A classic Italian pasta dish with eggs, cheese, pancetta, and pepper.",
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
    id: "6868be60-f321-11ef-848c-251b2404b223",
    title: "Chicken Curry",
    description:
      "A flavorful curry dish with tender chicken and aromatic spices.",
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
