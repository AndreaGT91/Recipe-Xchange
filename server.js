const express = require("express");
const session = require("express-session");
const passport = require("./config/passport");
const app = express();
const PORT = process.env.PORT || 8080;
const { pid } = process;
const db = require("./models");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(express.static("views"));
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

require("./controllers/html-routes.js")(app);
require("./controllers/user-api-routes.js")(app);
require("./controllers/recipe-api-routes.js")(app);
require("./controllers/ingredients-api-routes.js")(app);
require("./controllers/categories-api-routes.js")(app);
require("./controllers/spoonacular-api-routes.js")(app);

db.sequelize.sync().then(function () {
    console.log(`PID: ${pid}\n`);
    app.listen(PORT, function () { console.log("App listening on PORT " + PORT); });
});
