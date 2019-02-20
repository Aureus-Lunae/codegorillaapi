`use strict`;

module.exports = (app) => {
	const gorillas = require(`../controllers/gorillaController`);
	const auth = require(`../../auth/authController`)

	app.route(`/test/users`)
		.get(gorillas.testlistAllUsers)

	/**
	 * Routes
	 */

	// userdata Routes
	app.route(`/users`)
		.get(gorillas.listAllUsers);

	app.route(`/users/:userId`)
		.get(gorillas.readAnUser)
		.delete(gorillas.deleteAnUser);

	app.route(`/me`)
		.get(gorillas.getOwnData);
		
	// Auth routes
	app.route(`/register`)
		.post(auth.registerUser);

	app.route(`/login`)
		.post(auth.loginUser);

	app.route(`/logout`)
		.get(auth.logoutUser);
};