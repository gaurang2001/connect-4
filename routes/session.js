const app = require("express");
const router = app.Router();
const passport = require('passport');
const jwt = require("jsonwebtoken");

const sessionController = require("../controllers/session");
const auth = require("../helpers/middleware");


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    console.log("\n\n\n\n\n\n\n\\n\n", req.user, "\n\n\n\n\n\n\n\\n\n\n\\n\n")
    // var token = jwt.sign(req.user.email, "secret");
    // res.cookie("connect4", token, { expire: '30d' });
    req.flash("notice", "Successfully logged in, Welcome " + req.user.username);
    res.redirect('/');
  });

router.get("/login", auth.isLoggedIn, sessionController.getLogin);
router.get("/register", auth.isLoggedIn, sessionController.getRegister);

router.get("/updateprofile", auth.isLoggedIn, sessionController.getUpdateprofile);

router.post("/login", auth.isLoggedIn, sessionController.postLogin);
router.post("/register", auth.isLoggedIn, sessionController.postRegister);
router.post("/updateprofile", auth.isLoggedIn, sessionController.postUpdateprofile);

router.post("/logout", auth.isLoggedIn, sessionController.postLogout);

router.get("/", auth.isLoggedIn, (req, res) => {
  res.render("index", { notice: req.flash('notice'), alert: req.flash('alert') });
});

module.exports = router;