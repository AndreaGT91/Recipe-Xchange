const bcrypt = require("bcryptjs");

module.exports = function (sequelize, DataTypes) {
    const Users = sequelize.define("Users", {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false
        },
        aboutMe: DataTypes.TEXT,
        imperial: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
    });

    Users.prototype.validPassword = function (password) {
        return bcrypt.compareSync(password, this.password);
    };

    Users.addHook("beforeCreate", function (user) {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    });

    Users.associate = function (models) {
        Users.hasMany(models.Recipes);
    };

    return Users;
};
