var express = require('express');
var Blog = require('../models/Blog');
var Tag = require('../models/Tag');
var Comment = require('../models/Comment');
var User = require('../models/User');
var router = express.Router();
var markdown = require('markdown').markdown;

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login');
  }
}

module.exports = function(passport) {
  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('index');
  });

  router.get('/login', function(req, res, next) {
    // var user = new User({
    //   username: 'admin',
    //   password: hash('admin')
    // });
    // user.save(function(err, obj) {});
    res.render('login');
  });

  router.get('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/');
  });

  router.post('/login', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));

  router.get('/blogs', function(req, res, next) {
    Blog.find({}).populate({path: 'tags'}).exec(function(err, blogs) {
      if (err) {
        console.log('error');
      } else {
        blogs.forEach(function(blog){
          blog.content = markdown.toHTML(blog.content);
        });
        res.render('blogs', {blogs: blogs});
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
            for (var i = 1; i < doc.level; i++) {
              deep = deep.concat('.childrenComment');
            }
            Comment.find({targetBlog: blog._id, level: 0}).deepPopulate(deep).exec(function(err, comments) {
              res.render('blog', { blog: blog, comments: comments, user: req.user});
            });
          });
        }
      }
    });
  });

  router.get('/create',  isAuthenticated, function(req, res, next) {
    res.render('create');
  });

  router.get('/edit/:name',  isAuthenticated, function(req, res, next) {
    Blog.findOne({url: req.params.name}).populate({path: 'tags'}).exec(function(err, blog) {
      if (err) {
        console.log('error');
      } else {
        res.render('edit', { blog: blog });
      }
    });
  });

  router.post('/create',  isAuthenticated, function(req, res, next) {
    var title = req.body.title;
    var url = req.body.url;
    var content = req.body.content;
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
            // Tag.update({name: tagName}, {$inc: {refTimes: 1}}, function(err3, info){});
            if (tagName == tags[tags.length-1]) {
              var newBlog = new Blog({
                title     : title,
                author    : 'linyiting',
                url       : url,
                content   : content,
                startDate : date,
                updateDate: date,
                tags      : tagsId,
              });
              newBlog.save(function(err) {
                if(err) {
                  console.log(err);
                } else {
                  res.redirect('/blog/'+url);
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
              startDate : date,
              updateDate: date,
              tags      : tagsId,
            });
            newBlog.save(function(err) {
              if(err) {
                console.log(err);
              } else {
                res.redirect('/blog/'+url);
              }
            }); 
          }
        }
      });
    });
  });

  router.post('/update',  isAuthenticated, function(req, res, next) {
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
            }
          });
        });
        res.render('tag', {blogs: blogsArr});
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
    Comment.create(
      {name: name,
       level: level,
       email: email,
       website: website,
       content: content,
       createDate: date,
       updateDate: date,
       targetBlog: targetBlog,
       childrenComment: []
      },
      function(err, obj) {
        if (err) {
          console.log(err);
        } else {
          Comment.findOneAndUpdate({_id: targetComment}, {$push: {childrenComment: obj._id}}, function(err, obj2) {
            if (obj2) {
              Comment.findOneAndUpdate({_id: obj._id}, {$set: {level: obj2.level+1}}, function() {
              });
            }
          });
        }
      }
    );
  });

  router.get('/comment/:hello?', function(req, res, next) {
    console.log(req.query.hello);
  });
  return router.get('/comments', function(req, res, next) {
  });
}



// 1. 对于path中的变量，均可以使用req.params.xxxxx方法
// 2. 对于get请求的?xxxx=,使用req.query.xxxxx方法
// 3. 对于post请求中的变量，使用req.body.xxxxx方法
// 4. 以上三种情形，均可以使用req.param()方法，
//    所以说req.param()是req.query、req.body、以及req.params
//    获取参数的三种方式的封装。


// Mongoose: the difference between id and _id
// methods, static methods
// virtual