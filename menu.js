
var whiteMid = "#FFFFFF";
var darkGrey = '#181818'

$(document).ready(function() {

    $('.menu .button').on('click', function(e) {
        $('.menu .button').removeClass('active');
        $(this).addClass('active');
    });
});
