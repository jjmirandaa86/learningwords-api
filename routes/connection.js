const express = require("express");
const dot = require("dotenv");
const connectDB = require("../db/db");
const {
	typeEncryptPassword,
	messageConsoleRequest,
	messageRed,
	messageGreen,
	pagination,
} = require("../utility/general");

const router = express.Router();
const limit = parseInt(process.env.ITEMS_PER_PAGE);
const entity = "Connection";
let message = "";

//ADD -> send body object {}
router.post("/", async (req, res) => {
	//idConnection
	//create_time
	const idUser = req.body.idUser;
	const country = req.params.country; //
	const region = req.params.region; //
	const city = req.params.city; //
	const navigator = req.get("User-Agent");
	const ip = req.socket.remoteAddress; //
	const type = req.method;
	const endPoint = req.originalUrl;
	const platform = req.get("platform");

	const data = {
		idUser,
		navigator,
		ip,
		region,
		city,
		country,
		type,
		endPoint,
		platform,
	};

	console.log(req);
	console.table(data);

	res.json({
		status: 200,
		statusText: `Add user`,
		error: false,
		data: data,
	});

	console.log(req.rawHeaders[1]);

	/*
	try {
		//GET DATA
		const db = await connectDB();
		let query = `INSERT ${entity} (firstName, lastName, user, password, email, gender, status) 
						values ((?), (?), (?), ${typeEncryptPassword}((?)), (?), (?), (?)); `;
		const [results] = await db.query(query, [
			firstName,
			lastName,
			user,
			password,
			email,
			gender,
			status,
		]);
		//Message
		messageGreen(messageConsoleRequest(req, entity));

		//Return
		res.json({
			status: 200,
			statusText: `Add user`,
			error: false,
			data: results,
		});
	} catch (error) {
		messageRed(messageConsoleRequest(req, entity) + `${error.message}`);
		res.status(500).json({
			status: 500,
			statusText: `Error: Add user: ${error.message}`,
			error: true,
			data: [],
		});
	}
		*/
});

module.exports = router;
