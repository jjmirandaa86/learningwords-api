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

const { generateToken, validateToken } = require("../utility/jwt");

const router = express.Router();
const limit = parseInt(process.env.ITEMS_PER_PAGE);
const entity = "User";
let message = "";

//GET - All Users
router.get("/", async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const offSet = (page - 1) * limit;
		let totalData = 0;

		const db = await connectDB();

		//GET COUNT
		let query = `SELECT count(*) AS COUNT FROM ${entity}; `;
		const [countData] = await db.query(query);
		totalData = countData[0].COUNT;

		//GET DATA
		query = `SELECT idUser, firstName, lastName, email, status, user, gender 
					FROM ${entity} LIMIT ${limit} OFFSET ${offSet}; `;
		const [results] = await db.query(query);

		//Pagination
		const paginationData = pagination(page, limit, offSet, totalData, req);

		//Message
		messageGreen(messageConsoleRequest(req, entity));
		message = results.length !== 0 ? "Get all user" : "No data available.";

		//Return
		res.json({
			status: 200,
			statusText: message,
			error: false,
			data: results,
			totalData: totalData,
			page: page,
			pagination: results.length > 0 ? paginationData : {},
		});
	} catch (error) {
		messageRed(messageConsoleRequest(req, entity) + `${error.message}`);
		res.status(500).json({
			status: 500,
			statusText: `Error: Get all user, ${error.message}`,
			error: true,
			data: [],
			totalData: 0,
			page: 0,
			pagination: {},
		});
	}
});

//GET - User By ID
router.get("/:id", async (req, res) => {
	const idUser = parseInt(req.params.id);
	try {
		//GET DATA
		const db = await connectDB();
		let query = `SELECT idUser, firstName, lastName, email, status, user, gender 
					FROM ${entity} WHERE idUser = (?); `;
		const [results] = await db.query(query, idUser);
		//Message
		messageGreen(messageConsoleRequest(req, entity));

		//Return
		res.json({
			status: 200,
			statusText: `Get user id ${idUser}`,
			error: false,
			data: results,
			totalData: results.length,
			page: 1,
			pagination: {},
		});
	} catch (error) {
		messageRed(messageConsoleRequest(req, entity) + `${error.message}`);
		res.status(500).json({
			status: 500,
			statusText: `Error: Get user idUser: ${idUser}, ${error.message}`,
			error: true,
			data: [],
			totalData: 0,
			page: 0,
			pagination: {},
		});
	}
});

//EDIT -> send body object {}
router.put("/:id", async (req, res) => {
	const idUser = parseInt(req.params.id); // not edit, only for process query
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	//user not edit
	//password not edit
	const email = req.body.email;
	const status = req.body.status;
	const gender = req.body.gender;

	try {
		//GET DATA
		const db = await connectDB();
		let query = `UPDATE ${entity} SET firstName = (?), lastName = (?), email = (?), status = (?), gender = (?) 
					where idUser = (?); `;
		const [results] = await db.query(query, [
			firstName,
			lastName,
			email,
			status,
			gender,
			idUser,
		]);
		//Message
		messageGreen(messageConsoleRequest(req, entity));

		//Return
		res.json({
			status: 200,
			statusText: `Put user idUser ${idUser}`,
			error: false,
			data: results,
		});
	} catch (error) {
		messageRed(messageConsoleRequest(req, entity) + `${error.message}`);
		res.status(500).json({
			status: 500,
			statusText: `Error: Put user idUser: ${idUser}, ${error.message}`,
			error: true,
			data: [],
		});
	}
});

//ADD -> send body object {}
router.post("/", async (req, res) => {
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const user = req.body.user;
	const password = req.body.password;
	const email = req.body.email;
	const status = req.body.status;
	const gender = req.body.gender;

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
});

//DELETE - User By ID
router.delete("/:id", async (req, res) => {
	const idUser = parseInt(req.params.id);
	try {
		//GET DATA
		const db = await connectDB();
		let query = `Delete from ${entity} WHERE idUser = (?);`;
		const [results] = await db.query(query, idUser);
		//Message
		messageGreen(messageConsoleRequest(req, entity));

		//Return
		res.json({
			status: 200,
			statusText: `Delete user id ${idUser}`,
			error: false,
			data: results,
		});
	} catch (error) {
		messageRed(messageConsoleRequest(req, entity) + `${error.message}`);
		res.status(500).json({
			status: 500,
			statusText: `Error: Delete user idUser: ${idUser}, ${error.message}`,
			error: true,
			data: [],
		});
	}
});

//Authentication User send body object { user, password}
router.post("/auth", async (req, res) => {
	const user = req.body.user;
	const password = req.body.password;

	try {
		//GET DATA
		const db = await connectDB();
		let query = `Select idUser, firstName, lastName, email, status, user, gender 
		 				from ${entity} where user = (?) and password = ${typeEncryptPassword}((?)); `;
		const [results] = await db.query(query, [user, password]);
		//Message
		messageGreen(messageConsoleRequest(req, entity));

		//Generate token
		const token = null;
		if (results.length > 0) {
			const token = generateToken(user);
			//Return
			res.json({
				status: 200,
				statusText: `Auth user`,
				error: false,
				token: token,
			});
		} else {
			//Return
			res.json({
				status: 200,
				statusText: `Auth user Error: User or password incorrect`,
				error: false,
				token: token,
			});
		}
	} catch (error) {
		messageRed(messageConsoleRequest(req, entity) + `${error.message}`);
		res.status(500).json({
			status: 500,
			statusText: `Error: Auth user: ${error.message}`,
			error: true,
			data: [],
			token: null,
		});
	}
});

//Validate Authentication User send body object { token}
router.post("/authvalidate", async (req, res) => {
	const token = req.body.token;

	try {
		const validate = validateToken(token);
		if (validate)
			res.json({
				status: 200,
				statusText: `Auth validate token`,
				error: false,
				token: token,
			});
		else
			res.json({
				status: 200,
				statusText: `Auth validate token: Error token invalid`,
				error: true,
				token: null,
			});
	} catch (error) {
		messageRed(messageConsoleRequest(req, entity) + `${error.message}`);
		res.status(500).json({
			status: 500,
			statusText: `Error: Auth validate token: ${error.message}`,
			error: true,
			data: [],
			token: null,
		});
	}
});

module.exports = router;
