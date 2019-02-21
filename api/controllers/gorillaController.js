'use strict';
const mongoose = require(`mongoose`),
	Users = mongoose.model(`Users`);
const auth = require(`../../auth/authController`);

exports.test = (req, res, next) => {
	res.status(200).send({ "Fatal Error": `Gorillas have broken the API. Please Stand by while the gorillas are fixing it`, fix: { eta: `Unknown`, group: 2, "Gorilla Leader": `Thomas`, Gorillas: [`Bob`, `Erwin`] } });
};

/**
 * Functions for app.route(`/users`)
 */

exports.listAllUsers = (req, res, next) => {
	const { rank, sort } = req.query
	let query = {};
	let options = {};
	const sortColumns = [`firstName`, `lastName`];
	let sortby = 0;

	if (rank) {
		query.rights = rank.charAt(0).toUpperCase() + rank.slice(1);
	}

	if (sort) {
		sortby = sort.toLowerCase();
		if (sortby === `firstname`) {
			sortby = `firstName`;
		}
		if (sortby === `lastname`) {
			sortby = `lastName`;
		}
	}

	if (sortby !== 0) {
		console.log(sortby);
		if (!sortColumns.includes(sortby)) {
			console.log(`Error, does not exist`);
		} else {
			options.sort = {
				[sortby]: 1
			};
		}
	}

	Users.find(query, `-passwordHash`, options, (err, user) => {
		if (err) {
			res.send(err);
		} else {
			let response = JSON.stringify({ "data": user, "greetings": { "greeting": "Hallo", "code": `You won't be getting it` } });
			res.status(200).send(response);
		}
	});
};

/**
 * Functions for app.route(`/users/userId`)
 */
exports.readAnUser = (req, res, next) => {
	Users.findById(req.params.userId, `_id email firstName lastName specialty foto city hobbies rights`, (err, user) => {
		if (err) {
			res.send(err);
		} else {
			let response = JSON.stringify({ "data": user });
			res.send(response);
		}
	});
};

exports.deleteAnUser = (req, res) => {
	let token = req.headers[`x-access-token`];
	if (!token) return res.status(401).send({ auth: false, message: `No token provided` });
	let verifiedToken = auth.verifyToken(token, res);

	if (!verifiedToken) return res.status(500).send({ auth: false, message: `Failed to authenticate token.` });

	let hasAccess = auth.checkRights(verifiedToken.rank, `Super Admin`);
	if (!hasAccess) {
		if (req.params.userId !== verifiedToken.id) return res.status(401).send({ auth: false, message: `Not enough rights to delete an user` });
	}

	Users.remove({ _id: req.params.userId }, (err, user) => {
		if (err) {
			res.send(err);
		} else {
			console.log(`Delete User`);
			res.json({ message: 'user succesfully deleted' });
		}
	});
};

exports.getOwnData = (req, res) => {
	let token = req.headers[`x-access-token`];
	if (!token) return res.status(401).send({ auth: false, message: `No token provided` });
	let verifiedToken = auth.verifyToken(token, res);

	if (!verifiedToken) return res.status(500).send({ auth: false, message: `Failed to authenticate token.` });

	Users.findById(verifiedToken.id, `_id email firstName lastName specialty foto city hobbies rights`, (err, user) => {
		if (err) return res.status(500).send(`There was a problem finding the user.`);
		if (!user) return res.status(500).send({ auth: false, message: `Failed to authenticate token.`, error: err });

		res.status(200).send({ "data": user });
	});
}