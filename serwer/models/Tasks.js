module.exports = (sequelize, Sequelize) => {
    return sequelize.define("tasks", {
            title: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            info: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            details: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            username: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            deadline: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            ended: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        },
        {
            tableName: 'tasks',
        });
}