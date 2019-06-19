module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            next();
        } else {
            req.flash("error_msg", "Please login to view this resource");
            res.redirect("/users/login");
        }
    }
};
