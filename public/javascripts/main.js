$(document).ready(function() {

    updateGlyphicons();

    //Search
    $('#query_form').on("submit", function(e) {
        e.preventDefault();
        clickSearch();
    });

    //Set up control event handlers if full page refresh...
    if ($('#content').html()) {
        $('.play').click(playEntry);
        $('.add').click(addEntry);
        $('.next').click(nextEntry);
        $('.queue').click(queueEntry);
    }

    $('#play_pause').click(playPause);

    $('#progress_bar').mousemove(mouseOnBar);
    $('#progress_bar').mouseleave(mouseOffBar);



    //$('#library_nav').click(prepareLibrary);

});

$(window).on('popstate', function() {
    location.search ? $('#query').val(decodeURI(location.search.split("=")[1])) :
      $('#query').val("");
    clickSearch();


    //Issue: two searches, two backs doesn't return to /main
    //fix later...
});

function clickSearch() {
    var q = encodeURI($('#query').val());
    if (q) {
        var url = "/main/search?q=" + q;
        history.pushState(null, null, url);

        $('#content').load("/main/search?q=" + q, function() {
            //Set up button event handlers
            $('.play').click(playEntry);
            $('.add').click(addEntry);
            $('.next').click(nextEntry);
            $('.queue').click(queueEntry);
        });
    } else {
        $('#content').html("");
        history.pushState(null, null, "/main");
    }
} 

function updateGlyphicons() {
    $('.glyphicon').html(function() {
        var glyph = document.createElement('img')
        glyph.setAttribute('src', "/images/glyphicons/" + this.classList[1] + ".png")
        glyph.setAttribute('alt', this.classList[1]);
        return glyph;
    });
}

function addEntry() {
    $('#add_title').val(this.parentNode.parentNode.childNodes[1].innerHTML);
    $('#overlay').css('display', '');
    
    $('#add_form').on('submit', function(e) {
        e.preventDefault();

        var data = {
            title: $('#add_title').val(),
            artist: $('#add_artist').val(),
            album: $('#add_album').val(),
            genre: $('#add_genre').val()
        };

        $.post('/api/library', data, function() {
            $('#overlay').css('display', 'none');
            $('#add_form input').val('');
        });
    });

    $('#add_cancel').click(function(e) {
        e.preventDefault();
        $('#overlay').css('display', 'none');
        $('#add_form input').val('');
    });
}
    
