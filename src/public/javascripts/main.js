jQuery(document).ready(function($) {
  showTags();
  highlight();
  createSubmit();
  commentSubmit();
  checkTagInput();
  showMenu();
});

function showTags() {
  $('#show-tags').click(function(event) {
    if ($('#tags-block').length == 0) {
      $.get('/alltags', function(data) {
        var tags = data.tags;
        var tags_block = $('<div id="tags-block"></div>');
        for (var i = 0; i < tags.length; i++) {
          var tag_item = $('<span class="tag-item"></span>')
                  .append(tags[i].name)
                  .appendTo(tags_block);
        }
        tags_block.insertAfter('#show-tags');
        addTag();
      });
    }
  });
}
function addTag() {
  var tagItems = $('.tag-item');
  for (var i = 0; i < tagItems.length; i++) {
    $(tagItems[i]).click(function(i) {
      return function() {
        if ( tagCanAdded($(tagItems[i]).text()) ) {
          $('#tags-shower').append("<span class='added-tag'>"+$(tagItems[i]).text()+"</span>");
          $(tagItems[i]).remove();
        }
      }
    }(i));
  }
}
function checkTagInput() {
  $('#tags').keydown(function(event) {
    if (event.keyCode == 13 || event.keyCode == 32) {
      if ($('#tags').val() !== '' && $('#tags').val() !== ' ') {
        if ( tagCanAdded($('#tags').val()) ) {
          $('#tags-shower').append("<span class='added-tag'>"+$('#tags').val()+"</span>");
          $('#tags').val('');
          $('#tags').width($('#tags-editor').width()-$('#tags-shower').width()-10);
        }
      } else {
        $('#tags').val('');
      }
    }
    if (event.keyCode == 8) {
      if ($('#tags').val() == '' && getAddedTagsNumber() > 0) {
        var last = $('#tags-shower').children('span').last();
        $('#tags').val(last.text());
        last.remove();
        var w = $('#tags-shower').width();
        $('#tags').width($('#tags-editor').width()-$('#tags-shower').width()-10);
      }
    }
  });
  // $('#tags').keyup(function(event) {
  //   if (event.keyCode == 13 || event.keyCode == 32) {
  //     $('#tags').val('');
  //   }
  // });
}
function getAddedTagsNumber() {
  return $('#tags-shower').children('span').length;
}
/**
 * Check whether if the tag can be added according the content
 * @param  {[String]} content
 * @return {[boolean]}
 */
function tagCanAdded(content) {
  if (getAddedTagsNumber() > 4) {
    return false;
  }
  var tags = $('#tags-shower').children('span');
  for (var i = 0; i < tags.length; i++) {
    if ($(tags[i]).text() == content) {
      return false;
    }
  }
  return true;
}



function createSubmit() {
  $('#create-submit').click(function(event) {
    var title = $('#title').val();
    var url = $('#url').val();
    var content = $('#content').val();
    var tagSpans = $('#tags-shower').children('span');
    var tags = new Array();
    for (var i = 0; i < tagSpans.length; i++) {
      tags.push($(tagSpans[i]).text());
    }
    $.ajax({
      url: '/create',
      type: 'POST',
      data: {
        title: title,
        url: url,
        content: content,
        tags: JSON.stringify(tags)
      },
      success: function(data){
        // console.log(data);
      }
    });
  });
}

function commentSubmit() {
  $('#comment-submit').click(function(event) {
    var target_blog = $('input[name="target_blog"]').val();
    var parent_comment = $('input[name="parent_comment"]').val();
    var name = $('#name').val();
    var email = $('#email').val();
    var website = $('#website').val();
    var content = $('#content').val();
    $.ajax({
      url: '/comment',
      type: 'POST',
      data: {
        targetBlog : target_blog,
        targetComment: parent_comment,
        name: name,
        email: email,
        website: website,
        content: content
      },
      success: function(data) {
        location.reload();
      }
    });
  });
}

function highlight() {
  var codeBlock = $('pre code');
  for(var i = 0; i < codeBlock.length; i++) {
    var content = $(codeBlock[i]).text();
    var lang = content.split('\n')[0];
    content = content.replace(lang+'\n', '');
    $(codeBlock[i]).text(content);
    $(codeBlock[i]).addClass(lang).addClass('railscasts');
  }
}

function showMenu() {
  var autoHeight = '170px';
  var isFinished = true;
  $('#menu-button').click(function(event) {
    if ($('.sidebar-links').height() == 0 && isFinished) {
      isFinished = false;
      $('.sidebar-links').animate( {height: autoHeight}, 200, function() {
        isFinished = true;
        $('#menu-button-icon').removeClass('fa-bars').addClass('fa-remove');
      });
    } else if (isFinished) {
      isFinished = false;
      $('.sidebar-links').animate({ height: 0}, 200, function() {
        isFinished = true;
        $('#menu-button-icon').removeClass('fa-remove').addClass('fa-bars');
      });
    }
  });
}

function moveForm(para) {
  $('.comment-cancel-button').remove();
  // console.log($('.comment-cancel-button').length);
  // $('#'+para).append($('#comment-form'));
  // console.log();
  $('#comment-form').insertAfter($('#'+para+' .comment-self')[0]);
  $('#comment-form').prepend('<span class="comment-cancel-button"><i class="fa fa-remove"></i></span>');
  $('input[name="parent_comment"]').val(para);

  $('.comment-cancel-button').click(function(event) {
    $('.comment-cancel-button').remove();
    $('.main').append($('#comment-form'));
    $('input[name="parent_comment"]').val('');
  });
}
