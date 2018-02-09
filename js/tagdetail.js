function TagforDetailsPage(tags) {
    var fuse, Obj, result, newresult, newobj, tosearch;
    var data = $.ajax({
        url: "json/all_devotional_song_glossary.json",
        success: function (newresult) {
            result = JSON.parse(newresult);

            result = result.filter(function (item) {
                if (tags.toLowerCase().indexOf(item.term.toLowerCase()) != -1) {
                    return item;
                }
            });
            var tagarray = tags.split(", ");
            var listHTML = '<div class="songdetail"> <span class="songlabel">Tags (Glossary): </span></div>';
            listHTML += '<ul id="songlist" data-role="listview" class="list-group" style="padding-left:15px; padding-right:15px;">';
            var tagarray = tags.split(", ");
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    tagarray.forEach(tag => {
                        if (result[i].term == tag) {
                            var link = "tagsearch.html?term=" + result[i].term;
                            listHTML += '<li class="list-group-item">';
                            listHTML += '<div><a href=' + link + ' style="color:#0088cc" >' + result[i].term + '</a></div>';
                            listHTML += '<div>' + result[i].description + '</div></li>';
                        }
                    });
                }
            }
            else {
                listHTML += '<li class="list-group-item">';
                listHTML += '<div> No tags available for this song </div></li>';
            }

            listHTML += '</ul>';
            $("#tagdetailhtml").html(listHTML);
        },
        error: function (data) { alert("testingfailed"); }
    });
}
