require("dotenv").config();

const axios = require('axios').default;
const spoonacularApiKey = process.env.API_KEY;
const apiGetIngredInfo = `https://api.spoonacular.com/recipes/parseIngredients` +
    `?apiKey=${spoonacularApiKey}&includeNutrition=true&ingredientList=`;
const apiGetConversion = `https://api.spoonacular.com/recipes/convert?apiKey=${spoonacularApiKey}`
const headers = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }

module.exports = function (app) {
    app.get("/api/getConversion", function (req, res) {
        axios.get(apiGetConversion, {
            params: {
                ingredientName: req.body.name,
                sourceAmount: req.body.sourceAmount,
                sourceUnit: req.body.sourceUnit,
                targetUnit: req.body.targetUnit
            }
        }).then(function (response) {
            res.json(response.data)
        }).catch(function (err) {
            console.log(err);
            res.status(401).json(err);
        });
    });

    app.post("/api/ingredInfo", function (req, res) {
        let data = null

        axios.post(apiGetIngredInfo + req.body.ingredList, data, headers)
            .then(function (response) {
                res.json(response.data)
            }).catch(function (err) {
                console.log(err);
                res.status(401).json(err);
            });
    });
}