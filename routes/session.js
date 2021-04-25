const User = require("../models/users");
const app = require("express");
const router = app.Router();
const passport = require('passport');

const sessionController = require("../controllers/session");
const auth = require("../helpers/middleware");


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  sessionController.postGoogleLogin);

router.get("/login", auth.isLoggedIn, sessionController.getLogin);
router.get("/register", auth.isLoggedIn, sessionController.getRegister);
router.get("/updateprofile", auth.isLoggedIn, sessionController.getUpdateprofile);

router.post("/login", auth.isLoggedIn, sessionController.postLogin);
router.post("/register", auth.isLoggedIn, sessionController.postRegister);
router.post("/updateprofile", auth.isLoggedIn, sessionController.postUpdateprofile);

router.post("/logout", auth.isLoggedIn, sessionController.postLogout);

router.get("/", auth.isLoggedIn, sessionController.getHome);

module.exports = router;