$(document).ready(function() {

    loadComments();

    $('#comment-form').submit(function() {
        //Get the data from the form
        var name = $('#name').val();
        var comment = $('#comment').val();
        var cur_time = getCurrentTime();

        dpd.social.post({
        userid: "c3d4cca3bd5f6b58",
        posttime: cur_time,
        comment: comment
        }, function(comment, error) {
        if (error) return showError(error);

        addComment(comment);
        $('#name').val('');
        $('#comment').val('');
        });

        return false;
    });

    function addComment(social) {
        $('<div class="comment">')
            .append('<div class="author">Posted by: ' + social.userid + '</div>')
            .append('<p>' + social.comment + '</p>')
            .append((social.pictures != undefined && social.pictures.length > 0) ? '<img src="'+social.pictures[0]+'" />' : '')
            .appendTo('#comments');
    }

    function loadComments() {
    dpd.social.get(function(socials, error) { //Use dpd.js to access the API
        $('#comments').empty(); //Empty the list
        socials.forEach(function(social) { //Loop through the result
            addComment(social); //Add it to the DOM.
        });
    });
    }

    function getCurrentTime() {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var month_str = (month < 10) ? "0" + month : month;
        var dat = date.getDate();
        var dat_str = (dat < 10) ? "0" + dat : dat;
        var hour = date.getHours();
        var hour_str = (hour < 10) ? "0" + hour : hour;
        var min = date.getMinutes();
        var min_str = (min < 10) ? "0" + min : min;
        var sec = date.getSeconds();
        var sec_str = (sec < 10) ? "0" + sec : sec;
        return "" + year + month_str + dat_str + hour_str + min_str + sec_str;
    }

    function showError(error) {
        var message = "An error occurred";
        if (error.message) {
                message = error.message;
        } else if (error.errors) {
                var errors = error.errors;
                message = "";
                Object.keys(errors).forEach(function(k) {
                        message += k + ": " + errors[k] + "\n";
                });
        }

        alert(message);
    }


});