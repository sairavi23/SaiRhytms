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
            url: "json/all_devotional_song_glossary.json",
            success: function (newresult) {
                result = JSON.parse(newresult);
                console.log(result.length);
                if (term != "") {
                    result = result.filter(function (item) {
                        if (item.term.replace(/(\r\n|\n|\r)/gm, "").toLowerCase().includes(term)) {
                            return item;
                        }
                    });
                };

                console.log(result.length);

                result.sort(function (a, b) {
                    if (a.term < b.term)
                        return -1;
                    if (a.term > b.term)
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
                        container.prev().html('Loading bhajans');
                        }
                    },
                    callback: function(response, pagination) {
                        window.console && console.log(22, response, pagination);
                        var listHTML = '<br> <ul id="songlist" data-role="listview" class="list-group" style="padding-left:15px; padding-right:15px;">';
                        $.each(response, function (index, pageresult) {
                            var link = "tagsearch.html?term=" + pageresult.term;   
                            listHTML += '<li class="list-group-item">';
                            listHTML += '<div><a href=' + link + ' style="color:#0088cc" >'+ pageresult.term +'</a></div>';
                            listHTML += '<div>' + pageresult.description + '</div></li>';    
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


