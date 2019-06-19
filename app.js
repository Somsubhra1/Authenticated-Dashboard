const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const path = require("path");

// Passport config
require("./strategy/passport")(passport);

require("dotenv/config");

const app = express();

// Connect to MongoDB
mongoose
    .connect(process.env.MongoURI, { useNewUrlParser: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log("Error connecting to db: " + err));

// Express Layouts middleware
app.use(expressLayouts);

// Set view engine
app.set("view engine", "ejs");

// Express BodyParser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Express session middleware
app.use(
    session({
        secret: "secret",
        resave: true,
        saveUninitialized: true
    })
);

// Connect flash middleware
app.use(flash());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Setting Global vars for flash messages
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});

// Static files middleware:
app.use(express.static(path.join(__dirname, "/public")));

// Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started in port ${PORT}`));
