const app = require("express");
const router = app.Router();

const sessionController = require("../controllers/session");
const auth = require("../helpers/middleware");

router.get("/login", auth.isLoggedIn, sessionController.getLogin);
router.get("/register", auth.isLoggedIn, sessionController.getRegister);

router.post("/login", auth.isLoggedIn, sessionController.postLogin);
router.post("/register", auth.isLoggedIn, sessionController.postRegister);

router.post("/logout", auth.isLoggedIn, sessionController.postLogout);

router.get("/", auth.isLoggedIn, (req, res) => {
  res.render("index", { notice: req.flash('notice'), alert: req.flash('alert') });
});

module.exports = router;