const path = require("path");
const passport = require("passport")

module.exports = function (app) {
  app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "../views/index.html/?search"));
  });

  app.get("/profile/:id", function (req, res) {
    res.sendFile(path.join(__dirname, `../views/index.html/?profile?user_id=${req.params.id}`));
  })

  app.get("/search/:id", function (req, res) {
    res.sendFile(path.join(__dirname, `../views/index.html/?search?user_id=${req.params.id}`));
  })

  app.get("/add/:user_id/:recipe_id", function (req, res) {
    res.sendFile(path.join(__dirname, 
      `../views/index.html/?add?user_id=${req.params.user_id}?recipe_id=${req.params.recipe_id}`));
  })

  app.get("/login", function (req, res) {
    res.sendFile(path.join(__dirname, "../views/index.html/?login"));
  });
  
};
