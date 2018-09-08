var musiclink = "y";
$(function () {
    loadSaibhajan();
    var getQueryString = function (field, url) {
        var href = url ? url : window.location.href;
        var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
        var string = reg.exec(href);
        return string ? string[1] : null;
    };
    var id = getQueryString("id");
    var newBhajan = 0;

    $("#comment").click(function () {
        document.getElementById("msg").className = "";
        document.getElementById("msg").innerHTML = "";
    });

    $("#post").click
        (function () {
            saveComment(id);
            $("#FavLink").css("color", "DarkGreen");
            setTimeout(function () {
                $("#FavLink").css("color", "#234b8c");
            }, 3000);
        });

    function isFavorite(id) {
        var isFav = false;
        if (localStorage.getItem('Fav') != null) {
            var FavJson = JSON.parse(localStorage.getItem('Fav'));
            for (var i in FavJson) {
                if (FavJson[i].Id == id) {
                    document.getElementById("comment").value = FavJson[i].Comment;
                    isFav = true;
                    break;
                }
            }
        }
        return isFav;
    }

    function saveComment(id) {
        if (localStorage.getItem('Fav') === null) {
            var favi = [{ Id: id, Label: document.getElementById("songtitle").innerHTML, Deity: document.getElementById("songdeity").innerHTML, Comment: document.getElementById("comment").value }];
            localStorage.setItem('Fav', JSON.stringify(favi));
            document.getElementById("msg").className = "alert alert-success"
            document.getElementById("msg").innerHTML = "Saved successfully !!!";
        }
        else {
            var FavJson = JSON.parse(localStorage.getItem('Fav'));

            for (var i in FavJson) {
                if (FavJson[i].Id == id) {
                    FavJson[i].Comment = document.getElementById("comment").value;
                    newBhajan = 1
                }
            }

            if (newBhajan != 1) {
                newBhajanData = { Id: id, Label: document.getElementById("songtitle").innerHTML, Deity: document.getElementById("songdeity").innerHTML, Comment: document.getElementById("comment").value }
                FavJson.push(newBhajanData);
            }

            localStorage.setItem('Fav', JSON.stringify(FavJson));
            document.getElementById("msg").style.color = "green";
            document.getElementById("msg").innerHTML = "Saved successfully...";
        }

        changeFavoriteTagHtml(id, document.getElementById("songtitle").innerHTML, document.getElementById("songdeity").innerHTML);
    }

    function changeFavoriteTagHtml(id, title, deity) {
        $('#favourite').html('<span class="glyphicon glyphicon-star UnFavButton" href=# style="float:right;" onclick="return unfav(\'' + id + '\',\'' + title + '\',\'' + deity + '\')"></span>');
    }

    function unfav(id) {
        if (localStorage.getItem('Fav') != null) {
            var removeJson = JSON.parse(localStorage.getItem('Fav'));
            counter = -1;

            for (var i in removeJson) {
                counter = counter + 1;
                if (removeJson[i].Id == id) {
                    removeJson.splice(counter, 1);
                }
            }
            localStorage.setItem('Fav', JSON.stringify(removeJson));
        }
    }



    function loadSaibhajan() {

        if (localStorage.getItem('Fav') != null) {
            var FavJson = JSON.parse(localStorage.getItem('Fav'));
            for (var i in FavJson) {
                if (FavJson[i].Id == id) {
                    document.getElementById("comment").value = FavJson[i].Comment;
                }
            }
        }
        var aud = "";

        $.ajax({
            url: 'json/bhajan.json',
            type: 'GET',
            cache: false,
            dataType: 'JSON',
            success: function (data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].song_id == id) {
                        var lyrics = lyricsformat(data[i].lyrics);
                        var isFav = isFavorite(id);
                        var meaning = data[i].meaning;
                        var node1 = $("#result1");
                        var node2 = $("#result2");
                        var listHTML = '';
                        listHTML += '<div id=songdetail">'
                        listHTML += '<div id="songtitle" style="display: none;">' + data[i].title + '</div>'
                        if (!isFav) {
                            listHTML += '<span id="favourite"><span class="glyphicon glyphicon-star-empty FavButton" href=# style="float:right;"  onclick="return saveComment(\'' + data[i].song_id + '\',\'' + data[i].title + '\',\'' + data[i].deity + '\')"></span></span>';
                        } else {
                            listHTML += '<span id="favourite"><span class="glyphicon glyphicon-star UnFavButton" href=# style="float:right;" onclick="return unfav(\'' + data[i].song_id + '\',\'' + data[i].title + '\',\'' + data[i].deity + '\')"></span></span>';
                        }
                        listHTML += '<div class="songdetail lyrics" style="padding-bottom:2rem;"><div id="firstlinelyrics">' + lyrics + '</div>'
                        if (meaning != "") {
                            listHTML += '<div style="padding:8px;margin-bottom:2rem"><div class="songdetail meaning">' + meaning + '</div></div>'
                        }
                        if (data[i].golden_voice != "" ) {
                            var audioWidth = Math.round($(window).width()*.90);
                            listHTML += '<div style="padding:8px;text-align: center;">'
                            listHTML += '<span class="songlabel" style="float:left;">Golden Voice <span class="glyphicon glyphicon-volume-up" style="color:#daa520;" ></span></span>';
                            listHTML += '<audio class="audioDetailPlayer" controls preload="auto" src="' + data[i].golden_voice + '" style="width:'+audioWidth+'px;max-width:500px;"></audio>';
                            listHTML += '</div>'
                        }
                        node1.html(listHTML);
                        listHTML = '';
                        listHTML += '<div style="padding:10px;"><table style="width:100%;line-height:3.8rem">'
                        if (data[i].deity != "")
                            listHTML += '<tr class="songdetailAlt"><td><span class="songlabel">Deity </span></td><td><span id="songdeity">' + data[i].deity + '</span></td></tr>'
                        if (data[i].language != "")
                            listHTML += '<tr class="songdetail"><td><span class="songlabel">Language </span></td><td>' + data[i].language + '</td></tr>'
                        if (data[i].beat != "")
                            listHTML += '<tr class="songdetailAlt"><td><span class="songlabel">Beat </span></td><td>' + data[i].beat + '</td></tr>'
                        if (data[i].raga != "")
                            listHTML += '<tr class="songdetail"><td><span class="songlabel">Raga </span></td><td>' + data[i].raga + '</td></tr>'
                        if (data[i].suggested_tempo != "")
                            listHTML += '<tr class="songdetailAlt"><td><span class="songlabel">Tempo </span></td><td>' + data[i].suggested_tempo + '</td></tr>'
                        if (data[i].complexity_level != "")
                            listHTML += '<tr class="songdetail"><td><span class="songlabel">Level </span></td><td>' + data[i].complexity_level + '</td></tr>'
                        if (data[i].gents_pitch != "")
                            listHTML += '<tr class="songdetailAlt"><td><span class="songlabel">Gents Pitch </span></td><td>' + data[i].gents_pitch + '</td></tr>'
                        if (data[i].ladies_pitch != "")
                            listHTML += '<tr class="songdetail"><td><span class="songlabel">Ladies Pitch </span></td><td>' + data[i].ladies_pitch + '</td></tr>'
                        listHTML += '</table></div>'

                        if (data[i].video_link.includes("youtube") && navigator.onLine) {
                            listHTML += '<div class="songdetail" id="youTubeVideo" > <span class="songlabel">Video: </span> <iframe id="player" src ="' + formatYouTubeLink(data[i].video_link) + '" ></iframe></div>'
                        }
                        else if (data[i].video_link != "") {
                            listHTML += '<div class="songdetail" id="youTubeVideo" > <span class="songlabel">Video: </span> <a href="' + data[i].video_link + '" >Link</a></div>'
                        }
                        listHTML += '</div>'
                        node2.html(listHTML);
                        setAudioControl(data[i].audio_link);
                        if (data[i].karaoke != "")
                            detailKarokeJson(data[i].karaoke);
                        var songglossary = data[i].songglossary;
                        TagforDetailsPage(songglossary);
                        break;
                    }
                }
            },
            error: function (data) { alert("testingfailed"); }
        });
    }

    function setAudioControl(musiclink) {
        if (musiclink.includes("soundcloud")) {
            LoadSound(musiclink);
            document.getElementById('audiotag').style.display = "none";
            document.getElementById('noaudio').style.display = "none";
            document.getElementById('nointernet').style.display = "none";
        }
        else if (isEmptyOrSpaces(musiclink)) {
            document.getElementById('audiotag').style.display = "none";
            document.getElementById('soundplayer').style.display = "none";
            document.getElementById('nointernet').style.display = "none";
            document.getElementById('noaudio').innerHTML = "No Audio available. If you have the Audio for this Bhajan, <a href='https://sairegion3.org/contact-us/'>Contact Us</a>";
            document.getElementById('noaudio').style.display = "";
        }
        else if (!musiclink.includes("soundcloud")&& navigator.onLine) {
            document.getElementById('audioPlayer').src = musiclink;
            document.getElementById('audioPlayer').type = "audio/mpeg";
            document.getElementById('audioPlayer').load();
            document.getElementById('soundplayer').style.display = "none";
            document.getElementById('noaudio').style.display = "none";
            document.getElementById('nointernet').style.display = "none";
        }
        else 
        {
            document.getElementById('soundplayer').style.display = "none";
            document.getElementById('noaudio').style.display = "none";
            document.getElementById('nointernet').style.display = "none";
        }
    }

    function LoadSound(url) {

        var SOUNDCLOUD_URL = url //'http://soundcloud.com/georgconrad/shostakovich2', 
        WIDGET_OPTIONS = '&color=3C9FCE&liking=false&height=50';

        jQuery
            .getJSON('http://soundcloud.com/oembed.json?url=' + SOUNDCLOUD_URL + WIDGET_OPTIONS)
            .done(function (data) {
                var widget;
                $("#soundplayer").html(data.html);
                widget = SC.Widget($("#soundplayer")); //find('iframe')[1]);
            })
            .fail(function () { $("#soundplayer").html('<div class="alert alert-warning" role="alert"> Unable to load <a href="'+url+'"> SoundCloud Audio</a></div>'); });
    };

    function lyricsformat(lyrics) {
        var formattedresult = lyrics.replace("\n", "</div>");
        formattedresult = formattedresult.replace(/(\r\n|\n|\r)/gm, "<br>");
        return formattedresult;
    }

    function isEmptyOrSpaces(str) {
        return str === null || str.match(/^ *$/) !== null;
    }

    function formatYouTubeLink(videolink) {
        videolink = videolink.replace("https://www.youtube.com/watch?v=", "http://www.youtube-nocookie.com/embed/");
        return videolink;
    }

    function detailKarokeJson(jsonP) {
        var json = JSON.parse(jsonP);
        var karokeHtml = '<div style="padding-left:10px;padding-right:10px;"><span class="songlabel">Karaoke Tracks for Practice</span>';
        karokeHtml += '<div>Source: <a href="' + json.source + '">Link</a></div></div>';
        karokeHtml += '<div style="padding:10px;"><div style="padding:10px;border: 1px solid darkgrey;">'
        karokeHtml += '<div class="alert alert-info">Reference Track</div>';
        karokeHtml += '<div><span>Scale: ' + json.reference.scale + '</span> <audio class="audioDetailPlayer" controls preload="auto" src="' + json.reference.url + '"></audio> </div>';
        karokeHtml += '</div></div>';
        karokeHtml += '<div style="padding:10px;"><div style="padding:10px;border: 1px solid darkgrey;">';
        karokeHtml += '<div class="alert alert-success">Gents Track</div>';
        json.gents.forEach(item => {
            karokeHtml += '<div><span>Scale: ' + item.scale + '</span> <audio class="audioDetailPlayer" controls preload="auto" src="' + item.url + '"></audio> </div>';
        });
        karokeHtml += '</div></div>';
        karokeHtml += '<div style="padding:10px;"><div style="padding:10px;border: 1px solid darkgrey;">';
        karokeHtml += '<div class="alert alert-warning">Ladies Track</div>';
        json.ladies.forEach(item => {
            karokeHtml += '<div><span>Scale: ' + item.scale + '</span> <audio class="audioDetailPlayer" controls preload="auto" src="' + item.url + '"></audio> </div>';
        });
        karokeHtml += '</div></div>';
        $('#karoke').html(karokeHtml);
    }

});