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
                result.sort(function (a, b) {
                    if (a.label < b.label)
                        return -1;
                    if (a.label > b.label)
                        return 1;
                    return 0;
                });

                var container = $('#pagination-demo2');
                    container.pagination({
                    dataSource: result,
                    totalNumber: 120,
                    pageSize: 20,
                    ajax: {
                        beforeSend: function() {
                        container.prev().html('Loading Sai Bhajan ...');
                        }
                    },
                    callback: function(response, pagination) {
                        
                        var listHTML = '<ul id="songlist" data-role="listview" class="list-group" style="padding-left:15px; padding-right:15px;">';
                        $.each(response, function (index, pageresult) {
                            var link = "details.html?id=" + pageresult.song_id;
                            var isFav = checkFavoriteExist(pageresult.song_id);
                            var isAudio ;
                            if (pageresult.audio_link!="")
                                isAudio = 'Y';
                            else
                                isAudio = '';
                            var songname = lyricsformat(pageresult.lyrics,isAudio);    
                            listHTML += '<li class="list-group-item" >';
                            if (isFav == "N")
                            {
                                listHTML += '<span class="glyphicon glyphicon-star FavButton" href=# style="float:right;" onclick="return saveComment(\'' + pageresult.song_id  +'\',\'' + pageresult.title + '\',\'' + pageresult.deity + '\')"></span>';
                            }
                            listHTML += '<div><a href=' + link + ' style="color:#0088cc" value=' + pageresult.song_id + '>' + songname  +'</li>';    
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
                    tagHTML += '<div>' + result[i].description + '</div></li>';  
                }
                tagHTML += '</ul>';
                $(".tag-container").html(tagHTML);                
            },
            error: function (data) { alert("testingfailed"); }
        });
    }


    function lyricsformat (lyrics,isAudio)
      {
        if (isAudio!="")
                        isAudio = '<span class="glyphicon glyphicon-play-circle" />';
                    else
                        isAudio = '';

        var formattedresult = lyrics.replace("\n", isAudio + "</a></div>");
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
    
    loadSaibhajan();
   

});


