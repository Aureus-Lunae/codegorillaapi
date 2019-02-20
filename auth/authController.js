`user strict`;
const express = require(`express`);
const bodyParser = require(`body-parser`);
const Users = require(`../api/models/gorillaModel`);
const fs = require('fs');
const jwt = require(`jsonwebtoken`);
const bcrypt = require(`bcryptjs`);
const config = require(`../config`);

// PRIVATE and PUBLIC key
var privateKEY = fs.readFileSync('./auth/private.key', 'utf8');
var publicKEY = fs.readFileSync('./auth/public.key', 'utf8');

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
			res.send(err);
		} else {
			res.status(200).send({ message: 'Account created' });
		}
	});
};

exports.loginUser = (req, res) => {
	console.log(req.body);

	Users.findOne({ email: req.body.email }, (err, user) => {
		if (err) return res.status(500).send(`Error on the server.`);
		if (!user) return res.status(401).send({ error: `401`, msg: `User or Password incorrect` });

		let passwordIsValid = bcrypt.compareSync(req.body.password, user.passwordHash);
		if (!passwordIsValid) return res.status(401).send({ error: `401`, msg: `User or Password incorrect` });

		let token = jwt.sign({ id: user._id, rank: user.rights }, privateKEY, {
			expiresIn: "12h"
		});

		res.status(200).send({ auth: true, token: token, rank: user.rights })
	});
}

exports.logoutUser = (req, res) => {
	res.status(200).send({ auth: false, token: null });
}

exports.verifyToken = (token, res) => {
	let response;
	jwt.verify(token, privateKEY, (err, decoded) => {
		if (err) return res.status(500).send({ auth: false, message: `Failed to authenticate token.`, error: err });
		response = decoded;
	});
	return response;
}