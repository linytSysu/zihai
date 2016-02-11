var express = require('express');
var Blog = require('../models/Blog');
var Tag = require('../models/Tag');
var Comment = require('../models/Comment');
var User = require('../models/User');
var router = express.Router();
var markdown = require('markdown').markdown;
var md5 = require('md5');

var isAuthenticated = function(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  Blog.find({}).populate({path: 'tags'}).exec(function(err, blogs) {
    if (err) {
      console.log('error');
    } else {
      blogs.forEach(function(blog){
        blog.content = markdown.toHTML(blog.content);
      });
      res.render('index', {blogs: blogs});
    }
  });
});

router.get('/blog/:name', function(req, res, next) {
  Blog.findOne({url: req.params.name}).populate({path: 'tags'}).exec(function(err, blog) {
    if (err) {
      console.log('error');
    } else {
      if (blog) {
        blog.content = markdown.toHTML(blog.content);
        Comment.findOne().sort({level: -1}).exec(function(err, doc) {
          var deep = 'childrenComment';
          if (doc) {
            for (var i = 1; i < doc.level; i++) {
              deep = deep.concat('.childrenComment');
            }
          }
          Comment.find({targetBlog: blog._id, level: 0}).deepPopulate(deep).exec(function(err, comments) {
            res.render('blog', { blog: blog, comments: comments, user: req.session.user});
          });
        });
       }
    }
  });
});

router.get('/create', isAuthenticated, function(req, res, next) {
  res.render('create');
});

router.get('/edit/:name', function(req, res, next) {
  Blog.findOne({url: req.params.name}).populate({path: 'tags'}).exec(function(err, blog) {
    if (err) {
        console.log('error');
    } else {
        res.render('edit', { blog: blog });
    }
  });
});

router.post('/create', isAuthenticated, function(req, res, next) {
  var title = req.body.title;
  var url = req.body.url;
  var content = req.body.content;
  var preview = req.body.preview;
  var tags = JSON.parse(req.body.tags);
  var date = new Date();
  var tagsId = new Array();
  
  tags.forEach(function(tagName){
    var tag = new Tag({
      name: tagName,
      createDate: date,
      refTimes: 1
    });
    tag.save(function(err, obj) {
      if (err) {
        Tag.findOne({name: tagName}, function(err2, obj2) {
          tagsId.push(obj2._id);
          Tag.update({name: tagName}, {$inc: {refTimes: 1}}, function(err3, info){});
          if (tagName == tags[tags.length-1]) {
            var newBlog = new Blog({
              title     : title,
              author    : 'linyiting',
              url       : url,
              content   : content,
              preview   : preview,
              startDate : date,
              updateDate: date,
              tags      : tagsId,
            });
            newBlog.save(function(err) {
              if(err) {
                console.log(err);
              } else {
                res.send('/blog/'+url);
              }
            });
          }
        });
      } else {
        tagsId.push(obj._id);
        if (tagName == tags[tags.length-1]) {
          var newBlog = new Blog({
            title     : title,
            author    : 'linyiting',
            url       : url,
            content   : content,
            preview   : preview,
            startDate : date,
            updateDate: date,
            tags      : tagsId,
          });
          newBlog.save(function(err) {
            if(err) {
              console.log(err);
            } else {
                res.send('/blog/'+url);
            }
          }); 
        }
      }
    });
  });
});

router.post('/update', function(req, res, next) {
  var id = req.body.id;
  var title = req.body.title;
  var url = req.body.url;
  var content = req.body.content;
  var tagName = req.body.tags;
  var date = new Date();
  Tag.findOne({name: tagName}, function(err, tag) {
    Blog.update({_id: id}, 
                {$set: {title: title, url: url, content: content, tags: tag.id, updateDate: date}}, 
                function(err, blog) {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/blogs');
      }
    });
  });
});

router.get('/alltags', function(req, res, next) {
  Tag.find({}, function(err, tags) {
    if (err) {
      console.log('error');
    } else {
      res.json({tags: tags})
    }
  });
});

router.get('/tags', function(req, res, next) {
  Tag.find({}, function(err, tags) {
    if (err) {
      console.log('error');
    } else {
      res.render('tags', {tags: tags});
    }
  });
});

router.get('/tag/:name', function(req, res, next) {
  var tagName = req.params.name;
  var blogsArr = new Array();
  Blog.find({}).populate({path: 'tags'}).exec(function(err, blogs){
    if (err) {
      console.log('error');
    } else {
      blogs.forEach(function(blog) {
        blog.tags.forEach(function(tag) {
          if (tag.name == tagName) {
            blogsArr.push(blog);
            blog.content = markdown.toHTML(blog.content);
          }
        });
      });
      res.render('tag', {tagName: tagName, blogs: blogsArr});
    }
  });
});

router.post('/comment', function(req, res, next) {
  var targetBlog = req.body.targetBlog;
  var targetComment = req.body.targetComment;
  var name = req.body.name;
  var email = req.body.email;
  var website = req.body.website;
  var content = req.body.content;
  var date = new Date();
  var level = 0;
  if (targetComment) {
    level = 1;
  }
  Comment.create({
    name           : name,
    level          : level,
    email          : md5(email),
    website        : website,
    content        : content,
    createDate     : date,
    updateDate     : date,
    targetBlog     : targetBlog,
    childrenComment: [] },
    function(err, obj) {
      if (err) {
        console.log(err);
      } else {
        Comment.findOneAndUpdate({_id: targetComment}, {$push: {childrenComment: obj._id}}, function(err, obj2) {
          if (obj2) {
            Comment.findOneAndUpdate({_id: obj._id}, {$set: {level: obj2.level+1}}, function() {
               res.send('created');
            });
          } else {
            res.send('created');
          }
        });
      }
    }
  );
});

router.get('/archive', function(req, res, next) {
  // sort according the date
  Blog.find({}).select('title url updateDate').sort({updateDate: -1}).exec(function(err, docs) {
    if (err) {
      console.log(err);
    } else {
      var blogs2015 = new Array();
      var blogs2016 = new Array();
      for (var index in docs) {
        if(docs[index].updateYear == 2015) {
            blogs2015.push(docs[index]);
        } else if (docs[index].updateYear == 2016) {
            blogs2016.push(docs[index]);
        }
      }
      res.render('archive', {archive_blogs: {'2016': blogs2016, '2015': blogs2015} });
    }
  });
});

router.get('/login', function(req, res, next) {
   res.render('login'); 
});

router.post('/login', function(req, res, next) {
  console.log(req.body.username, req.body.password);
  User.findOne({ username: req.body.username, password: req.body.password}, function(err, user) {
    if (!user) {
        console.log('no such user');
        res.redirect('/login');
    } else {
        req.session.user = user;
        res.redirect('/');
    }
  });
});

router.get('/logout', function(req, res, next) {
   req.session.destroy();
   res.redirect('/'); 
});

module.exports = router;
