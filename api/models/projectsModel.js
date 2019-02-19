const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
	name: {
		type: String,
		required: `Please add a project name`
	}
	userID: [
		{ type: Schema.Types.ObjectId, ref: `Users` }
	],
	github: String,
	site: String,
	views: Number,
	programmingLanguages: Array,
	projectTime: String
});

module.exports = mongoose.model(`Projects`, ProjectSchema);