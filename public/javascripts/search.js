/*
var url = "https://www.googleapis.com/youtube/v3/";
var key = "AIzaSyC94lCdgtCm0-hejXYVZyCRdPoErSgx-oo";
searchPage = 1;
var currVideoId;
var currQuery;
var playQueue = [];



//Called when user clicks on 'Search'
//Reads search field, sends YouTube search info to 'showResults()'
function clickSearch() {
    $('#options .active').removeClass("active");
    if (state != "search") {
        $('#content').html("");
        $('#content').load("templates/search.php", function(response, status, xhr) {
            state = "search";

            $('#submit_add').click(function(e) {
                e.preventDefault();
                addMedia();
            });

            $('.pager a').click(newSearchPage);

            runSearch();
        });
    } else {
        runSearch();
    };
}

//Call YouTube API, run query and send results to showResults()
function runSearch() {
    document.getElementById("loading").style.display = "";

    currQuery = encodeURI(document.getElementById("query").value);
    
    var type = "search";
    var parts = ["id", "snippet"];
    var params = ["type", "q"];
    var values = ["video", currQuery];
    var fields = {vals: ["nextPageToken", "prevPageToken", "pageInfo"], "items": 
        {vals: ["id"], "snippet":
            {vals: ["title"], "thumbnails": {vals: ["default"]}}
        }
    };

    var request = new apiRequest(parts, fields, params, values, type);

    var ajax = new XMLHttpRequest();
    ajax.onload = showResults;
    ajax.open("GET", request.generateQuery());
    ajax.send();
}


//Called when user uses 'Previous' and 'Next' navigation
//Reloads results with pageToken contained in nav button clicked
function newSearchPage() {
    document.getElementById("loading").style.display = "";

    var query = currQuery; 

    var type = "search";
    var parts = ["id", "snippet"];
    var params = ["type", "q", "pageToken"];
    var values = ["video", query, this.getAttribute("name")];
    var fields = {vals: ["nextPageToken", "prevPageToken", "pageInfo"], "items": 
        {vals: ["id"], "snippet":
            {vals: ["title"], "thumbnails": {vals: ["default"]}}
        }
    }

    var request = new apiRequest(parts, fields, params, values, type);

    var ajax = new XMLHttpRequest();
    ajax.onload = showResults;
    ajax.open("GET", request.generateQuery());
    ajax.send();
}

//Show results of YouTube API request
function showResults() {
    var results = JSON.parse(this.responseText);
    
    //Clear content
    document.getElementById("loading").style.display = "none"; 
    document.getElementById("results").innerHTML = "";

    //Load search results w/ action buttons ... id of each result is corresponding video id
    var items = results.items;
    for (var i = 0; i < items.length; i++) {
        var item = results.items[i];

        $.get("templates/search_result.php", {
            video_id: item.id.videoId,
            name: item.snippet.title,
            thumb: item.snippet.thumbnails.default.url
        }, function(data) {
            var element = $.parseHTML(data);
            $('#results').append(element);
            $('#' + element[1].id + ' .btn').click(entryAction);
        }, "html");
    }

    var prev = $('#prev');
    var next = $('#next');
    console.log(results.prevPageToken);
    if (results.prevPageToken != undefined) {
        console.log("enable");
        prev.attr("name", results.prevPageToken);
        prev.parent().removeClass("disabled");
    } else {
        console.log("disable");
        prev.attr("name", "");
        prev.parent().addClass("disabled");
    }
    if (results.nextPageToken != undefined) {
        next.attr("name", results.nextPageToken);
        next.parent().removeClass("disabled");
    } else {
        next.attr("name", "");
        next.parent().addClass("disabled");
    }
}

//Call player functions based on what action button clicked
function entryAction() {
    var classes = this.className.split(" ");
    if (classes[2] == "play_entry") {
        loadVideo(this.parentNode.id);
    } else if (classes[2] == "next_entry") {
        playQueue.unshift(this.parentNode.id);
    } else if (classes[2] == "add_entry") {
        playQueue.push(this.parentNode.id);
    } else if (classes[2] == "save_entry") {
        //TODO: use algorithim to 'intelligently' populate fields
        var title = this.parentNode.getElementsByTagName("p")[0].innerHTML;
        $('#title_in').val(title);
        $('#id_in').val(this.parentNode.id);
    }
}

function addMedia() {
    //TODO: check form input, add alerts if bad input
    $.post("php_scripts/addToLibrary.php", {
        id: $('#id_in').val(),
        title: $('#title_in').val(),
        artist: $('#artist_in').val(),
        album: $('#album_in').val(),
        genre: $('#genre_in').val(),
    }, function(data) {
        $('#library_add input').val("");
        console.log(data);
    });
}

*/
