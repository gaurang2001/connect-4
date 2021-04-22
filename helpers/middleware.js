const jwt = require("jsonwebtoken");

exports.isLoggedIn = (req,res,next) => {
    try {
        const token = req.cookies.connect4;

        if (token == null) {

            if(req.originalUrl === "/login" || req.originalUrl === "/register") return next();

            else return res.redirect("/login");
        }

        jwt.verify(token, "secret", (err, user_email) => {
            if (err) {
                console.log(err);
                return res.redirect("/login");
            }

            req.user_email = user_email;

            if(req.originalUrl === "/login" || req.originalUrl === "/register") {
                req.flash("alert", "User is already logged in");
                return res.redirect("/");
            }

            next();
        });
    }

    catch(err) {
        console.log(err);

        res.redirect("/login");
        return;
    }
}
