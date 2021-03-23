const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const User = require('./models/users');

mongoose.connect('mongodb://localhost:27017/usersDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const app = express();

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.get("/", (req,res) => {
    res.render("register");
});
app.get("/login", (req,res) => {
    res.render("login");
});

app.post("/",(req,res) =>{

    const email = req.body.email;
    const password = req.body.password;
    //console.log(req.body);
    console.log(email,password);
    const newUser = new User({
        email: email,
        password: password
    });

    newUser.save(err=> {
        err ? console.log(err) : res.send("Successfully Created User");
    });
    
});

app.post("/login",(req,res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email}, (err,foundResults) => {
        if(err) {
            console.log(err);
        } else 
        if (foundResults.password == password) {
            res.send("Successfully logged in !");
             
        } else {
            res.send("Incorrect email or password ");
        }
    });
});

app.listen(3000);
console.log("Server running in port 3000");
