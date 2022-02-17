module.exports = (sequelize, Sequelize) => {
    const users = sequelize.define("users", {
            username: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },
        },
        {
            tableName: 'users',
        });

    users.associate = (models) => {
        users.hasMany(models.tasks, {
            onDelete: "cascade",
        });
    };
    return users;
}