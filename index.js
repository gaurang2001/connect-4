const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require('morgan')
const cookieParser = require("cookie-parser");
var session = require('express-session');
var flash = require('express-flash');
const passport = require('passport')
const app = express();
const keys = require("./helpers/keys")
require('./helpers/passport-setup')

const sessionRoutes = require("./routes/session");

app.set("view engine","ejs");
app.set("views","views");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(cookieParser("secret"));

app.use(session({
    cookie: { maxAge: 60000 },
    keys: [keys.session.cookieKey],
    saveUninitialized: true,
    resave: 'true',
    secret: "secret"
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Log all requests
app.use(morgan('dev'));

app.use("/", sessionRoutes);

mongoose.connect("mongodb://localhost:27017/usersDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });
}).catch(err => console.log(err));
