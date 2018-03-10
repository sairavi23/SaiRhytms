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
    if (localStorage.getItem('Fav') != null) {
        var FavJson = JSON.parse(localStorage.getItem('Fav'));
        for (var i in FavJson) {
            if (FavJson[i].Id == id) {
                document.getElementById("comment").value = FavJson[i].Comment;
                document.getElementById("favourite").innerHTML = '<span class="btn btn-danger" id="alreadyfav">Remove from Favorites<span/>'
            }
        }
    }
    $("#comment").click(function () {
        document.getElementById("msg").className = "";
        document.getElementById("msg").innerHTML = "";
    });

    $("#post").click
        (function () {
            saveComment(id);
        });

    $("#makefav").click
        (function () {
            saveComment(id);
            location.reload();
        });

    $("#alreadyfav").click
        (function () {
            unfav(id);
            location.reload();
        });

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
            location.reload();
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
                        var meaning = data[i].meaning;
                        var listNode = $("#result");
                        var listHTML = '';
                        listHTML += '<div id=songdetail">'
                        listHTML += '<div id="songtitle" style="display: none;">' + data[i].title + '</div>'
                        listHTML += '<div class="songdetail lyrics"><div id="firstlinelyrics">' + lyrics + '</div>'
                        if (meaning != "") {
                            listHTML += '<div style="padding:8px;"><div class="songdetail meaning">' + meaning + '</div></div>'
                        }
                        listHTML += '<div class="songdetailAlt" style=padding-top:10px;> <span class="songlabel">Deity: </span><span id="songdeity">' + data[i].deity + '</span></div>'
                        listHTML += '<div class="songdetail"> <span class="songlabel">Language: </span>' + data[i].language + '</div>'
                        listHTML += '<div class="songdetailAlt"> <span class="songlabel">Beat: </span>' + data[i].beat + '</div>'
                        listHTML += '<div class="songdetail"> <span class="songlabel">Raga: </span>' + data[i].raga + '</div>'
                        listHTML += '<div class="songdetailAlt"> <span class="songlabel">Tempo: </span>' + data[i].suggested_tempo + '</div>'
                        listHTML += '<div class="songdetail"> <span class="songlabel">Level: </span>' + data[i].complexity_level + '</div>'
                        listHTML += '<div class="songdetailAlt"> <span class="songlabel">Gents Pitch: </span>' + data[i].gents_pitch + '</div>'
                        listHTML += '<div class="songdetail"> <span class="songlabel">Ladies Pitch: </span>' + data[i].ladies_pitch + '</div>'
                        if (data[i].video_link != "") {
                            listHTML += '<div class="songdetail"> <span class="songlabel">Video: </span> <a href="' + data[i].video_link + '" target="_blank">Link</a></div>'
                        }
                        listHTML += '</div>'
                        listNode.html(listHTML);
                        setAudioControl(data[i].audio_link);
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
        if (navigator.onLine) {
            if (musiclink.includes("soundcloud")) {
                //musiclink = musiclink.concat("?enablejsapi=1");
                LoadSound(musiclink);
                document.getElementById('audiotag').style.display = "none";
                document.getElementById('noaudio').style.display = "none";
                document.getElementById('nointernet').style.display = "none";
            }
            else if (musiclink == "") {
                document.getElementById('audiotag').style.display = "none";
                document.getElementById('soundplayer').style.display = "none";
                document.getElementById('nointernet').style.display = "none";
                document.getElementById('noaudio').innerHTML = "No Audio available. If you have the Audio for this Bhajan, <a href='https://sairegion3.org/contact-us/'>Contact Us</a>";
            }
            else if (!musiclink.includes("soundcloud")) {
                document.getElementById('audioPlayer').src = musiclink;
                document.getElementById('audioPlayer').type = "audio/mpeg";
                document.getElementById('audioPlayer').load();
                document.getElementById('soundplayer').style.display = "none";
                document.getElementById('noaudio').style.display = "none";
                document.getElementById('nointernet').style.display = "none";
            }

        }
        else if (!navigator.onLine) {
            document.getElementById('audiotag').style.display = "none";
            document.getElementById('soundplayer').style.display = "none";
            document.getElementById('noaudio').style.display = "none";
            document.getElementById('nointernet').innerHTML = "No Internet Connection. Unable to load Audio";
        }
    }

    function LoadSound(url) {

        var SOUNDCLOUD_URL = url //'http://soundcloud.com/georgconrad/shostakovich2', 
        // You can also specify widget options in your request
        WIDGET_OPTIONS = '&color=3C9FCE&liking=false&height=50';

        jQuery
            .getJSON('http://soundcloud.com/oembed.json?url=' + SOUNDCLOUD_URL + WIDGET_OPTIONS)
            .done(function (data) {
                var widget;
                // data.html will contain widget HTML that you can embed
                $("#soundplayer").html(data.html);

                // For the following code to work, you need to have Widget HTML5 API 
                // available by the time this code is invoked. The code to put API file
                // in your page is:
                //
                // Create API enabled reference to the widget (note that we are passing DOM object)
                widget = SC.Widget($("#soundplayer")); //find('iframe')[1]);
                // Interact with widget via API
            })
            .fail(function () { $("#soundplayer").html('<div class="alert alert-warning" role="alert"> Unable to load Audio </div>'); });

    };

    function lyricsformat(lyrics) {
        var formattedresult = lyrics.replace("\n", "</div>");
        formattedresult = formattedresult.replace(/(\r\n|\n|\r)/gm, "<br>");
        return formattedresult;
    }
});