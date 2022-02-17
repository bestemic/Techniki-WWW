const {verify} = require("jsonwebtoken");

const validateToken = (req, res, next) => {
    const accessToken = req.header("accessToken");

    if (!accessToken) {
        return res.json({error: "Użytkownik nie zalogowany"});
    }

    try {
        const validToken = verify(accessToken, "secretKey");
        req.user = validToken;

        if (validToken) {
            return next();
        }
    } catch (e) {
        res.json({error: e});
    }
}

module.exports = {validateToken};