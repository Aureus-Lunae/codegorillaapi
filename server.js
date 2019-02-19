const express = require(`express`),
	app = express(),
	port = process.env.PORT || 8000,
	mongoose = require(`mongoose`),
	Users = require(`./api/models/gorillaModel`),
	bodyParser = require(`body-parser`);
const cors = require(`cors`);

//Mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://localhost/CodeGorillas`, { useNewUrlParser: true });

mongoose.set('useCreateIndex', true);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const routes = require(`./api/routes/gorillaRoutes`);
routes(app);

app.listen(port);

console.log(`Gorilla REST api server started on: ${port}`);