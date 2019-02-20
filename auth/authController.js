`user strict`;
const express = require(`express`);
const bodyParser = require(`body-parser`);
const Users = require(`../api/models/gorillaModel`);
const fs = require('fs');
const jwt = require(`jsonwebtoken`);
const bcrypt = require(`bcryptjs`);

// PRIVATE and PUBLIC key
var privateKEY = fs.readFileSync('./auth/private.key', 'utf8');

/**
 * Registers an user if it exist
 * @param  {[JSON object]} req [Gets data from client]
 * @param  {[JSON object]} res [Response data to the client]
 */
exports.registerUser = (req, res) => {
	console.log(req.headers);
	console.log(req.body);
	console.log(req.body.email);
	req.body.passwordHash = bcrypt.hashSync(req.body.passwordHash, 12);
	console.log(req.body.passwordHash);
	let newUser = new Users(req.body);
	console.log(newUser);
	newUser.save((err, user) => {
		if (err) {
			res.status(500).send({ created: false, message: `Something went wrong with registering.`, error: err });
		} else {
			res.status(200).send({ created: true, message: 'Account created' });
		}
	});
};

/**
 * Login and logout system. Get email and password to check upon the hash, and only if both are correct, log the user in. Else it gives the 401: unauthorized access error. Tokens exist only for 12 hours before destroyed.
 */

exports.loginUser = (req, res) => {
	console.log(`Login test`);
	Users.findOne({ email: req.body.email }, (err, user) => {
		if (err) return res.status(500).send(`Error on the server.`);
		if (!user) return res.status(401).send({ error: `401`, msg: `User or Password incorrect` });

		let passwordIsValid = bcrypt.compareSync(req.body.password, user.passwordHash);
		if (!passwordIsValid) return res.status(401).send({ error: `401`, msg: `User or Password incorrect` });

		let token = jwt.sign({ id: user._id, rank: user.rights }, privateKEY, {
			expiresIn: "12h"
		});

		res.status(200).send({ auth: true, token: token, rank: user.rights, name: { first: user.firstName, last: user.lastName } })
	});
}

exports.logoutUser = (req, res) => {
	res.status(200).send({ auth: false, token: null });
}

/**
 * Verification functions
 * Only when a token is provided, it will return an auth access to the rest. Else it gives an error. And if you also want to check for rank, it checks the rank with minimum access rank, before continuing.
 */
exports.verifyToken = (token, res) => {
	let response;
	jwt.verify(token, privateKEY, (err, decoded) => {
		if (err) return res.status(500).send({ auth: false, message: `Failed to authenticate token.` });
		response = decoded;
	});
	return response;
}

exports.checkRights = (userRights, requiredRights) => {
	let hasAccess = false;
	console.log(`Rights: ${userRights} | Required: ${requiredRights}`);
	switch (userRights) {
		case 'Coach':
			if (requiredRights === `Student`) {
				hasAccess = true;
			}
			break;
		case `Super Admin`:
			hasAccess = true;
			break;
		default:
			hasAccess = false;
			break;
	}

	if (userRights === requiredRights) {
		console.log(`Same`);
		hasAccess = true;
		console.log(hasAccess);
	}
	console.log(`Has Acces: ${hasAccess}`);
	return hasAccess;
}