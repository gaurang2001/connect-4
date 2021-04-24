const app = require("express");
const router = app.Router();

const auth = require("../helpers/middleware");

function generateHash(length) {
	var haystack = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
		output = "";
	for (var i = 0; i < length; i++) {
		output += haystack.charAt(Math.floor(Math.random() * haystack.length));
	}
	return output;
}

router.get("/", function (req, res) {
	res.writeHead(302, {
		"Location": "/play/" + generateHash(6)
	});
	res.end();
});

router.get("/:room([A-Za-z0-9]{6})", auth.isLoggedIn, (req, res) => {
	res.render("play", { notice: req.flash('notice'), alert: req.flash('alert'), current_user: res.locals.user });
});

module.exports = router;