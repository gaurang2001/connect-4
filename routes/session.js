const app = require("express");
const router = app.Router();

const sessionController = require("../controllers/session");
const auth = require("../helpers/middleware");

router.get("/login", sessionController.getLogin);
router.get("/register", sessionController.getRegister);

router.post("/login", sessionController.postLogin);
router.post("/register", sessionController.postRegister);

router.get("/", auth.isLoggedIn, (req, res) => {
  res.send("Hello there");
});

module.exports = router;