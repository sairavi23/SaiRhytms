$(function () {

    function loadSaibhajan() {
        var getQueryString = function (field, url) {
            var href = url ? url : window.location.href;
            var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
            var string = reg.exec(href);
            return string ? string[1] : null;
        };
        var term = getQueryString("term");
        $('#glossaryterm').val(term);
        var fuse, Obj, result, newresult, newobj, tosearch;
        var data = $.ajax({
            url: "json/bhajan.json",
            success: function (newresult) {
                result = JSON.parse(newresult);
                if (term != "") {
                    var searchtag = term.toLowerCase();
                    result = result.filter(function (item) {
                        if (item.lyrics.replace(/(\r\n|\n|\r)/gm, "").toLowerCase().includes(searchtag)) {
                            return item;
                        }
                    });
                };

                result = result.filter(function (item) {
                    if (item.song_id !="") {
                        return item;
                    }
                });

                result.sort(function (a, b) {
                    if (a.label < b.label)
                        return -1;
                    if (a.label > b.label)
                        return 1;
                    return 0;
                });

                var container = $('.pagination-demo2');
                    container.pagination({
                    dataSource: result,
                    totalNumber: 120,
                    pageSize: 10,
                    ajax: {
                        beforeSend: function() {
                        container.prev().html('Loading Devotional Songs');
                        }
                    },
                    callback: function(response, pagination) {
                        
                        var listHTML = '<ul id="songlist" data-role="listview" class="list-group" style="padding-left:15px; padding-right:15px;">';
                        var audioWidth = Math.round($(window).width()*.80);
                        $.each(response, function (index, pageresult) {
                            var link = "details.html?id=" + pageresult.song_id;
                            var isFav = checkFavoriteExist(pageresult.song_id);
                            var songname = lyricsformat(pageresult.lyrics);    
                            listHTML += '<li class="list-group-item" >';
                            if (isFav == "N") {
                                listHTML += '<span class="glyphicon glyphicon-star-empty FavButton" href=# style="float:right;" onclick="return saveComment(\'' + pageresult.song_id + '\',\'' + pageresult.title + '\',\'' + pageresult.deity + '\')"></span>';
                            } else {
                                listHTML += '<span class="glyphicon glyphicon-star UnFavButton" href=# style="float:right;" onclick="return unfav(\'' + pageresult.song_id + '\',\'' + pageresult.title + '\',\'' + pageresult.deity + '\')"></span>';
                            }
                            listHTML += '<div><a href=' + link + ' style="color:#0088cc;font-weight:bold;" value=' + pageresult.song_id + '>' + songname;
                            var isAudio;
                            if (pageresult.audio_link != "" && !pageresult.audio_link.includes("soundcloud")) {
                                listHTML += '<div><audio controls preload="auto" src=' + pageresult.audio_link + ' type="audio/mpeg" class="audioListPlayer" style="width:'+audioWidth+'px;max-width:500px;" ></audio></div>'
                            }
                            listHTML +='</li>'
                        });
                        listHTML += '</ul>';
                        container.prev().html(listHTML);
                    }
                    })
            },
            error: function (data) { alert("testingfailed"); }
        });

        var gdata = $.ajax({
            url: "json/all_devotional_song_glossary.json",
            success: function (newresult) {
                result = JSON.parse(newresult);
                if (term != "") {
                    var searchtag = term.toLowerCase();
                    result = result.filter(function (item) {
                        if (item.term.replace(/(\r\n|\n|\r)/gm, "").toLowerCase()==(searchtag)) {
                            return item;
                        }
                    });
                };
                result.sort(function (a, b) {
                    if (a.term < b.term)
                        return -1;
                    if (a.term > b.term)
                        return 1;
                    return 0;
                });

                var tagHTML = '<br> <ul id="taglist" data-role="listview" class="list-group" style="padding-left:15px; padding-right:15px;">';
                for (var i in result)
                {
                    var link = "tagsearch.html?term=" + result[i].term;   
                    tagHTML += '<li class="list-group-item">';
                    tagHTML += '<div><a href=' + link + ' style="color:#0088cc" >'+ result[i].term +'</a></div>';
                    tagHTML += '<div>' + decodeHtml(result[i].description) + '</div></li>';  
                }
                tagHTML += '</ul>';
                $(".tag-container").html(tagHTML);                
            },
            error: function (data) { alert("testingfailed"); }
        });
    }


    function lyricsformat (lyrics)
      {
        var formattedresult = lyrics.replace("\n", "</a></div>");
        formattedresult = formattedresult.replace(/(\r\n|\n|\r)/gm, "<br>");
        return formattedresult; 
      }

      function checkFavoriteExist(id) {
        var checkExist = "N";  
        if (localStorage.getItem('Fav') === null) {
            checkExist = "N";  
        }
        else {
            var FavJson = JSON.parse(localStorage.getItem('Fav'));

            for (var i in FavJson) {
                if (FavJson[i].Id == id) {
                    checkExist = "Y"; 
                    break;  
                }
            }
        }
        return checkExist;
    }  
    
    function decodeHtml(html) {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    loadSaibhajan();
   

});


