$(document).ready(function() {
    // Obsługa kliknięcia w obrazek/wideo
    $('.img-wrapper').click(function(e) {
        e.stopPropagation();

        const $content = $(this).find('img, video');
        const isVideo = $content.is('video');

        if ($content.length > 0) {
            openOverlay($content, isVideo);
        }
    });

    // Zamknij nakładkę po kliknięciu X
    $('.overlay-close').click(function(e) {
        e.stopPropagation();
        closeOverlay();
    });

    // Zamknij nakładkę po kliknięciu w tło
    $('#overlayImage').click(function(e) {
        if (e.target === this) {
            closeOverlay();
        }
    });

    // Zamknij nakładkę klawiszem ESC
    $(document).keyup(function(e) {
        if (e.key === "Escape") {
            closeOverlay();
        }
    });

    function openOverlay($element, isVideo) {
        const $overlay = $('#overlay');
        const $overlayImage = $('#overlayImage');
        const $overlayVideo = $('#overlayVideo');

        // Ukryj wszystkie media w nakładce
        $overlayImage.removeClass('active').hide();
        $overlayVideo.removeClass('active').hide();

        if (isVideo) {
            // Dla video - skopiuj źródło i atrybuty
            const src = $element.attr('src');
            $overlayVideo.attr('src', src);
            $overlayVideo[0].currentTime = 0; // Zacznij od początku
            $overlayVideo.addClass('active').show();
        } else {
            // Dla obrazka - skopiuj src i alt
            const src = $element.attr('src');
            const alt = $element.attr('alt');
            $overlayImage.attr('src', src);
            $overlayImage.attr('alt', alt);
            $overlayImage.addClass('active').show();
        }

        $overlay.addClass('active');
        $('body').css('overflow', 'hidden'); // Zablokuj scroll
    }

    function closeOverlay() {
        const $overlay = $('#overlay');
        const $overlayVideo = $('#overlayVideo');

        $overlay.removeClass('active');
        $('body').css('overflow', ''); // Odblokuj scroll

        // Zatrzymaj video przy zamykaniu
        if ($overlayVideo.hasClass('active')) {
            $overlayVideo[0].pause();
            $overlayVideo[0].currentTime = 0;
        }

        // Ukryj media
        $('#overlayImage, #overlayVideo').removeClass('active');
    }
});