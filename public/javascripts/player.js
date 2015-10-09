var player;
var playQueue = [];
var progBarInterval;
var progBarCounter;
var currVideoDuration;


//Initial YouTube player setup
function onYouTubeIframeAPIReady() {
    player = new YT.Player('ytplayer', {
        height: '390',
        width: '640',
        events: {
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerStateChange(event) {
    if (event.data == 1) {          //playing
        $('#play_pause').removeClass("glyphicon-play");
        $('#play_pause').addClass("glyphicon-pause");
        updateGlyphicons();
        progBarInterval = parseInt($('#bar_bg').css('width') / event.target.getDuration());
        progBarCounter = window.setInterval(moveProgBar, 1000);

    } else if (event.data == 2) {   //paused
        window.clearInterval(progBarCounter);
        $('#play_pause').removeClass("glyphicon-pause");
        $('#play_pause').addClass("glyphicon-play");
        updateGlyphicons();

    } else if(event.data == 0) {    //ended
        window.clearInterval(progBarCounter);
        if (playQueue[0]) {
            loadVideo(playQueue.shift());
        } else {
            resetPlayer();
        }
    }
}

function loadVideo(videoId) {
    player.loadVideoById(videoId);
    
    $.get("/api/video", {
        id: videoId,
        token: $('#token').val()
    }, function(data) {
        updatePlayer(data)
    });
}

function updatePlayer(currVideo) {

    $('#title_playing').css('visibility', '');
    $('#title_playing').html(currVideo.items[0].snippet.title)

    //Duration encoded as 'PT#M#S,' change to [#,#]
    var duration = currVideo.items[0].contentDetails.duration.slice(2).split("M");
    duration[1] = duration[1].slice(0, duration[1].length - 1);

    //Save global variable duration in seconds
    currVideoDuration = parseInt(duration[0]*60) + parseInt(duration[1]);

    //Format for player display
    if (duration[1].length == 1) duration[1] = "0" + duration[1];
    var minSplit = duration[0].split("H");

    if (minSplit[0] != duration[0]) {
        duration[0] = parseInt(minSplit[0]) * 60 + parseInt(minSplit[1]);
    }

    $('#total_time').html(duration[0] + ':' + duration[1])
}


function resetPlayer() {
    $('#title_playing').css('visibility', 'hidden');
    $('#bar_fg').css('width', '0%');
    $('.player_time').html("00:00");
}
    

function moveProgBar() {
    if (player.getPlayerState() == 1) {
        var elapsedTime = player.getCurrentTime();
        $('#bar_fg').css("width", function() {
            return elapsedTime / currVideoDuration * 100 + "%";
        });

        var minutes = Math.floor(elapsedTime / 60);
        if (minutes == 0) minutes = "00";
        var seconds = Math.round(elapsedTime % 60);
        if (seconds < 10) seconds = "0" + seconds;
        if (seconds == 60) {
            minutes++;
            seconds = "00";
        }

        $('#curr_time').html(minutes + ":" + seconds);
    }
}

function mouseOnBar(event) {
    if (player.getPlayerState() != -1) {
        var pos = event.clientX - this.offsetLeft - this.parentNode.offsetLeft - 48;
        if (pos > 0 && pos < parseInt($("#bar_bg").css("width"))) {
            $('#timebubble').css("display", "");
            $('#timebubble').css("left", pos + 30 + "px");
            $('#time').html(getCurrTime(pos)); 
            $(this).click(changeTime);
        }
    }
}

function mouseOffBar() {
    $('#timebubble').css("display", "none");
}

function changeTime(event) {
    //Fix weird glitchy thing

    var bar_width = 320;
    var pos = event.clientX - this.offsetLeft - this.parentNode.offsetLeft - 48;
    window.clearInterval(progBarCounter);
    $('#bar_fg').css("width", pos/bar_width*100 + "%");
    player.seekTo(currVideoDuration * (pos/bar_width), true);
    progBarCounter = window.setInterval(moveProgBar, 1000);
}

function getCurrTime(pos) {
    var bar_width = 320;
    var time = currVideoDuration * (pos/bar_width);
    var minutes = Math.floor(time/60);
    var seconds = Math.round(time%60);

    if (minutes == 0) minutes = "00";
    if (seconds < 10) seconds = "0" + seconds;
    if (seconds == 60) {
        minutes++;
        seconds = "00";
    }

    return minutes + ":" + seconds;
}


function playPause() {
    var val = this.className.split(" ")[1].split("-")[1];

    if (val == "pause") {
        player.pauseVideo();
    } else if (val == "play") {
        player.playVideo();
    }
}

function playEntry() {
    loadVideo(this.parentNode.parentNode.id);
}

function nextEntry() {
    playQueue.push(this.parentNode.parentNode.id);
}

function queueEntry() {
    playQueue.unshift(this.parentNode.parentNode.id);
}
