const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
var session = require('express-session');
var flash = require('express-flash');
const app = express();

const sessionRoutes = require("./routes/session");

app.set("view engine","ejs");
app.set("views","views");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(cookieParser("secret"));

app.use(session({
    cookie: { maxAge: 60000 },
    saveUninitialized: true,
    resave: 'true',
    secret: "secret"
}));

app.use(flash());

// Log all requests
app.use(function(req, res, next) {
    console.log(req.method, " ", req.originalUrl);
    console.log(req.body);
    
    next();
});

app.use("/", sessionRoutes);

mongoose.connect("mongodb://localhost:27017/usersDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });
}).catch(err => console.log(err));
