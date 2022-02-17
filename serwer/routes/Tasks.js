const express = require('express');
const router = express.Router();
const {tasks} = require('../models');
const {validateToken} = require("../middlewares/ValidMiddleware");

// Pobranie aktywnych zadań użytkownika
router.get("/active/:username", validateToken, async (req, res) => {
    const username = req.params.username;
    const listOfTasks = await tasks.findAll({
        where: {
            username: username,
            ended: false
        }
    });
    res.json(listOfTasks);
});

// Pobranie zakończonych zadań użytkownika
router.get("/ended/:username", validateToken, async (req, res) => {
    const username = req.params.username;
    const listOfTasks = await tasks.findAll({
        where: {
            username: username,
            ended: true
        }
    });
    res.json(listOfTasks);
});

// Pobranie zadania o danym id
router.get("/byID/:id", async (req, res) => {
    const id = req.params.id;
    const task = await tasks.findByPk(id);
    res.json(task);
});

// Stworzenia zadania
router.post("/", validateToken, async (req, res) => {
    const task = req.body;
    task.username = req.user.username;
    task.UserId = req.user.id;
    await tasks.create(task);
    res.json(task);
});

// Edycja zadania
router.patch("/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    const task = req.body;
    await tasks.update({
        title: task.title,
        info: task.info,
        details: task.details,
        deadline: task.deadline,
    }, {
        where: {
            id: id
        }
    });
    res.json(task);
});

// Zakończenie zadania
router.patch("/end/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    await tasks.update({
        ended: true,
    }, {
        where: {
            id: id
        }
    });
    res.json("Zakończono zadanie");
});

module.exports = router;