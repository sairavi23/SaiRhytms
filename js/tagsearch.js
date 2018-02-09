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
                console.log(result.length);
                if (term != "") {
                    result = result.filter(function (item) {
                        if (item.lyrics.replace(/(\r\n|\n|\r)/gm, "").toLowerCase().includes(term)) {
                            return item;
                        }
                    });
                };

                console.log(result.length);

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
                        container.prev().html('Loading data from flickr.com ...');
                        }
                    },
                    callback: function(response, pagination) {
                        window.console && console.log(22, response, pagination);
                        var listHTML = '<br> <ul id="songlist" data-role="listview" class="list-group" style="padding-left:15px; padding-right:15px;">';
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
                                listHTML += '<button class="btn btn-link FavButton" href=# style="float:right;padding-bottom:10px;" onclick="return saveComment(\'' + pageresult.song_id  +'\',\'' + pageresult.title + '\',\'' + pageresult.deity + '\')">Favorite +</button>';
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


