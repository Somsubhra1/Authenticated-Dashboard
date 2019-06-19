const express = require("express");
const { ensureAuthenticated } = require("../strategy/auth");

const router = express.Router();

// Welcome page
router.get("/", (req, res) => {
    res.render("welcome");
});

// Dashboard page
router.get("/dashboard", ensureAuthenticated, (req, res) => {
    res.render("dashboard", {
        name: req.user.name
    });
});

module.exports = router;
