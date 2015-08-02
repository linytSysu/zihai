var mongoose = require('mongoose');

BlogSchema = new mongoose.Schema ({
	id: String,
	title: String
});

module.exports = mongoose.model('Blog', BlogSchema);
