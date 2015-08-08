var express = require('express');
var Blog = require('../models/Blog');
var Tag = require('../models/Tag');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  Tag.find({}).exec(function(err, tags){
  });
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

  Blog.find({}).populate({path: 'tags'}).exec(function(err, blogs){
    console.log(blogs[0].tags[0].name);
  });

  Blog.find({}, function(err, blogs) {
  	if (err) {
  		console.log('error');
  	} else {
  		Tag.find({}, function(err, tags) {
          res.render('index', { blogs: blogs, tags: tags});
  		});
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
			  	  console.log(blogs.length);
            Tag.find({}, function(err, tags) {
              res.render('blog', { blogs: blogs, blog: obj, tags: tags});
            });
			  	}
			  });
			}
		}
	});
});

router.get('/blog-create', function(req, res, next) {
	Blog.find({}, function(err, blogs) {
  	if (err) {
  		console.log('error');
  	} else {
      Tag.find({}, function(err, tags) {
        console.log('asdhfjashdjkfhaskjhdjfkahsdfladskjhfajlllllllllllllk');
        console.log(blogs.length);
        res.render('create', { blogs: blogs, tags: tags});
      });
  	}
  });
});

module.exports = router;
