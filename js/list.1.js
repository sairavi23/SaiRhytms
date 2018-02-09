$(function () {

    function pagenext(page) {
        var currenturl = window.location.href;
        var lastequal = currenturl.lastIndexOf("page=");
        var newpage = parseInt(page) + 1;
        var res = currenturl.substring(0, lastequal + 5) + newpage;
        return res;
    };

    function loadSaibhajan() {
        var getQueryString = function (field, url) {
            var href = url ? url : window.location.href;
            var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
            var string = reg.exec(href);
            return string ? string[1] : null;
        };
        var lyrics = getQueryString("lyrics").split('+').join(' ');
        var deity = getQueryString("deity");
        var complexity = getQueryString("complexity");
        var tempo = getQueryString("tempo");
        var raga = getQueryString("raga");
        var media = getQueryString("media");
        var beat = getQueryString("beat");
        var language = getQueryString("language");
        var page = getQueryString("page");
        var aud = "";

        var pagenexturl = pagenext(page)

        var fuse, Obj, result, newresult, newobj, tosearch;
        var data = $.ajax({
            url: "json/bhajan.json",
            success: function (newresult) {
                Obj = JSON.parse(newresult);

                var options = {
                    keys: ['title']
                }
                if (lyrics != "") {
                    fuse = new Fuse(Obj, options);
                    result = fuse.search(lyrics);
                    console.log(result);
                }
                else {
                    result = Obj;
                }

                if (deity != "") {
                    result = result.filter(function (item) {
                        if (item.deity.replace(/(\r\n|\n|\r)/gm, "").toLowerCase().includes(deity)) {
                            return item;
                        }
                    });
                };

                if (complexity != "") {
                    result = result.filter(function (item) {
                        if (item.complexity_level.replace(/(\r\n|\n|\r)/gm, "").toLowerCase().includes(complexity)) {
                            return item;
                        }
                    });
                };

                if (tempo != "") {
                    result = result.filter(function (item) {
                        if (item.suggested_tempo.replace(/(\r\n|\n|\r)/gm, "").toLowerCase().includes(tempo)) {
                            return item;
                        }
                    });
                };

                if (raga != "") {
                    result = result.filter(function (item) {
                        if (item.raga.replace(/(\r\n|\n|\r)/gm, "").toLowerCase().includes(raga)) {
                            return item;
                        }
                    });
                };

                if (media == "y") {
                    result = result.filter(function (item) {
                        if (item.audio_link != "") {
                            return item;
                        }
                    });
                }
                else if (media == "n") {
                    result = result.filter(function (item) {
                        if (item.audio_link == "") {
                            return item;
                        }
                    });
                };

                if (beat != "") {
                    result = result.filter(function (item) {
                        if (item.beat.replace(/(\r\n|\n|\r)/gm, "").toLowerCase().includes(beat)) {
                            return item;
                        }
                    });
                };

                if (language != "") {
                    result = result.filter(function (item) {
                        if (item.language.replace(/(\r\n|\n|\r)/gm, "").toLowerCase().includes(language)) {
                            return item;
                        }
                    });
                };

                var length = result.length;

                if (lyrics == "") {
                    result.sort(function (a, b) {
                        if (a.label < b.label)
                            return -1;
                        if (a.label > b.label)
                            return 1;
                        return 0;
                    });
                }

                pagemin = ((page - 1) * 10) + 1;
                pagemax = (page * 10);
                var shownext = 1;
                if (pagemax > length) {
                    pagemax = length;
                    shownext = 0;
                }
                var pageresult = [];
                for (var i = 0; i < result.length; i++) {
                    if (i >= pagemin - 1 && i <= pagemax) {
                        pageresult.push(result[i]);
                    }
                }

                var listNode = $("#result");
                var listHTML = '<br> <ul id="songlist" data-role="listview" class="list-group" style="padding-left:15px; padding-right:15px;">';
                listHTML += '<span class="page-title">Search Results:</span>';
                if (shownext == 1) {
                    listHTML += '<a id ="pagenext" class="glyphicon glyphicon-circle-arrow-right" style="font:black; color:#234b8c; font-size:23px; float:right ;padding-right: 20px;" href="' + pagenexturl + '"/>';
                }
                listHTML += '<a class="glyphicon glyphicon-circle-arrow-left" style="font:black; color:#234b8c; font-size:23px; float:right ;padding-right: 20px;" onClick="history.go(-1);return true;"/>';
                listHTML += '<p style="padding-left:15px; padding-bottom:10px;font-style:italic">showing songs ' + pagemin + ' to ' + pagemax + ' out of ' + length + '</p>';
                for (var i in pageresult) {
                    var link = "details.html?id=" + pageresult[i].song_id;
                    var isFav = checkFavoriteExist(pageresult[i].song_id);
                    var isAudio ;
                    if (pageresult[i].audio_link!="")
                        isAudio = 'Y';
                    else
                        isAudio = '';
                    var songname = lyricsformat(pageresult[i].lyrics,isAudio);    
                    listHTML += '<li class="list-group-item" >';
                    if (isFav == "N")
                    {
                        listHTML += '<button class="btn btn-link FavButton" href=# style="float:right;padding-bottom:10px;" onclick="return saveComment(\'' + pageresult[i].song_id  +'\',\'' + pageresult[i].title + '\',\'' + pageresult[i].deity + '\')">Favorite +</button>';
                    }
                    listHTML += '<div><a href=' + link + ' style="color:#0088cc" value=' + pageresult[i].song_id + '>' + songname  +'</li>';    
                }
                if (shownext == 1) {
                    listHTML += '<a id ="pagenext" class="glyphicon glyphicon-circle-arrow-right" style="font:black; color:#234b8c; font-size:23px; float:right ;padding-right: 20px;padding-top:10px;" href="' + pagenexturl + '"/>';
                }
                listHTML += '<a class="glyphicon glyphicon-circle-arrow-left" style="font:black; color:#234b8c; font-size:23px; float:right ;padding-right: 20px; padding-top:10px;" onClick="history.go(-1);return true;"/>';
                listHTML += '</ul>';
                listNode.html(listHTML);


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
    RecentSearch();

    // Recent Search Save Result
    function RecentSearch () {
        
        var getQueryString = function (field, url) {
            var href = url ? url : window.location.href;
            var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
            var string = reg.exec(href);
            return string ? string[1] : null;
        };
    
        var lyrics = getQueryString("lyrics").split('+').join(' ');
        var deity = getQueryString("deity");
        var complexity = getQueryString("complexity");
        var tempo = getQueryString("tempo");
        var raga = getQueryString("raga");
        var media = getQueryString("media");
        var beat = getQueryString("beat");
        var language = getQueryString("language");
        var searchname = GetNamefromQueryString(lyrics, deity, complexity, tempo, raga, media, beat,language);
        if (searchname != "")
        {
            SaveRecentSearch(location.search, searchname, lyrics, deity);
        }
        
    };


        function GetNamefromQueryString(lyrics, deity, complexity, tempo, raga, media, beat,language) {
            var formattedName = "";
            if (lyrics) 
                formattedName = formattedName + "Lyrics: " + lyrics +" / ";
            if (deity)
                formattedName = formattedName + "Deity: " + deity +" / ";
            if (complexity)
                formattedName = formattedName + "Complexity: " + complexity +" / ";
            if (tempo) 
                formattedName = formattedName + "Tempo: " + tempo +" / ";
            if (raga)
                formattedName = formattedName + "Raga: " + raga +" / ";
            if (media)
                formattedName = formattedName + "Media: " + media +" / ";
            if (beat)
                formattedName = formattedName + "Beat: " + beat +" / ";
            if (language)
                formattedName = formattedName + "Language: " + language +" / ";
            return formattedName;
        }


        function SaveRecentSearch(searchquery , formattedname, lyrics, deity) {

            var existingsearch = 0;
            var name = formattedname;
            searchquery = "list.html" + searchquery ;
            if (localStorage.getItem('RecentSearch') === null) {
                var recent = [{ Name:name, Link: searchquery, Lyrics:lyrics, Deity: deity, DateSearched: new Date }];
                localStorage.setItem('RecentSearch', JSON.stringify(recent));
            }
            else {
                var recentJson = JSON.parse(localStorage.getItem('RecentSearch'));
                for (var i in recentJson)
                {
                    if(recentJson[i].Name == name)
                    {
                        existingsearch = 1;
                        break;
                    }
                }
                if (existingsearch != 1)
                {
                    newrecent = { Name:name, Link: searchquery, Lyrics:lyrics, Deity: deity };
                    recentJson.push(newrecent);
                    localStorage.setItem('RecentSearch', JSON.stringify(recentJson))
                }
                for (var i in recentJson)
                {
                    if(recentJson[i].Name == "")
                    {
                        recentJson.splice(i, 1);
                        localStorage.setItem('RecentSearch', JSON.stringify(recentJson))
                    }
                }
                if (recentJson.length > 5 )
                {
                    //recentJson = recentJson.sort(compare);
                    recentJson.splice(0, 1);
                    localStorage.setItem('RecentSearch', JSON.stringify(recentJson))
                }

            }
        }

        function compare(a,b) {
            if (new Date(a.source) < new Date(b.source))
              return -1;
            if (new Date(a.source) > new Date(b.source))
              return 1;
            return 0;
         }

});


