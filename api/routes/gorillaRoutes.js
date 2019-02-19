`use strict`;

module.exports = (app) => {
	const gorillas = require(`../controllers/gorillaController`);

	app.route(`/test/users`)
		.get(gorillas.testlistAllUsers)

	// Routes
	app.route(`/users`)
		.get(gorillas.listAllUsers)
		.post(gorillas.createUser);

	app.route(`/users/:userId`)
		.get(gorillas.readAnUser)
		.delete(gorillas.deleteAnUser);
};