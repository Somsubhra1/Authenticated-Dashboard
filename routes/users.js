const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const router = express.Router();

// User login page route
router.get("/login", (req, res) => {
    res.render("login");
});

// User register page route
router.get("/register", (req, res) => {
    res.render("register");
});

// User register handle route
router.post("/register", (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    // check required fields:
    if (!name || !email || !password || !password2) {
        errors.push({ msg: "Please fill in all fields" });
    }
    // Check if passwords match
    if (password !== password2) {
        errors.push({ msg: "Passwords don't match" });
    }
    // Check password length
    if (password.length < 6) {
        errors.push({ msg: "Password must be atleast 6 characters" });
    }

    if (errors.length > 0) {
        return res.render("register", {
            errors,
            name,
            email,
            password,
            password2
        });
    }

    // Check if user already present
    User.findOne({ email })
        .then(user => {
            if (user) {
                errors.push({ msg: "Email is already registered" });
                return res.render("register", {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }
            const newUser = new User({ name, email, password });

            // Hash password
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) {
                        throw err;
                    }
                    //  Set password to hashed
                    newUser.password = hash;
                    // Saving new user
                    newUser
                        .save()
                        .then(user => {
                            // Since we are redirecting we need to use flash message to display the messages
                            req.flash(
                                "success_msg",
                                "You are now registered and can login"
                            );
                            res.redirect("/users/login");
                        })
                        .catch(err => {
                            console.log("Error saving to db: " + err);
                        });
                });
            });
        })
        .catch(err => {
            console.log("Error finding user in db: " + err);
        });
});

// User login handle route
router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/users/login",
        failureFlash: true
    })(req, res, next);
});

// User logout handle
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success_msg", "You are logged out");
    res.redirect("/users/login");
});

module.exports = router;
