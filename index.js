const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
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

app.post("/",async (req,res) =>{

    const { email, password } = req.body;

    
    if (!email || !password) {
      res.send("Please enter all the fields");
      return;
    }

    const doesUserExitsAlreay = await User.findOne({ email });

    if (doesUserExitsAlreay) {
      res.send("A user with that email already exits please try another one!");
      return;
    }

   const latestUser = new User({ email, password });

    latestUser
      .save()
      .then(() => {
        res.send("User Created Successfully !");
        return;
      })
      .catch((err) => console.log(err));
  });

app.post("/login", async (req,res) => {
    const email = req.body.email;
    const password = req.body.password;
    const doesUserExits = await User.findOne({ email });

    if (!doesUserExits) {
      res.send("invalid username or password");
      return;
    }

    User.findOne({ email: email}, (err,foundResults) => {
        if(err) {
            console.log(err);
        } else 
        if (foundResults.password == password) {
            res.send("Successfully logged in !");
             
        } else 
        if (!doesUserExits) {
            res.send("invalid username or password");
           
          } else 
          if (!email || !password) {
            res.send("Please enter all the fields");
         
          } else
        {
            res.send("Incorrect email or password ");
        }
    });
});

app.listen(3000);
console.log("Server running in port 3000");
