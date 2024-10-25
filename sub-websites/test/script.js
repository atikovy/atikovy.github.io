
function checkCardWidth() {
    if ($('.cards').width() < 720) {
        $('.dynamic').css({
            flexDirection: 'column',
        });
    } else {
        $('.dynamic').css({
            flexDirection: 'row',
        });
    }
}

$(document).ready(function() {
    checkCardWidth();
    $(window).resize(checkCardWidth);
});