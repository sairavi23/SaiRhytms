var music = document.getElementById('audioPlayer'); // id for audio element
var duration = music.duration;  // Duration of audio clip
var pButton = document.getElementById('pButton'); // play button

var playhead = document.getElementById('playhead'); // playhead

var timeline = document.getElementById('timeline'); // timeline
// timeline width adjusted for playhead
var timelineWidth = timeline.offsetWidth - playhead.offsetWidth;

// timeupdate event listener
music.addEventListener("timeupdate", timeUpdate, false);

//Makes timeline clickable
timeline.addEventListener("click", function (event) {
    moveplayhead(event);
    music.currentTime = duration * clickPercent(event);
}, false);

// returns click as decimal (.77) of the total timelineWidth
function clickPercent(e) {
    return (e.pageX - timeline.offsetLeft) / timelineWidth;
}

// Makes playhead draggable 
playhead.addEventListener('mousedown', mouseDown, false);
window.addEventListener('mouseup', mouseUp, false);

// Boolean value so that mouse is moved on mouseUp only when the playhead is released 
var onplayhead = false;
// mouseDown EventListener
function mouseDown() {
    onplayhead = true;
    window.addEventListener('mousemove', moveplayhead, true);
    music.removeEventListener('timeupdate', timeUpdate, false);
}
// mouseUp EventListener
// getting input from all mouse clicks
function mouseUp(e) {
    if (onplayhead == true) {
        moveplayhead(e);
        window.removeEventListener('mousemove', moveplayhead, true);
        // change current time
        music.currentTime = duration * clickPercent(e);
        music.addEventListener('timeupdate', timeUpdate, false);
    }
    onplayhead = false;
}
// mousemove EventListener
// Moves playhead as user drags
function moveplayhead(e) {
    var newMargLeft = e.pageX - timeline.offsetLeft;
    if (newMargLeft >= 0 && newMargLeft <= timelineWidth) {
        playhead.style.marginLeft = newMargLeft + "px";
    }
    if (newMargLeft < 0) {
        playhead.style.marginLeft = "0px";
    }
    if (newMargLeft > timelineWidth) {
        playhead.style.marginLeft = timelineWidth + "px";
    }
}

// timeUpdate 
// Synchronizes playhead position with current point in audio 
function timeUpdate() {
    var playPercent = timelineWidth * (music.currentTime / duration);
        document.getElementById('songduration').innerText = isNaN(music.duration)? '' : TimeConvert(music.duration); 
        document.getElementById('songcurrent').innerText = isNaN(music.currentTime)? '': TimeConvert(music.currentTime);    
        playhead.style.marginLeft = playPercent + "px";
        if (music.currentTime == duration) {
            pButton.className = "";
            pButton.className = "play";
        }
}

//Play and Pause
function play() {
    // start music
    if (music.paused) {
        music.play();
        checkPlayError(music);
        // remove play, add pause
        pButton.className = "";
        pButton.className = "pause";
    } else { // pause music
        music.pause();
        // remove pause, add play
        pButton.className = "";
        pButton.className = "play";
    }
}

function TimeConvert(seconds) {
    minutes = Math.floor(seconds / 60);
    minutes = (minutes >= 10) ? minutes : "0" + minutes;
    seconds = Math.floor(seconds % 60);
    seconds = (seconds >= 10) ? seconds : "0" + seconds;
    return minutes + ":" + seconds;
}

// Gets audio file duration
music.addEventListener("canplaythrough", function () {
    duration = music.duration;  
}, false);

function checkPlayError(music)
{
    music.addEventListener('error', function failed(e) {
// audio playback failed - show a message saying why
// to get the source of the audio element use $(this).src
        document.getElementById('nointernet').style = "block";
        switch (e.target.error.code) {
        case e.target.error.MEDIA_ERR_ABORTED:
        document.getElementById('nointernet').innerHTML = "Audio could not be played due to a Error";
            break;
        case e.target.error.MEDIA_ERR_NETWORK:
        document.getElementById('nointernet').innerHTML = "Audio could not be played due to  internet issue";
            break;
        case e.target.error.MEDIA_ERR_DECODE:
        document.getElementById('nointernet').innerHTML = "Audio could not be played due to corruption issue";
            break;
        case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
            document.getElementById('nointernet').innerHTML = "Audio could not be played due to bad audio format";
            break;
        default:
            document.getElementById('nointernet').innerHTML = "Audio could not be played due to a Error";
            break;
        }
    }, true);
}