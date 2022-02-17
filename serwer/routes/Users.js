const express = require('express');
const router = express.Router();
const {users} = require('../models');
const bcrypt = require("bcrypt");
const {sign} = require("jsonwebtoken");
const {validateToken} = require("../middlewares/ValidMiddleware");

// Autoryzacja i zwrócenie informacji o zalogowanej osobie
router.get("/valid", validateToken, (req, res) => {
    res.json(req.user);
});

// Zwrócenie informacji o użytkowniku
router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const user = await users.findByPk(id, {
        attributes: {
            exclude: ["password"]
        }
    });
    res.json(user);
});

// Stworzenie użytkownika
router.post("/", async (req, res) => {
    const {username, email, password} = req.body;

    const user = await users.findOne({
        where: {
            username: username
        }
    });

    if (user != null) {
        res.json({error: "Użytkownik o podanej nazwie istnieje"});
        return;
    }

    bcrypt.hash(password, 5).then((hash) => {
        users.create({
            username: username,
            email: email,
            password: hash,
        });
        res.json({success: "Rejestracja zakończona sukcesem. Zaloguj się"});
    });
});

// Logowanie i stworzenie tokenu autoryzacyjnego
router.post("/login", async (req, res) => {
    const {username, password} = req.body;

    const user = await users.findOne({
        where: {
            username: username
        }
    });

    if (user == null) {
        res.json({error: "Nie ma takiego użytkownika"});
        return;
    }

    bcrypt.compare(password, user.password).then((valid) => {
        if (valid) {
            const accessToken = sign({username: user.username, id: user.id}, "secretKey");
            res.json({token: accessToken, username: username, id: user.id});
        } else {
            res.json({error: "Błędne hasło"});
        }
    });
});

// Usunięcie użytkownika
router.delete("/:id", validateToken, async (req, res) => {
    const userId = req.params.id;
    await users.destroy({
        where: {
            id: userId
        }
    });
    res.json("Użytkownik usunięty");
});

module.exports = router;