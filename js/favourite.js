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
        $(this).removeClass('glyphicon glyphicon-star');
        $(this).addClass('glyphicon glyphicon-star-empty');
        $("#FavLink").css("color", "darkgrey");

        $("#modalMessage").html('Favorite has been removed <span class="glyphicon glyphicon-ok-sign" style="color:red"/>');
            $('#favModal').modal('show');
            setTimeout(function () {
                $("#FavLink").css("color", "#234b8c");
                $('#favModal').modal('hide');
                var deity = $('#deity').val();
               loadFavorites (deity);
            }, 2000);
    }
}

$(function () {
    var getQueryString = function (field, url) {
        var href = url ? url : window.location.href;
        var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
        var string = reg.exec(href);
        return string ? string[1] : null;
    };
    var deity = ""; 
        if (getQueryString("deity")) {
            deity = getQueryString("deity").split('+').join(' ');
            $('#deity').val(deity).change();
        }
    loadFavorites (deity);
    $('#deity').val(deity).attr("selected", "selected");

});

function loadFavorites (deity)
    {
        if (localStorage.getItem('Fav') != null) {
            var FavJson = JSON.parse(localStorage.getItem('Fav'));
            var listNode = $("#result");
    
            var listHTML = '<p style="padding-left:15px; padding-bottom:23px;font-style:italic"> click on the <span class="glyphicon glyphicon-star" style="font-size:x-large; color:#234b8c;" > </span> to remove from Favorites </p>';
            listHTML += '<ul data-role="listview" class="list-group" style="padding-left:15px; padding-right:15px;">';
            for (var i in FavJson) {
                if (deity == "")
                {
                    var link = "details.html?id=" + FavJson[i].Id;
                    listHTML += '<li class="list-group-item"> <table width=100%><tr><td><a href=' + link + ' style="color:#0088cc" value=' + FavJson[i].Id + '>' + FavJson[i].Label + '</a></td><td style=padding-left:23px;><span onclick="unfav(' + FavJson[i].Id + ')" class="glyphicon glyphicon-star" style="float:right; font-size: x-large; color:#234b8c;" > </span> </td></tr></table>  </li>';
                }
                else if (deity!="" && FavJson[i].Deity.replace(/(\r\n|\n|\r)/gm, "").toLowerCase().includes(deity))
                {
                    var link = "details.html?id=" + FavJson[i].Id;
                    listHTML += '<li class="list-group-item"> <table width=100%><tr><td><a href=' + link + ' style="color:#0088cc" value=' + FavJson[i].Id + '>' + FavJson[i].Label + '</a></td><td style=padding-left:23px;><span onclick="unfav(' + FavJson[i].Id + ')" class="glyphicon glyphicon-star" style="float:right; font-size: x-large; color:#234b8c;" > </span> </td></tr></table>  </li>';
                }
            }
            listHTML += '</ul>';
            listNode.html(listHTML);
        }
    }