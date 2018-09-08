$(function () {
    $("#Search").css("color", "#0088cc");

    loadSaiBhajanOnPageLoad();
    RecentSearchOnPageLoad();

    $("#search").click(function () {
        $('#filtertable').hide();
        $('#filter').html("Filter +");
        loadSaiBhajanOnClick();
        RecentSearchOnClick();
        $("#recentsearchhtml").load("_recentsearch.html");
    });

    function loadSaiBhajanOnPageLoad() {
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
        var deity = "";
        if (getQueryString("deity")) {
            deity = getQueryString("deity").split('+').join(' ');
            $('#deity').val(deity).change();
        }
        var complexity = getQueryString("complexity");
        var tempo = getQueryString("tempo");
        var raga = getQueryString("raga");
        var media = getQueryString("media");
        var beat = getQueryString("beat");
        var language = getQueryString("language");
        var page = getQueryString("page");
        var aud = "";
        loadSaibhajanList(lyrics, deity, complexity, tempo, raga, media, beat, language)
    }
    function loadSaiBhajanOnClick() {

        var lyrics = "";
        if ($("#lyrics")) {
            lyrics = $("#lyrics").val().split('+').join(' ');
        }
        var deity = "";
        if ($("#deity")) {
            deity = $("#deity").val().split('+').join(' ');
        }
        var complexity = $("#complexity").val();
        var tempo = $("#tempo").val();
        var raga = $("#raga").val();
        var media = $("#media").val();
        var beat = $("#beat").val();
        var language = $("#language").val();
        var aud = "";
        loadSaibhajanList(lyrics, deity, complexity, tempo, raga, media, beat, language);
        if (deity || tempo || complexity || raga || media || beat || language) {
            $('#filter').css("background-color", "#cc8b00");
            $('#filter').css("border-color", "#cc8b00");
            $('#filter').css("color", "white");
        }
        else {
            $('#filter').css("background-color", "white");
            $('#filter').css("border-color", "darkgrey");
            $('#filter').css("color", "#242121");
        }
    }


    function loadSaibhajanList(lyrics, deity, complexity, tempo, raga, media, beat, language) {

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
                            if (languageJson.includes("english") == false
                                && languageJson.includes("hindi") == false
                                && languageJson.includes("tamil") == false
                                && languageJson.includes("telugu") == false
                                && languageJson.includes("spanish") == false) {
                                return item;
                            }
                        });
                    }
                }

                result = result.filter(function (item) {
                    if (item.song_id != "") {
                        return item;
                    }
                });

                var length = result.length;

                if (length > 0) {
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
                        pageSize: 10,
                        ajax: {
                            beforeSend: function () {
                                container.prev().html('Loading Devotional Songs');
                            }
                        },
                        callback: function (response, pagination) {
                            var listHTML = '<br> <ul id="songlist" data-role="listview" class="list-group" style="padding-left:15px; padding-right:15px;">';
                            //listHTML += '<span class="page-title">Search Results:</span>';
                            var audioWidth = Math.round($(window).width() * .80);
                            $.each(response, function (index, pageresult) {
                                var link = "details.html?id=" + pageresult.song_id;
                                var isFav = checkFavoriteExist(pageresult.song_id);
                                var songname = lyricsformat(pageresult.lyrics);
                                listHTML += '<li class="list-group-item" >';
                                if (isFav == "N") {
                                    listHTML += '<span class="glyphicon glyphicon-star-empty FavButton" href=# style="float:right;"  onclick="return saveComment(\'' + pageresult.song_id + '\',\'' + pageresult.title + '\',\'' + pageresult.deity + '\')"></span>';
                                } else {
                                    listHTML += '<span class="glyphicon glyphicon-star UnFavButton" href=# style="float:right;" onclick="return unfav(\'' + pageresult.song_id + '\',\'' + pageresult.title + '\',\'' + pageresult.deity + '\')"></span>';
                                }
                                listHTML += '<div><a href=' + link + ' style="color:#0088cc;font-weight:bold;" value=' + pageresult.song_id + '>' + songname;
                                var isAudio;
                                if (pageresult.audio_link != "" && !pageresult.audio_link.includes("soundcloud")) {
                                    listHTML += '<div><audio controls preload="auto" src=' + pageresult.audio_link + ' type="audio/mpeg" class="audioListPlayer" style="width:' + audioWidth + 'px;max-width:500px;" ></audio></div>'
                                }
                                listHTML += '</li>'
                            });
                            listHTML += '</ul>';
                            container.prev().html(listHTML);
                        }
                    })
                }
                else {
                    $('.data-container').html('<br/><div style="color:#0088cc;font-weight:bold;padding-left:15px;"> No matching songs found</div>');
                    $('.pagination-demo2').html('');
                }
            },
            error: function (data) { alert("testingfailed"); }
        });
    }

    function lyricsformat(lyrics) {
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

    // Recent Search Save Result
    function RecentSearchOnPageLoad() {

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

    function RecentSearchOnClick() {

        var lyrics = "";
        if ($("#lyrics")) {
            lyrics = $("#lyrics").val().split('+').join(' ');
        }
        var deity = "";
        if ($("#deity")) {
            deity = $("#deity").val().split('+').join(' ');
        }
        var complexity = $("#complexity").val();
        var tempo = $("#tempo").val();
        var raga = $("#raga").val();
        var media = $("#media").val();
        var beat = $("#beat").val();
        var language = $("#language").val();
        var link = 'lyrics='+lyrics+'&deity='+deity+'&complexity='+complexity+'&tempo='+tempo+'&raga='+raga+'&media='+media+'&beat='+beat+'&language='+language+'&page=1';
        var searchname = GetNamefromQueryString(lyrics, deity, complexity, tempo, raga, media, beat, language);
        if (searchname != "") {
            SaveRecentSearch(link, searchname, lyrics, deity);
        }
        mostRecentSearch("list.html?"+link);
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
        searchquery = "list.html?" + searchquery;
        if (localStorage.getItem('RecentSearch') === null) {
            var recent = [{ Id: 1, Name: name, Link: searchquery, Lyrics: lyrics, Deity: deity, DateSearched: new Date }];
            localStorage.setItem('RecentSearch', JSON.stringify(recent));
        }
        else {
            var recentJson = JSON.parse(localStorage.getItem('RecentSearch'));
            for (var i in recentJson) {
                if (setId < recentJson[i].Id) {
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
                newrecent = { Id: setId, Name: name, Link: searchquery, Lyrics: lyrics, Deity: deity };
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

   function mostRecentSearch(link)
   {
    //var recent = [{ Id: 1, Link: link }];
    //localStorage.setItem('MostRecentSearch', JSON.stringify(recent));
    history.pushState({id: 'id'}, '', link);
   }

});


