const path = require("path");
const passport = require("passport")

module.exports = function (app) {
  app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "../views/index.html"));
  });

  app.get("/profile/:id", function (req, res) {
    res.sendFile(path.join(__dirname, `../views/index.html/?user_id=${req.params.id}`));
  })

  app.get("/search", function (req, res) {
    res.sendFile(path.join(__dirname, "../views/index.html"));
  })

  app.post("/login",
    passport.authenticate("local", { failureRedirect: "/login" }),
    function (req, res) {
      res.redirect("/");
    });
};
