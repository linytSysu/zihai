var mongoose = require('mongoose');

CommentSchema = new mongoose.Schema ({
	name: String,
	email: String,
	website: String,
	content: String,
	createDate: Date,
	updateDate: Date,
	target_blog: [{type: mongoose.Schema.Types.ObjectId, ref: 'Blog'}],
	target_commet: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
});

module.exports = mongoose.model('Comment', CommentSchema);