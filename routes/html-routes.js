const path = require("path");
const passport = require("passport")

module.exports = function (app) {
  app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });

  app.get("/add", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/add.html"));
  })

  app.get("/profile", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/profile.html"));
  })

  app.get("/index", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  })

  app.get("/search", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/search.html"));
  })

  app.post("/login",
    passport.authenticate("local", { failureRedirect: "/login" }),
    function (req, res) {
      res.redirect("/");
    });
};
