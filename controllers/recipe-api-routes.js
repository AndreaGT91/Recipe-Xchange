const db = require("../models");
const { Op } = require("sequelize");
let currentRecipe = {};

module.exports = function (app) {
    app.get("/api/recipes", function (req, res) {
        db.Recipes.findAll({
            include: [db.Users, db.Ingredients]
        }).then(function (dbRecipes) {
            currentRecipe = {};
            res.json(dbRecipes);
        }).catch(function (err) {
            console.log(err);
            res.status(401).json(err);
        });
    });

    app.get("/api/recipesByUser/:id", function (req, res) {
        db.Recipes.findAll({
            where: {
                UserId: req.params.id
            }
        }).then(function (dbRecipes) {
            currentRecipe = {};
            res.json(dbRecipes);
        }).catch(function (err) {
            console.log(err);
            res.status(401).json(err);
        });
    });

    app.get("/api/recipesByCategory/:id", function (req, res) {
        db.Recipes.findAll({
            where: {
                [Op.or]: [
                    { category1: req.params.id },
                    { category2: req.params.id },
                    { category3: req.params.id }
                ],
                public: true
            },
            include: [db.Users, db.Ingredients]
        }).then(function (dbRecipes) {
            currentRecipe = {};
            res.json(dbRecipes)
        }).catch(function (err) {
            console.log(err);
            res.status(401).json(err);
        });
    });

    app.get("/api/recipesByTitle/:title", function (req, res) {
        db.Recipes.findAll({
            where: {
                title: {
                    [Op.like]: "%" + req.params.title + "%"
                },
                public: true
            },
            include: [db.Users, db.Ingredients]
        }).then(function (dbRecipes) {
            currentRecipe = {};
            res.json(dbRecipes)
        }).catch(function (err) {
            console.log(err);
            res.status(401).json(err);
        });
    });

    app.get("/api/recipes/:id", function (req, res) {
        db.Recipes.findOne({
            where: {
                id: req.params.id
            },
            include: [db.Users, db.Ingredients]
        }).then(function (dbRecipe) {
            currentRecipe = dbRecipe;
            res.json(dbRecipe);
        }).catch(function (err) {
            console.log(err);
            res.status(401).json(err);
        });
    });

    app.get("/api/currentrecipe", function (req, res) {
      res.json(currentRecipe);
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
            UserId: req.body.UserId
        }).then(function (dbRecipe) {
            currentRecipe = dbRecipe;
            res.json(dbRecipe)
        }).catch(function (err) {
            console.log(err);
            res.status(401).json(err);
        });
    });

    app.put("/api/recipes", function (req, res) {
        db.Recipes.update(
            req.body,
            {
                where: {
                    id: req.body.id
                }
            }).then(function (dbRecipe) {
                currentRecipe = dbRecipe;
                res.json(dbRecipe);
            }).catch(function (err) {
                console.log(err);
                res.status(401).json(err);
            });
    });

    app.delete("/api/recipes/:id", function (req, res) {
        db.Recipes.destroy({
            where: {
                id: req.params.id
            }
        }).then(function (dbRecipe) {
            currentRecipe = {};
            res.json(dbRecipe);
        }).catch(function (err) {
            console.log(err);
            res.status(401).json(err);
        });
    });
};
