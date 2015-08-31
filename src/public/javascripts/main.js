jQuery(document).ready(function($) {
  $('#show-tags').click(function(event) {
    if ($('#tags_block').length == 0) {
      $.get('/alltags', function(data) {
        var tags = data.tags;
        var tags_block = $('<div id="tags_block"></div>');
        for (var i = 0; i < tags.length; i++) {
          var tag_item = $('<span class="tag_item"></span>')
                  .append(tags[i].name)
                  .appendTo(tags_block);
        }
        tags_block.insertAfter('#show-tags');
      });
    }
  });
  highlight();
});

function highlight() {
  var codeBlock = $('pre code');
  console.log(codeBlock.length);
  for(var i = 0; i < codeBlock.length; i++) {
    var content = $(codeBlock[i]).text();
    var lang = content.split('\n')[0];
    content = content.replace(lang+'\n', '');
    $(codeBlock[i]).text(content);
    $(codeBlock[i]).addClass(lang).addClass('railscasts');
  }
}