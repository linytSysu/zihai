var express = require('express');
var Blog = require('../models/Blog');
var Tag = require('../models/Tag');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  Tag.findOne({name: 'hello'}, function(err, obj) {
  	if (err) {
  		console.log('error');
  	} else {
  		if (obj == null) {
  			var date = new Date();
  			var tag = new Tag({
  				name: 'hello',
  				createDate: date,
  				refTimes: 1,
  				blogs: []
  			});
  			tag.save(function(err) {
  				if (err) {
  					console.log(err);
  				}
  			});
  		}
  	}
  });

  Blog.findOne({title: 'Hello world'}, function(err, obj) {
  	if (err) {
  		console.log('error');
  	} else {
  		if (obj == null) {
		  	var date1 = new Date();
		  	Tag.findOne({name: 'hello'}, function(err, tag) {
		  		var blog = new Blog({
				  	title: 'Hello world',
				  	author: 'Lin Yiting',
				  	url: 'hello-world',
				  	content: 'Mongoose provides a straight-forward, schema-based solution to modeling your application data and includes built-in type casting, validation, query building, business logic hooks and more, out of the box.',
				  	startDate: date1,
				    updateDate: date1,
				    tags: [tag._id]
				  });
				  blog.save(function(err) {
				  	if (err) {
				  		console.log('error');
				  	}
				  });
		  	});
		  } else {
		  	console.log(obj.url);
		  }
	  }
  });
  Blog.find({}, function(err, blogs) {
  	if (err) {
  		console.log('error');
  	} else {
      res.render('index', { title: 'Express', blogs: blogs});
  	}
  });
});

router.get('/blog/:name', function(req, res, next) {
	console.log(req.params.name);
	Blog.findOne({url: req.params.name}, function(err, obj) {
		if (err) {
			console.log('error');
		} else {
			if (obj == null) {
				res.redirect('/');
			} else {
				Blog.find({}, function(err, blogs) {
			  	if (err) {
			  		console.log('error');
			  	} else {
			      res.render('blog', { blogs: blogs, blog: obj});
			  	}
			  });
			}
		}
	});
});

module.exports = router;
