const express = require("express");
const dot = require("dotenv");
const connectDB = require("../db/db");
const {
	messageConsoleRequest,
	messageRed,
	messageGreen,
	pagination,
} = require("../utility/general");

const router = express.Router();
const limit = parseInt(process.env.ITEMS_PER_PAGE);
const entity = "Profile_Words";
let message = "";

//GET - All
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
		query = `SELECT *
					FROM ${entity} LIMIT ${limit} OFFSET ${offSet}; `;
		const [results] = await db.query(query);

		//Pagination
		const paginationData = pagination(page, limit, offSet, totalData, req);

		//Message
		messageGreen(messageConsoleRequest(req, entity));
		message =
			results.length !== 0 ? "Get all Profile words" : "No data available.";

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
			statusText: `Error: Get all Profile words, ${error.message}`,
			error: true,
			data: [],
			totalData: 0,
			page: 0,
			pagination: {},
		});
	}
});

//GET - By ID Profile
router.get("/profile/:id", async (req, res) => {
	const idProfile = parseInt(req.params.id);
	try {
		//GET DATA
		const db = await connectDB();
		let query = `SELECT *
					FROM ${entity} WHERE idProfile = (?); `;
		const [results] = await db.query(query, idProfile);
		//Message
		messageGreen(messageConsoleRequest(req, entity));

		//Return
		res.json({
			status: 200,
			statusText: `Get Profile words: idProfile ${idProfile}`,
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
			statusText: `Error: Get Profile words idProfile: ${idProfile}, ${error.message}`,
			error: true,
			data: [],
			totalData: 0,
			page: 0,
			pagination: {},
		});
	}
});

//GET - By ID Word
router.get("/word/:id", async (req, res) => {
	const idWords = parseInt(req.params.id);
	try {
		//GET DATA
		const db = await connectDB();
		let query = `SELECT *
					FROM ${entity} WHERE idWords = (?); `;
		const [results] = await db.query(query, idWords);
		//Message
		messageGreen(messageConsoleRequest(req, entity));

		//Return
		res.json({
			status: 200,
			statusText: `Get Profile words: idWords ${idWords}`,
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
			statusText: `Error: Get Profile words idWords: ${idWords}, ${error.message}`,
			error: true,
			data: [],
			totalData: 0,
			page: 0,
			pagination: {},
		});
	}
});

//ADD -> send body object {}
router.post("/", async (req, res) => {
	const idWords = parseInt(req.body.idWords);
	const idProfile = parseInt(req.body.idProfile);

	try {
		//GET DATA
		const db = await connectDB();
		let query = `INSERT ${entity} (idProfile, idWords ) 
						values ((?), (?)); `;
		const [results] = await db.query(query, [idProfile, idWords]);
		//Message
		messageGreen(messageConsoleRequest(req, entity));

		//Return
		res.json({
			status: 200,
			statusText: `Add Profile Words`,
			error: false,
			data: results,
		});
	} catch (error) {
		messageRed(messageConsoleRequest(req, entity) + `${error.message}`);
		res.status(500).json({
			status: 500,
			statusText: `Error: Profile Words: ${error.message}`,
			error: true,
			data: [],
		});
	}
});

//DELETE

module.exports = router;
