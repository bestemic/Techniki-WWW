const express = require('express');
const app = express();
const cors = require('cors');
const database = require('./models');

app.use(express.json());
app.use(cors());

const tasksRouter = require("./routes/Tasks");
app.use("/tasks", tasksRouter);
const usersRouter = require("./routes/Users");
app.use("/validation", usersRouter);

database.sequelize.sync().then(() => {
    app.listen(8080, () => {
        console.log("Serwer pracuje na porcie 8080");
    });
});
