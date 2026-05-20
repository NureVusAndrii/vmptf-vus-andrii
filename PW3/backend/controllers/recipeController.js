const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../db.json');

const readDB = () => {

  if (!fs.existsSync(dbPath)) {
    return [];
  }

  return JSON.parse(
    fs.readFileSync(dbPath, 'utf-8')
  );
};

const writeDB = (data) => {

  fs.writeFileSync(
    dbPath,
    JSON.stringify(data, null, 2)
  );
};

exports.getRecipes = (req, res) => {

  let recipes = readDB();

  const search = req.query.search;
  const ingredient = req.query.ingredient;

  // Search by title
  if (search) {

    recipes = recipes.filter(recipe =>
      recipe.title
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }

  // Filter by ingredient
  if (ingredient) {

    recipes = recipes.filter(recipe =>
      recipe.ingredients.some(i =>
        i.toLowerCase()
          .includes(ingredient.toLowerCase())
      )
    );
  }

  res.json(recipes);
};

exports.createRecipe = (req, res) => {

  const {
    title,
    ingredients,
    instructions
  } = req.body;

  const recipes = readDB();

  const newRecipe = {
    id: Date.now(),
    title,
    ingredients,
    instructions
  };

  recipes.push(newRecipe);

  writeDB(recipes);

  res.status(201).json(newRecipe);
};

exports.deleteRecipe = (req, res) => {

  let recipes = readDB();

  recipes = recipes.filter(
    recipe => recipe.id != req.params.id
  );

  writeDB(recipes);

  res.json({
    message: "Recipe deleted"
  });
};