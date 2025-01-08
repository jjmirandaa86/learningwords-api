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
const entity = "Type";
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
		query = `SELECT idType, name, status 
					FROM ${entity} LIMIT ${limit} OFFSET ${offSet}; `;
		const [results] = await db.query(query);

		//Pagination
		const paginationData = pagination(page, limit, offSet, totalData, req);

		//Message
		messageGreen(messageConsoleRequest(req, entity));
		message = results.length !== 0 ? "Get all type" : "No data available.";

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
			statusText: `Error: Get all type, ${error.message}`,
			error: true,
			data: [],
			totalData: 0,
			page: 0,
			pagination: {},
		});
	}
});

//GET - By ID
router.get("/:id", async (req, res) => {
	const idType = parseInt(req.params.id);
	try {
		//GET DATA
		const db = await connectDB();
		let query = `SELECT idType, name, status
					FROM ${entity} WHERE idType = (?); `;
		const [results] = await db.query(query, idType);
		//Message
		messageGreen(messageConsoleRequest(req, entity));

		//Return
		res.json({
			status: 200,
			statusText: `Get Type id ${idType}`,
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
			statusText: `Error: Get Type idType: ${idType}, ${error.message}`,
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
	const idType = parseInt(req.params.id); // not edit, only for process query
	const name = req.body.name;
	const status = req.body.status;

	try {
		//GET DATA
		const db = await connectDB();
		let query = `UPDATE ${entity} SET name = (?), status = (?)
					where idType = (?); `;
		const [results] = await db.query(query, [name, status, idType]);
		//Message
		messageGreen(messageConsoleRequest(req, entity));

		//Return
		res.json({
			status: 200,
			statusText: `Put Type idType ${idType}`,
			error: false,
			data: results,
		});
	} catch (error) {
		messageRed(messageConsoleRequest(req, entity) + `${error.message}`);
		res.status(500).json({
			status: 500,
			statusText: `Error: Put Type idType: ${idType}, ${error.message}`,
			error: true,
			data: [],
		});
	}
});

//ADD -> send body object {}
router.post("/", async (req, res) => {
	//idType
	const name = req.body.name;
	const status = req.body.status;

	try {
		//GET DATA
		const db = await connectDB();
		let query = `INSERT ${entity} (name, status ) 
						values ((?), (?)); `;
		const [results] = await db.query(query, [name, status]);
		//Message
		messageGreen(messageConsoleRequest(req, entity));

		//Return
		res.json({
			status: 200,
			statusText: `Add Type`,
			error: false,
			data: results,
		});
	} catch (error) {
		messageRed(messageConsoleRequest(req, entity) + `${error.message}`);
		res.status(500).json({
			status: 500,
			statusText: `Error: Add Type: ${error.message}`,
			error: true,
			data: [],
		});
	}
});

//DELETE - By ID
router.delete("/:id", async (req, res) => {
	const idType = parseInt(req.params.id);
	try {
		//GET DATA
		const db = await connectDB();
		let query = `Delete from ${entity} WHERE idType = (?);`;
		const [results] = await db.query(query, idType);
		//Message
		messageGreen(messageConsoleRequest(req, entity));

		//Return
		res.json({
			status: 200,
			statusText: `Delete type id ${idType}`,
			error: false,
			data: results,
		});
	} catch (error) {
		messageRed(messageConsoleRequest(req, entity) + `${error.message}`);
		res.status(500).json({
			status: 500,
			statusText: `Error: Delete Type idType: ${idType}, ${error.message}`,
			error: true,
			data: [],
		});
	}
});

module.exports = router;
