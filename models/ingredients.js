module.exports = function (sequelize, DataTypes) {
    const Ingredients = sequelize.define("Ingredients", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isAlpha: true
            }
        },
        imperialQty: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        imperialUnit: DataTypes.STRING,
        metricQty: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        metricUnit: DataTypes.STRING,
        calories: DataTypes.INTEGER,
        protein: DataTypes.INTEGER,
        carbs: DataTypes.INTEGER,
        fat: DataTypes.INTEGER,
        recipeID: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    Ingredients.associate = function (models) {
        Ingredients.belongsTo(models.Recipes, {
            foreignKey: {
                allowNull: false
            }
        });
    };

    return Ingredients;
};
