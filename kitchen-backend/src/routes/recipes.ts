import express from "express";

const router = express.Router();

let recipes = [
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

router.get("/", (_req, res) => {
  res.json(recipes);
});

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const recipe = recipes.find((r) => r.id === id);
  if (!recipe) {
    res.status(404).end();
    return;
  }
  res.json(recipe);
});

router.post("/", (req, res) => {
  const id = recipes.length + 1;

  const recipe = req.body;
  recipe.id = id;

  recipes = recipes.concat(recipe);
  res.json(recipe);
});

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  recipes = recipes.filter((r) => r.id !== id);

  res.status(204).end();
});

export default router;
