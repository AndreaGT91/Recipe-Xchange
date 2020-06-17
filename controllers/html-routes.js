const path = require("path");
const passport = require("passport")

module.exports = function (app) {
  app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "../views/index.html"));
  });

  app.get("/profile", function (req, res) {
    res.sendFile(path.join(__dirname, "../views/profile.html"));
  })

  app.get("/search", function (req, res) {
    res.sendFile(path.join(__dirname, "../views/index.html"));
  })

  app.get("/add", function (req, res) {
    res.sendFile(path.join(__dirname, "../views/add.html"));
  })

  app.get("/login", function (req, res) {
    res.sendFile(path.join(__dirname, "../views/login.html"));
  });
  
};
