module.exports = function (sequelize, DataTypes) {
    const Categories = sequelize.define("Categories", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isAlpha: true
            }
        },
    });

    return Categories;
};
