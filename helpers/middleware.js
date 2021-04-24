const jwt = require("jsonwebtoken");
const User = require("../models/users");

exports.isLoggedIn = async function (req, res, next) {
    try {
        const token = req.cookies.connect4;

        if (token == null) {
            if (req.originalUrl === "/login" || req.originalUrl === "/register") return next();
            else return res.redirect("/login");
        }

        await jwt.verify(token, "secret", async (err, user_email) => {
            if (err) {
                console.log(err);
                return res.redirect("/login");
            }

            await User.findOne({ email: user_email }, function (err, result) {
                if (err) throw err;
                res.locals.user = result;
            });

            if (req.originalUrl === "/login" || req.originalUrl === "/register") {
                req.flash("alert", "User is already logged in");
                return res.redirect("/");
            }

            next();
        });
    }

    catch (err) {
        console.log(err);

        res.redirect("/login");
        return;
    }
}