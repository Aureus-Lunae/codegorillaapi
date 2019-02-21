`use strict`;

module.exports = (app) => {
	const gorillas = require(`../controllers/gorillaController`);
	const projects = require(`../controllers/projectsController`);
	const auth = require(`../../auth/authController`);

	app.route(`/test`)
		.get(gorillas.test)

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

	//User Project Route
	app.route(`/users/:userId/projects`)
		.get(projects.showAllProjectsFromUser);

	// projectData Routes
	app.route(`/projects`)
		.get(projects.showAllProjects);

	app.route(`/projects/:projectId`)
		.get(projects.showProject)
		.put(projects.editProject);

	app.route(`/projects/add`)
		.post(projects.addProject);
};