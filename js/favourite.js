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
        location.reload();
    }
}

$(function () {
    var getQueryString = function (field, url) {
        var href = url ? url : window.location.href;
        var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
        var string = reg.exec(href);
        return string ? string[1] : null;
    };
    var deity = getQueryString("deity");

    if (localStorage.getItem('Fav') != null) {
        var FavJson = JSON.parse(localStorage.getItem('Fav'));
        var listNode = $("#result");

        var listHTML = '<p style="padding-left:15px; padding-bottom:23px;font-style:italic"> click on the <span class="glyphicon glyphicon-star-empty" style="font-size: 20px; color:rgb(235,200,237)" > </span> to remove from Favorites </p>';
        listHTML += '<ul data-role="listview" class="list-group" style="padding-left:15px; padding-right:15px;">';
        for (var i in FavJson) {
            if (deity == "")
            {
                var link = "details.html?id=" + FavJson[i].Id;
                listHTML += '<li class="list-group-item">  <a href=' + link + ' style="color:#0088cc" value=' + FavJson[i].Id + '>' + FavJson[i].Label + '</a> <span onclick="unfav(' + FavJson[i].Id + ')" class="glyphicon glyphicon-star-empty" style="float:right; font-size: 20px; color:rgb(235,200,237)" > </span> </li>';
            }
            else if (deity!="" && FavJson[i].Deity.replace(/(\r\n|\n|\r)/gm, "").toLowerCase().includes(deity))
            {
                var link = "details.html?id=" + FavJson[i].Id;
                listHTML += '<li class="list-group-item">  <a href=' + link + ' style="color:#0088cc" value=' + FavJson[i].Id + '>' + FavJson[i].Label + '</a> <span onclick="unfav(' + FavJson[i].Id + ')" class="glyphicon glyphicon-star-empty" style="float:right; font-size: 20px; color:rgb(235,200,237)" > </span> </li>';
            }
        }
        listHTML += '</ul>';
        listNode.html(listHTML);
    }

    $('#deity').val(deity).attr("selected", "selected");

});