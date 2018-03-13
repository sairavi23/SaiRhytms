$(function () {
    $("#Search").css("color", "#0088cc");
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
        var lyrics = "";
        if (getQueryString("lyrics")) {
            lyrics = getQueryString("lyrics").split('+').join(' ');
        }
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
                    if (language != "other") {
                        result = result.filter(function (item) {
                            if (item.language.replace(/(\r\n|\n|\r)/gm, "").toLowerCase().includes(language)) {
                                return item;
                            }
                        });
                    }
                    else {
                        result = result.filter(function (item) {
                            var languageJson = item.language.replace(/(\r\n|\n|\r)/gm, "").toLowerCase();
                            if(languageJson.includes("english") == false
                                && languageJson.includes("hindi") == false
                                && languageJson.includes("tamil") == false  
                                && languageJson.includes("telugu") == false 
                                && languageJson.includes("spanish") == false)
                                {
                                    return item;
                                }
                        });
                    }
                }

                var length = result.length;

                if (lyrics == "") {
                    result.sort(function (a, b) {
                        if (a.title < b.title)
                            return -1;
                        if (a.title > b.title)
                            return 1;
                        return 0;
                    });
                }

                var container = $('.pagination-demo2');
                container.pagination({
                    dataSource: result,
                    totalNumber: 120,
                    pageSize: 20,
                    ajax: {
                        beforeSend: function () {
                            container.prev().html('Loading bhajans');
                        }
                    },
                    callback: function (response, pagination) {

                        var listHTML = '<br> <ul id="songlist" data-role="listview" class="list-group" style="padding-left:15px; padding-right:15px;">';
                        listHTML += '<span class="page-title">Search Results:</span>';
                        $.each(response, function (index, pageresult) {
                            var link = "details.html?id=" + pageresult.song_id;
                            var isFav = checkFavoriteExist(pageresult.song_id);
                            var isAudio;
                            if (pageresult.audio_link != "")
                                isAudio = 'Y';
                            else
                                isAudio = '';
                            var songname = lyricsformat(pageresult.lyrics, isAudio);
                            listHTML += '<li class="list-group-item" >';
                            if (isFav == "N") {
                                listHTML += '<span class="glyphicon glyphicon-star FavButton" href=# style="float:right;" onclick="return saveComment(\'' + pageresult.song_id + '\',\'' + pageresult.title + '\',\'' + pageresult.deity + '\')"></span>';
                            }
                            listHTML += '<div><a href=' + link + ' style="color:#0088cc" value=' + pageresult.song_id + '>' + songname + '</li>';
                        });
                        listHTML += '</ul>';
                        container.prev().html(listHTML);
                    }
                })

            },
            error: function (data) { alert("testingfailed"); }
        });
    }

    function lyricsformat(lyrics, isAudio) {
        if (isAudio != "")
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
    function RecentSearch() {

        var getQueryString = function (field, url) {
            var href = url ? url : window.location.href;
            var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
            var string = reg.exec(href);
            return string ? string[1] : null;
        };

        var lyrics = "";
        if (getQueryString("lyrics")) {
            lyrics = getQueryString("lyrics").split('+').join(' ');
        }
        var deity = getQueryString("deity");
        var complexity = getQueryString("complexity");
        var tempo = getQueryString("tempo");
        var raga = getQueryString("raga");
        var media = getQueryString("media");
        var beat = getQueryString("beat");
        var language = getQueryString("language");
        var searchname = GetNamefromQueryString(lyrics, deity, complexity, tempo, raga, media, beat, language);
        if (searchname != "") {
            SaveRecentSearch(location.search, searchname, lyrics, deity);
        }

    };


    function GetNamefromQueryString(lyrics, deity, complexity, tempo, raga, media, beat, language) {
        var formattedName = "";
        if (lyrics)
            formattedName = formattedName + "Lyrics: " + lyrics + " / ";
        if (deity)
            formattedName = formattedName + "Deity: " + deity + " / ";
        if (complexity)
            formattedName = formattedName + "Complexity: " + complexity + " / ";
        if (tempo)
            formattedName = formattedName + "Tempo: " + tempo + " / ";
        if (raga)
            formattedName = formattedName + "Raga: " + raga + " / ";
        if (media)
            formattedName = formattedName + "Media: " + media + " / ";
        if (beat)
            formattedName = formattedName + "Beat: " + beat + " / ";
        if (language)
            formattedName = formattedName + "Language: " + language + " / ";
        return formattedName;
    }


    function SaveRecentSearch(searchquery, formattedname, lyrics, deity) {

        var existingsearch = 0;
        var name = formattedname;
        var setId = 0;
        searchquery = "list.html" + searchquery;
        if (localStorage.getItem('RecentSearch') === null) {
            var recent = [{Id:1, Name: name, Link: searchquery, Lyrics: lyrics, Deity: deity, DateSearched: new Date }];
            localStorage.setItem('RecentSearch', JSON.stringify(recent));
        }
        else {
            var recentJson = JSON.parse(localStorage.getItem('RecentSearch'));
            for (var i in recentJson){
                if(setId < recentJson[i].Id)
                {
                    setId = recentJson[i].Id
                }
            }
            setId = setId + 1;
            for (var i in recentJson) {
                if (recentJson[i].Name == name) {
                    existingsearch = 1;
                    break;
                }
            }
            if (existingsearch != 1) {
                newrecent = {Id:setId, Name: name, Link: searchquery, Lyrics: lyrics, Deity: deity };
                recentJson.push(newrecent);
                localStorage.setItem('RecentSearch', JSON.stringify(recentJson))
            }
            for (var i in recentJson) {
                if (recentJson[i].Name == "") {
                    recentJson.splice(i, 1);
                    localStorage.setItem('RecentSearch', JSON.stringify(recentJson))
                }
            }
            if (recentJson.length > 5) {
                //recentJson = recentJson.sort(compare);
                recentJson.splice(0, 1);
                localStorage.setItem('RecentSearch', JSON.stringify(recentJson))
            }

        }
    }


    function removeRecentSearch(id) {
        if (localStorage.getItem('RecentSearch') != null) {
            var removeJson = JSON.parse(localStorage.getItem('RecentSearch'));
            var counter = -1;
            for (var i in removeJson) {
                counter = counter + 1;
                if (recentJson[i].Id == id) {
                    removeJson.splice(counter, 1);
                    localStorage.setItem('RecentSearch', JSON.stringify(recentJson))
                    break;
                }
            }
        }
    }


    function compare(a, b) {
        if (new Date(a.source) < new Date(b.source))
            return -1;
        if (new Date(a.source) > new Date(b.source))
            return 1;
        return 0;
    }

});


