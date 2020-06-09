module.exports = function (req, res, next) {
    if (req.user) {
        return next();
    }

    // return res.redirect("/");
    // add code for not allowing to edit recipes
};
