const express = require("express");
const userRoutes = require("./user.js");
const typeRoutes = require("./type.js");
const profileWordsRoutes = require("./profile_words.js");
const connectionRoutes = require("./connection.js");
const router = express.Router();

router
	.get("/", (req, res) => {
		res.status(200).json({ message: "welcome api learning words" });
	})
	.use("/user", userRoutes)
	.use("/profile_words", profileWordsRoutes)
	.use("/type", typeRoutes)
	.use("/connection", connectionRoutes);

module.exports = router;
