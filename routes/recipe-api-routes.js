const db = require("../models");
const { Op } = require("sequelize")

module.exports = function (app) {
    app.get("/api/recipes", function (req, res) {
        db.Recipes.findAll({}).then(function (dbRecipes) {
            res.json(dbRecipes);
        });
    });

    app.get("/api/recipesByCategory/:category", function (req, res) {
        db.Categories.findAll({
            where: {
                name: req.params.category
              },
              include: [db.Recipes]
        }).then(function (dbRecipes) {
            res.json(dbRecipes)
        });
    });

    app.get("/api/recipesByIngredient/:ingredient", function (req, res) {
        db.Ingredients.findAll({
            where: {
                name: req.params.ingredient
              },
              include: [db.Recipes]
        }).then(function (dbRecipes) {
            res.json(dbRecipes)
        });
    });

    app.get("/api/recipesByTitle/:title", function (req, res) {
        db.Recipes.findAll({
            where: {
                title: {
                    [Op.like]: "%" + req.params.title + "%"
                }
            }
        }).then(function (dbRecipes) {
            res.json(dbRecipes)
        });
    });

    app.get("/api/recipes/:id", function (req, res) {
        db.Recipes.findOne({
            where: {
                id: req.params.id
            },
        }).then(function (dbRecipe) {
            res.json(dbRecipe);
        });
    });

    app.post("/api/addrecipe", function (req, res) {
        db.Recipes.create({
            title: req.body.title,
            source: req.body.source,
            description: req.body.description,
            prepTime: req.body.prepTime,
            cookTime: req.body.cookTime,
            ovenTempF: req.body.ovenTempF,
            ovenTempC: req.body.ovenTempC,
            numServings: req.body.numServings,
            instructions: req.body.instructions,
            category1: req.body.category1,
            category2: req.body.category2,
            category3: req.body.category3,
            public: req.body.public,
            UserId: req.body.UserId,
            CategoryId: req.body.CategoryId
        })
            .then(function (dbRecipe) {
                res.json(dbRecipe)
            })
            .catch(function (err) {
                res.status(401).json(err);
            })
    });

    app.put("/api/recipes", function (req, res) {
        db.Recipes.update(
            req.body,
            {
                where: {
                    id: req.body.id
                }
            }).then(function (dbRecipe) {
                res.json(dbRecipe);
            });
    });

    app.delete("/api/recipes/:id", function (req, res) {
        db.Recipes.destroy({
            where: {
                id: req.params.id
            }
        }).then(function (dbRecipe) {
            res.json(dbRecipe);
        });
    });
};
