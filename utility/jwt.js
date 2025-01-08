const jwt = require("jsonwebtoken");

//JWT
////////////////////////////////////////////////////////////////
const generateToken = (usedId) => {
	const jwtSecretKey = process.env.JWT_SECRET_KEY;
	const data = {
		time: Date.now(),
		userId: usedId,
	};
	return jwt.sign(data, jwtSecretKey);
};

const validateToken = (tokenHeaderKeyUser) => {
	const jwtSecretKey = process.env.JWT_SECRET_KEY;
	const tokenHeaderKey = process.env.TOKEN_HEADER_KEY;

	try {
		const verified = jwt.verify(tokenHeaderKeyUser, jwtSecretKey);
		if (verified) return true;
		else return false;
	} catch (error) {
		return false;
	}
};

module.exports = {
	generateToken,
	validateToken,
};
