// Importing required modules
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");
dotenv.config();

const config = require('../../src/config');

const jwtCfg = {
	JWT_KEY: config?.security?.jwt?.key || 'heimattalksfu_jwt_secret',
	JWT_EXP: config?.security?.jwt?.exp || '1h',
};


// This function is used as middleware to authenticate user requests
exports.auth = async (req, res, next) => {
console.log(req.body)
	try {
		// Extracting JWT from request cookies, body or header
		const token =
			req.cookies.token ||
			req.body.token ||
			req.header("Authorization").replace("Bearer ", "");

			// const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imhvd3RvMTYwNzIwQGdtYWlsLmNvbSIsImlkIjoiNjczODg5ZjVmZmI1YzI3MTAxYTFhZTEzIiwicm9sZSI6IlVzZXIiLCJpYXQiOjE3MzIxNzgxNjh9.oxYiNnCGptoht1W2kRbimeQD8pvkqYNSGqXPbAGq-78"
		console.log(req.header)
		// If JWT is missing, return 401 Unauthorized response
		if (!token) {
			return res.status(401).json({ success: false, message: `Token Missing` });
		}

		try {

			// Verifying the JWT using the secret key stored in environment variables

			const decode = await jwt.verify(token, jwtCfg.JWT_KEY);
			// console.log(decode);
			// Storing the decoded JWT payload in the request object for further use
			req.user = decode;
		} catch (error) {
			// If JWT verification fails, return 401 Unauthorized response
			console.log(error)
			return res
				.status(401)
				.json({ success: false, message: "token is invalid" });
		}

		// If JWT is valid, move on to the next middleware or request handler
		next();
	} catch (error) {
		console.log(error)
		// If there is an error during the authentication process, return 401 Unauthorized response
		console.log(error)
		return res.status(401).json({
			success: false,
			message: `Something Went Wrong While Validating the Token`,
		});
	}
};


exports.isUser = async (req, res, next) => {
	try {
		const userDetails = await User.findOne({ email: req.user.email });

		if (userDetails.role !== "User") {
			return res.status(401).json({
				success: false,
				message: "This is a Protected Route for User",
			});
		}
		next();
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: `User Role Can't be Verified` });
	}
};

exports.isAdmin = async (req, res, next) => {
	try {
		const userDetails = await User.findOne({ email: req.user.email });

		if (userDetails.role !== "Admin") {
			return res.status(401).json({
				success: false,
				message: "This is a Protected Route for Admin",
			});
		}
		next();
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: `User Role Can't be Verified` });
	}
};






