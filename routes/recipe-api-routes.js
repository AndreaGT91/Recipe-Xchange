const db = require("../models");

module.exports = function (app) {
    app.post("/api/addrecipe", function (req, res) {
        db.Recipes.create({
            title: req.body.title,
            source: req.body.source,
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
            userID: req.body.userID
        })
            .then(function () {
                // What do we want to do after they add the recipe?
            })
            .catch(function (err) {
                res.status(401).json(err);
            })
    });
};
