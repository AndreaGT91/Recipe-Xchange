const db = require("../models");

module.exports = function (app) {
    app.get("/api/ingredients/:id", function (req, res) {
        db.Ingredients.findAll({
          where: {
            RecipeId: req.params.id
          }
        }).then(function (dbIngredients) {
            res.json(dbIngredients);
        });
    });

    app.get("/api/ingredients/:id", function (req, res) {
        db.Ingredients.findOne({
            where: {
                id: req.params.id
            }
        }).then(function (dbIngredient) {
            res.json(dbIngredient);
        });
    });

    app.post("/api/addingredient", function (req, res) {
        db.Ingredients.create({
            name: req.body.name,
            imperialQty: req.body.imperialQty,
            imperialUnit: req.body.imperialUnit,
            metricQty: req.body.metricQty,
            metricUnit: req.body.metricUnit,
            calories: req.body.calories,
            protein: req.body.protein,
            carbs: req.body.carbs,
            fat: req.body.fat,
            RecipeId: req.body.RecipeId
        })
            .then(function (dbIngredient) {
                res.json(dbIngredient)
            })
            .catch(function (err) {
                res.status(401).json(err);
            })
    });

    app.put("/api/ingredients", function (req, res) {
        db.Ingredients.update(
            req.body,
            {
                where: {
                    id: req.body.id
                }
            }).then(function (dbIngredient) {
                res.json(dbIngredient);
            });
    });

    app.delete("/api/ingredients/:id", function (req, res) {
        db.Ingredients.destroy({
            where: {
                id: req.params.id
            }
        }).then(function (dbIngredient) {
            res.json(dbIngredient);
        });
    });
};
