jQuery(document).ready(function($) {
    $('#show-tags').click(function(event) {
        if ($('#tags_block').length == 0) {
        	$.get('/tags', function(data) {
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
});