const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.getLogin = (req, res) => {
    res.render("login", { notice: req.flash('notice'), alert: req.flash('alert') });
}

exports.getRegister = (req, res) => {
    res.render("register", { notice: req.flash('notice'), alert: req.flash('alert') });
}

exports.getUpdateprofile = (req, res) => {
    res.render("updateprofile", { notice: req.flash('notice'), alert: req.flash('alert'), current_user: res.locals.user });
}

exports.postLogin = async (req, res) => {
    const email = req.body.email;
    const password = req.body.your_pass;
    var username;
    const doesUserExists = await User.findOne({ email: email });

    if (!doesUserExists) {
        req.flash("alert", "User does not exist");
        res.redirect("/login");
        return;
    }
    if (doesUserExists) {
        User.findOne({ email }, function (err, result) {
            if (err) throw err
            else
                username = result.username;
        })
    }

    if (!email || !password) {
        req.flash("alert", "Please enter all the fields");
        res.redirect("/login");

    } else {
        bcrypt.compare(password, doesUserExists.password, function (e, r) {
            if (e) {
                console.log(e);
                return;
            }
            if (r) {
                const token = jwt.sign(doesUserExists.email, "secret");
                res.cookie("connect4", token, { expire: '30d' });

                req.flash("notice", "Successfully logged in, Welcome " + username);
                res.redirect("/");
            } else {
                req.flash("alert", "Incorrect email or password");
                res.redirect("/login");
            }
        });
    }
}

exports.postRegister = async (req, res) => {

    const email = req.body.email;
    const password = req.body.pass;
    const username = req.body.uname;

    if (!email || !password || !username) {
        req.flash("alert", "Please enter all the fields");
        res.redirect("/register");
    }

    const doesUserExistsAlready = await User.findOne({ email: email });

    if (doesUserExistsAlready) {
        req.flash("alert", "A user with that email already exists. Please try another one");
        res.redirect("/register");
        return;
    }

    await bcrypt.hash(password, 10, function (e, hashPassword) {
        if (e) {
            console.log(e);
            return;
        }

        const latestUser = new User({ email: email, password: hashPassword, username: username });

        latestUser
            .save()
            .then((value) => {
                console.log(value);
                req.flash("notice", "User successfully registered");
                res.redirect("/login");
                return;
            }).catch((err) => console.log(err));
    });
}


exports.postUpdateprofile = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;

    const doesUserExists = await User.findOne({ email: email });
    if (!doesUserExists) {
        req.flash("alert", "Incorrect Email");
        res.redirect("/updateprofile");
        return;
    }
    if (!email || !password || !username) {
        req.flash("alert", "Enter all fields");
        res.redirect("/updateprofile");

        return;
    }
    else {
        await bcrypt.hash(password, 10, function (e, hashPassword) {
            if (e) {
                console.log(e);
                return;
            }

            var newvalues = { $set: { password: hashPassword, username: username } };
            var myquery = { email: email };

            users.updateOne(myquery, newvalues, function (err, result) {
                if (err) throw err;
            });

            req.flash("notice", "Profile updated successfully");
            res.redirect("/");

            return;
        });
    }
}

exports.postLogout = (req, res) => {
    res.clearCookie("connect4");
    req.logout();
    req.flash("notice", "Successfully logged out");
    res.redirect("/login");
}