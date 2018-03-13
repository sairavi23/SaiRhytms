$(function () {


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
        SaveRecentSearch(location.search, searchname, lyrics, deity);

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


});