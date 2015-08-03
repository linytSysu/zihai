var mongoose = require('mongoose');

BlogSchema = new mongoose.Schema ({
	title: String,
	author: String,
	url: String,
	content: String,
	startDate: Date,
	updateDate: Date,
	tags: [{type: mongoose.Schema.Types.ObjectId, ref: 'Tag'}]
});

module.exports = mongoose.model('Blog', BlogSchema);
