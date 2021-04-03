const jwt = require("jsonwebtoken");

exports.isLoggedIn = (req,res,next) => {
    try {
        let token = req.header('Authorization');

        if(token) console.log(token);
        else { res.redirect("/login"); return; }

        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length).trimLeft();
        }

        console.log(token);

        const verified = jwt.verify(token, "S3CrET0");

        if(!verified.loggedin) {
            res.redirect("/login");
            return;
        }

        next();
    }

    catch(err) {
        res.redirect("/login");
        return;
    }
}