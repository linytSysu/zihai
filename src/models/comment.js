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

CommentSchema.virtual('updateTime').get(function() {
  var month, date, hour, minute;
  month = this.updateDate.getMonth() + 1 >= 10
    ? (this.updateDate.getMonth() + 1) + ""
    : "0" + (this.updateDate.getMonth() + 1);
  date = this.updateDate.getDate() >= 10
    ? this.updateDate.getDate() + ""
    : "0" + this.updateDate.getDate();
  hour = this.updateDate.getHours() >= 10
    ? this.updateDate.getHours() + ""
    : "0" + this.updateDate.getHours();
  minute = this.updateDate.getMinutes() >= 10
    ? this.updateDate.getMinutes() + ""
    : "0" + this.updateDate.getMinutes();
  return this.updateDate.getFullYear() + "/" + month + "/" + date + " " + hour + ":" + minute;
});

module.exports = mongoose.model('Comment', CommentSchema);