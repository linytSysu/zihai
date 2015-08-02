var mongoose = require('mongoose');

BlogSchema = new mongoose.Schema ({
	id: String,
	title: String,
	content: String,
	startDate: Date,
	updateDate: Date
});

module.exports = mongoose.model('Blog', BlogSchema);
