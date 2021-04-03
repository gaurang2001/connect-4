const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.getLogin = (req, res) => {
    res.render("login");
}

exports.getRegister = (req, res) => {
    res.render("register");
}

exports.postLogin = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const doesUserExists = await User.findOne({ email });

    if (!doesUserExists) {
      res.send("User does not exist");
      return;
    }
    
    if (!email || !password) {
        res.send("Please enter all the fields");
         
    } else {
        bcrypt.compare(password, doesUserExists.password, function(e, r){
            if(e) {
                console.log(e);
                return;
            }
            if(r) {
                const token = jwt.sign({id: doesUserExists.id, loggedin: true}, "S3CrET0");
                //res.header("auth-token", token).send({"token": token});

                res.send("Successfully logged in !");
            } else {
                res.send("Incorrect email or password ");
            }
        });
    }
}

exports.postRegister = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.send("Please enter all the fields");
      return;
    }

    const doesUserExitsAlready = await User.findOne({ email });

    if (doesUserExitsAlready) {
      res.send("A user with that email already exits please try another one!");
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
            res.redirect("/login");
            return;
        }).catch((err) => console.log(err));
    });    
}