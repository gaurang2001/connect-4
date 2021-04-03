const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

const sessionRoutes = require("./routes/session");

app.set("view engine","ejs");
app.set("views","views");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

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
