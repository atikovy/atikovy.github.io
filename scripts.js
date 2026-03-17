$(document).ready(function() {
    // console.log("Skrypt działa!");

    // Zablokuj normalne scrollowanie
    $('body').css({
        'overflow': 'hidden',
        'height': '100vh'
    });

    const $slidingHeaders = $('.sliding-headers-container');
    const $headers = $slidingHeaders.find('h2');
    const $textBoxes = $('.p-slider .text-box');
    const $pSlider = $('.p-slider');
    const $boxes = $('.box-slider .box');
    const $navbar = $('.navbar'); // Selektor dla navbar

    const headerHeight = 40; // 2.5rem = 40px
    const gap = 16; // 1rem gap
    const textBoxWidth = 288; // 20rem = 320px
    const boxHeight = 320; // 20rem = 320px (wysokość boxa)
    const boxGap = 32; // 2rem gap między boxami

    let currentIndex = 0;
    const maxIndex = 2; // 0, 1, 2 (3 pozycje)
    let isScrolling = false;
    let scrollTimeout;
    let navbarTimeout; // Timeout dla navbar

    // Inicjalizacja navbar - ukryty na starcie
    // $navbar.css({
    //     'opacity': '0',
    //     'transition': 'opacity 1s ease, height 1s ease',
    //     'pointer-events': 'none'
    // });

    // Funkcja pokazująca navbar po 3 sekundach
    function showNavbarWithDelay() {
        // Wyczyść poprzedni timeout jeśli istnieje
        if (navbarTimeout) {
            clearTimeout(navbarTimeout);
        }

        navbarTimeout = setTimeout(function() {
            $navbar.css({
                'opacity': '1',
                'height': '16rem',
                'pointer-events': 'auto'
            });
            // console.log("Navbar pokazany!");
        }, 5000); // 3 sekundy opóźnienia
    }

    // Funkcja ukrywająca navbar
    function hideNavbar() {
        if (navbarTimeout) {
            clearTimeout(navbarTimeout);
            navbarTimeout = null;
        }
        $navbar.css({
            'opacity': '0',
            'height': '0',
            'pointer-events': 'none'
        });
    }

    // Funkcja aktualizująca pozycję i opacity boxów
    function updateBoxes(index) {
        // Przesunięcie pionowe boxów
        const newTranslateY = -(index * (boxHeight + boxGap));
        $boxes.css('transform', `translateY(${newTranslateY}px)`);

        // Aktualizacja opacity boxów
        $boxes.each(function(i) {
            if (i === index) {
                // Aktualny box - pełna widoczność
                $(this).css({
                    'opacity': '1',
                    'transition': 'transform 1s 0.1s cubic-bezier(0.5, 0, 0, 1), opacity 1s 0.5s cubic-bezier(0.5, 0, 0, 1)',
                });
            } else {
                // Pozostałe boxy - niewidoczne
                $(this).css({
                    'opacity': '0',
                    'transition': 'transform 1s 0s cubic-bezier(0.5, 0, 0, 1), opacity 0.5s 0s cubic-bezier(0.5, 0, 0, 1)'
                });
            }
        });
    }

    // Funkcja aktualizująca pozycję i opacity text-boxów
    function updateTextBoxes(index) {
        // Przesunięcie poziome text-boxów
        const newTranslateX = -(index * textBoxWidth);
        $textBoxes.css('transform', `translateX(${newTranslateX}px)`);

        // Aktualizacja opacity text-boxów
        $textBoxes.each(function(i) {
            if (i === index) {
                // Aktualny text-box - pełna widoczność
                $(this).css({
                    'opacity': '1',
                    'transition': 'transform 1s 0.1s cubic-bezier(0.5, 0, 0, 1), opacity 1s 0.5s cubic-bezier(0.5, 0, 0, 1)',
                });
            } else {
                // Pozostałe text-boxy - niewidoczne
                $(this).css({
                    'opacity': '0',
                    'transition': 'transform 1s 0s cubic-bezier(0.5, 0, 0, 1), opacity 0.5s 0s cubic-bezier(0.5, 0, 0, 1)'
                });
            }
        });
    }

    // Funkcja aktualizująca pozycję headerów
    function updateHeaders(index) {
        const newTranslateY = -(index * (headerHeight + gap));
        $headers.css('transform', `translateY(${newTranslateY}px)`);
    }

    // Funkcja aktualizująca wszystko
    function updatePosition(index) {
        updateHeaders(index);
        updateTextBoxes(index);
        updateBoxes(index);
        updateActiveDot(index);

        // Sprawdź czy to ostatni slajd (thinker)
        if (index === maxIndex) {
            // Jesteśmy na ostatnim slajdzie - pokaż navbar z opóźnieniem
            showNavbarWithDelay();
        } else {
            // Nie jesteśmy na ostatnim slajdzie - ukryj navbar
            hideNavbar();
        }
    }

    // Obsługa kliknięcia na kropki
    $('.scroll-dot').on('click', function() {
        const index = $(this).index();
        currentIndex = index;
        updatePosition(index);
    });

    // Obsługa scrollowania na całym oknie
    $(window).on('wheel', function(e) {
        e.preventDefault();

        if (isScrolling) return;

        const delta = e.originalEvent.deltaY;

        if (delta > 0 && currentIndex < maxIndex) {
            // Scroll w dół
            currentIndex++;
            isScrolling = true;
            updatePosition(currentIndex);
        } else if (delta < 0 && currentIndex > 0) {
            // Scroll w górę
            currentIndex--;
            isScrolling = true;
            updatePosition(currentIndex);
        } else {
            return;
        }

        // Blokada na szybkie scrollowanie
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            isScrolling = false;
        }, 300);
    });

    // Obsługa klawiszy strzałek
    $(document).on('keydown', function(e) {
        if (e.key === 'ArrowDown' && currentIndex < maxIndex) {
            e.preventDefault();
            currentIndex++;
            updatePosition(currentIndex);
        } else if (e.key === 'ArrowUp' && currentIndex > 0) {
            e.preventDefault();
            currentIndex--;
            updatePosition(currentIndex);
        }
    });

    // Funkcja aktualizująca aktywną kropkę
    function updateActiveDot(index) {
        $('.scroll-dot').removeClass('active');
        $('.scroll-dot').eq(index).addClass('active');
    }

    // Inicjalizacja
    updatePosition(0);

    // Wyłącz hover z CSS
    $pSlider.css('pointer-events', 'none');
});