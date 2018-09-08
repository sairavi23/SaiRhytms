
    $(function () {
        $(document).on('click', '.FavButton', function (e) {
            //$(this).html('Added to Favorites');
            $(this).css('background','white');
            $(this).css('border','white');
            $(this).removeClass('glyphicon glyphicon-star-empty');
            $(this).addClass('glyphicon glyphicon-star');
            $(this).removeClass('FavButton');
            $(this).addClass('UnFavButton');
            //$(this).prop("disabled", true);
            var onclickEvent =  $(this).attr("onclick");
            onclickEvent = onclickEvent.replace("saveComment","unfav");
            $(this).attr("onclick",onclickEvent);
            $("#FavLink").css("color", "darkgreen");
            $("#modalMessage").html('Favorite has been added <span class="glyphicon glyphicon-ok-sign" style="color:green"/>');
            $('#favModal').modal('show');
            setTimeout(function () {
                $("#FavLink").css("color", "#234b8c");
                $('#favModal').modal('hide');
            }, 3000);
        });

         $(document).on('click', '.UnFavButton', function () {
            //$(this).html('Removed from Favorites');
            $(this).css('background','white');
            $(this).css('border','white');
            $(this).removeClass('glyphicon glyphicon-star');
            $(this).addClass('glyphicon glyphicon-star-empty');
            $(this).removeClass('UnFavButton');
            $(this).addClass('FavButton');
            var onclickEvent =  $(this).attr("onclick");
            onclickEvent = onclickEvent.replace("unfav","saveComment");
            $("#FavLink").css("color", "darkgrey");
            $("#modalMessage").html('Favorite has been removed <span class="glyphicon glyphicon-ok-sign" style="color:red"/>');
            $('#favModal').modal('show');
            setTimeout(function () {
                $("#FavLink").css("color", "#234b8c");
                $('#favModal').modal('hide');
            }, 3000);
        });
    });

    function saveComment(id, title, deity) {
        var songComment = "";
        if(document.getElementById("comment")){
            songComment = document.getElementById("comment").value ;
        }

        if (localStorage.getItem('Fav') === null) {
            var favi = [{ Id: id, Label: title, Deity: deity, Comment: songComment }];
            localStorage.setItem('Fav', JSON.stringify(favi));
        }
        else {
            var newBhajan = 0;
            var FavJson = JSON.parse(localStorage.getItem('Fav'));

            for (var i in FavJson) {
                if (FavJson[i].Id == id) {
                    newBhajan = 1
                }
            }
            if (newBhajan != 1) {
                newBhajanData = { Id: id, Label: title, Deity: deity, Comment: songComment }
                FavJson.push(newBhajanData);
                localStorage.setItem('Fav', JSON.stringify(FavJson));
            }
        }
    }

    function unfav(id,title,deity) {
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
        }
        if(document.getElementById("comment")){
            document.getElementById("comment").value = "";
        }
    }

    