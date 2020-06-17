const db = require("../models");
const passport = require("../config/passport");
const bcrypt = require("bcryptjs");

module.exports = function (app) {
    app.post("/api/login", passport.authenticate("local"), function (req, res) {
        res.json(req.user);
    });

    app.post("/api/signup", function (req, res) {
        db.Users.create({
            email: req.body.email,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            location: req.body.location,
            aboutMe: req.body.aboutMe,
            imperial: req.body.imperial
        }).then(function () {
            res.redirect(307, "/api/login");
        }).catch(function (err) {
            res.status(401).json(err);
        });
    });

    app.get("/logout", function (req, res) {
        req.logout();
        res.redirect("/");
    });

    app.get("/profile/:id", function (req, res) {
        db.Users.findOne({
            where: {
                id: req.params.id
            }
        }).then(function (dbUser) {
            res.json(dbUser);
        }).catch(function (err) {
            console.log(err);
            res.status(401).json(err);
        });
    });

    app.get("/api/user_data/:id", function (req, res) {
        db.Users.findOne({
            where: {
                id: req.params.id
            }
        }).then(function (dbUser) {
            res.json(dbUser);
        }).catch(function (err) {
            console.log(err);
            res.status(401).json(err);
        });
    });

    app.get("/api/userByEmail/:email", function (req, res) {
      db.Users.findOne({
          where: {
              email: req.params.email
          }
      }).then(function (dbUser) {
          res.json(dbUser);
      });
    });

    app.get("/api/user_data", function (req, res) {
        if (!req.users) {
            res.json({});
        } else {
            res.json({
                email: req.users.email,
                id: req.users.id
            });
        }
    });

    app.put("/api/user", function (req, res) {
        req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null);

        db.Users.update(
            req.body,
            {
                where: {
                    id: req.body.id
                }
            }).then(function (dbUser) {
                res.json(dbUser);
            }).catch(function (err) {
                console.log(err);
                res.status(401).json(err);
            });
    });

    app.delete("/api/user/:id", function (req, res) {
        db.Users.destroy({
            where: {
                id: req.params.id
            }
        }).then(function (dbUser) {
            res.json(dbUser);
        }).catch(function (err) {
            console.log(err);
            res.status(401).json(err);
        });
    });
};
