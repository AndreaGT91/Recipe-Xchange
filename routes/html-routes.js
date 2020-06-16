const path = require("path");
const passport = require("passport")

module.exports = function (app) {
  app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });

  app.get("/profile/:id", function (req, res) {
    res.sendFile(path.join(__dirname, `../public/profile.html/?user_id=${req.params.id}`));
  })

  app.get("/search", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/search.html"));
  })

  app.get("/login", function (req, res) {
    if (req.user) {
      res.redirect("/profile/:id");
    }
    // or whatever you have that page named
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });
};
