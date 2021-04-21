const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.getLogin = (req, res) => {
    res.render("login", { notice: req.flash('notice'), alert: req.flash('alert') });
}

exports.getRegister = (req, res) => {
    res.render("register", { notice: req.flash('notice'), alert: req.flash('alert') });
}

exports.postLogin = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const doesUserExists = await User.findOne({ email });

    if (!doesUserExists) {
      req.flash("alert", "User does not exist");
      res.redirect("/login");
      return;
    }
    
    if (!email || !password) {
        req.flash("alert", "Please enter all the fields");
        res.redirect("/login");
         
    } else {
        bcrypt.compare(password, doesUserExists.password, function(e, r){
            if(e) {
                console.log(e);
                return;
            }
            if(r) {
                const token = jwt.sign(doesUserExists.email, "secret");
                res.cookie("connect4", token, {expire: '30d'});

                req.flash("notice", "Successfully logged in");
                res.redirect("/");
            } else {
                req.flash("alert", "Incorrect email or password");
                res.redirect("/login");
            }
        });
    }
}

exports.postRegister = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        req.flash("alert", "Please enter all the fields");
        res.redirect("/register");
    }

    const doesUserExitsAlready = await User.findOne({ email });

    if (doesUserExitsAlready) {
      req.flash("alert", "A user with that email already exists. Please try another one");
      res.redirect("/register");
      return;
    }

    await bcrypt.hash(password, 10, function(e, hashPassword) {
        if(e) {
            console.log(e);
            return;
        }

        const latestUser = new User({ email: email, password: hashPassword });

        latestUser
        .save()
        .then((value) => {
            console.log(value);
            req.flash("notice", "User successfully registered")
            res.redirect("/login");
            return;
        }).catch((err) => console.log(err));
    });    
}

exports.postLogout = (req, res) => {
    res.clearCookie("connect4");
    req.logout();
    req.flash("notice", "Successfully logged out");
    res.redirect("/login");
}