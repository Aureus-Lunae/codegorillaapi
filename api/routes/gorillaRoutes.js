`use strict`;

module.exports = (app) => {
	const gorillas = require(`../controllers/gorillaController`);

	// Routes
	app.route(`/users`)
		.get(gorillas.listAllUsers)
		.post(gorillas.createUser);

	// app.route(`/users/:userId`)
	// 	.get(gorillas.read_an_user);
};