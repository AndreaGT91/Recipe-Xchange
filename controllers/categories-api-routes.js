const db = require("../models");

module.exports = function (app) {
    app.get("/api/categories", function (req, res) {
        db.Categories.findAll({})
            .then(function (dbCategories) {
                res.json(dbCategories);
            }).catch(function (err) {
                console.log(err);
                res.status(401).json(err);
            });
    });

    app.get("/api/categories/:id", function (req, res) {
        db.Categories.findOne({
            where: {
                id: req.params.id
            }
        }).then(function (dbCategory) {
            res.json(dbCategory);
        }).catch(function (err) {
            console.log(err);
            res.status(401).json(err);
        });
    });

    app.post("/api/addcategory", function (req, res) {
        db.Categories.create({
            name: req.body.name,
        }).then(function (dbCategory) {
            res.json(dbCategory)
        }).catch(function (err) {
            console.log(err);
            res.status(401).json(err);
        });
    });

    app.put("/api/categories", function (req, res) {
        db.Categories.update(
            req.body,
            {
                where: {
                    id: req.body.id
                }
            }).then(function (dbCategory) {
                res.json(dbCategory);
            }).catch(function (err) {
                console.log(err);
                res.status(401).json(err);
            });
    });

    app.delete("/api/categories/:id", function (req, res) {
        db.Categories.destroy({
            where: {
                id: req.params.id
            }
        }).then(function (dbCategory) {
            res.json(dbCategory);
        }).catch(function (err) {
            console.log(err);
            res.status(401).json(err);
        });
    });
};
