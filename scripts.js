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
    const $navbar = $('.navbar');

    // Selektory dla SVG
    const $flexibleSvgPath = $('#skill-svg .st0');
    const $thinkerSvgPath = $('#thinker-svg .cls-2');
    const $flexibleSvg = $('#skill-svg');
    const $thinkerSvg = $('#thinker-svg');

    // Pobierz aktualny rozmiar czcionki z html (domyślnie 16px)
    const baseFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);

    // Funkcja pomocnicza do konwersji rem na px
    function remToPx(rem) {
        return rem * baseFontSize;
    }

    // Wszystkie wartości w rem (przeliczone z px)
    const headerHeight = remToPx(2.5); // 2.5rem = 40px
    const gap = remToPx(1); // 1rem = 16px
    const textBoxWidth = remToPx(18); // 18rem = 288px
    const boxHeight = remToPx(20); // 20rem = 320px
    const boxGap = remToPx(2); // 2rem = 32px

    let currentIndex = 0;
    const maxIndex = 2; // 0, 1, 2 (3 pozycje)
    let isScrolling = false;
    let scrollTimeout;
    let navbarTimeout;

    // Zmienne do obsługi animacji SVG dla flexible
    let flexibleSvgAnimated = false;
    let flexiblePathLength = 0;
    let flexibleAnimationTimeout;

    // Zmienne do obsługi animacji SVG dla thinker
    let thinkerSvgAnimated = false;
    let thinkerPathLength = 0;
    let thinkerAnimationTimeout;

    // Inicjalizacja SVG flexible - przygotowanie do animacji
    function initFlexibleSvgAnimation() {
        if ($flexibleSvgPath.length) {
            flexiblePathLength = $flexibleSvgPath[0].getTotalLength();

            $flexibleSvgPath.css({
                'stroke-dasharray': flexiblePathLength,
                'stroke-dashoffset': flexiblePathLength,
                'transition': 'none'
            });

            $flexibleSvgPath[0].getBoundingClientRect();
        }
    }

    // Inicjalizacja SVG thinker - przygotowanie do animacji
    function initThinkerSvgAnimation() {
        if ($thinkerSvgPath.length) {
            thinkerPathLength = $thinkerSvgPath[0].getTotalLength();

            $thinkerSvgPath.css({
                'stroke-dasharray': thinkerPathLength,
                'stroke-dashoffset': thinkerPathLength,
                'transition': 'none'
            });

            $thinkerSvgPath[0].getBoundingClientRect();
        }
    }

    // Funkcja animująca rysowanie SVG flexible
    function animateFlexibleSvgDrawing() {
        if (!flexibleSvgAnimated && $flexibleSvgPath.length) {
            if (flexibleAnimationTimeout) {
                clearTimeout(flexibleAnimationTimeout);
            }

            flexibleAnimationTimeout = setTimeout(function() {
                if (flexiblePathLength === 0) {
                    flexiblePathLength = $flexibleSvgPath[0].getTotalLength();
                    $flexibleSvgPath.css('stroke-dasharray', flexiblePathLength);
                }

                $flexibleSvgPath.css({
                    'transition': 'stroke-dashoffset 2s 0s cubic-bezier(0.5, 0, 0, 1), stroke-width 2s 0s cubic-bezier(0.5, 0, 0, 1)',
                    'stroke-width': remToPx(1), // 1rem = 16px
                    'stroke-dashoffset': '0'
                });

                flexibleSvgAnimated = true;
            }, 500);
        }
    }

    // Funkcja animująca rysowanie SVG thinker
    function animateThinkerSvgDrawing() {
        if (!thinkerSvgAnimated && $thinkerSvgPath.length) {
            if (thinkerAnimationTimeout) {
                clearTimeout(thinkerAnimationTimeout);
            }

            thinkerAnimationTimeout = setTimeout(function() {
                if (thinkerPathLength === 0) {
                    thinkerPathLength = $thinkerSvgPath[0].getTotalLength();
                    $thinkerSvgPath.css('stroke-dasharray', thinkerPathLength);
                }

                $thinkerSvgPath.css({
                    'transition': 'stroke-dashoffset 2s 0s cubic-bezier(0.5, 0, 0, 1), stroke-width 2s 0s cubic-bezier(0.5, 0, 0, 1)',
                    'stroke-width': remToPx(1), // 1rem = 16px
                    'stroke-dashoffset': '0'
                });

                thinkerSvgAnimated = true;
            }, 500);
        }
    }

    // Funkcja zmywająca SVG flexible
    function eraseFlexibleSvgDrawing() {
        if ($flexibleSvgPath.length) {
            if (flexibleAnimationTimeout) {
                clearTimeout(flexibleAnimationTimeout);
                flexibleAnimationTimeout = null;
            }

            if (flexiblePathLength === 0) {
                flexiblePathLength = $flexibleSvgPath[0].getTotalLength();
                $flexibleSvgPath.css('stroke-dasharray', flexiblePathLength);
            }

            $flexibleSvgPath.css({
                'transition': 'stroke-dashoffset 0.5s cubic-bezier(0.5, 0, 0, 1), stroke-width 0.5s cubic-bezier(0.5, 0, 0, 1)',
                'stroke-width': remToPx(1), // 1rem = 16px
                'stroke-dashoffset': flexiblePathLength
            });

            flexibleSvgAnimated = false;
        }
    }

    // Funkcja zmywająca SVG thinker
    function eraseThinkerSvgDrawing() {
        if ($thinkerSvgPath.length) {
            if (thinkerAnimationTimeout) {
                clearTimeout(thinkerAnimationTimeout);
                thinkerAnimationTimeout = null;
            }

            if (thinkerPathLength === 0) {
                thinkerPathLength = $thinkerSvgPath[0].getTotalLength();
                $thinkerSvgPath.css('stroke-dasharray', thinkerPathLength);
            }

            $thinkerSvgPath.css({
                'transition': 'stroke-dashoffset 0.5s cubic-bezier(0.5, 0, 0, 1), stroke-width 0.5s cubic-bezier(0.5, 0, 0, 1)',
                'stroke-width': remToPx(1), // 1rem = 16px
                'stroke-dashoffset': thinkerPathLength
            });

            thinkerSvgAnimated = false;
        }
    }

    // Funkcja pokazująca navbar po 6 sekundach
    function showNavbarWithDelay() {
        if (navbarTimeout) {
            clearTimeout(navbarTimeout);
        }

        navbarTimeout = setTimeout(function() {
            $navbar.css({
                'opacity': '1',
                'height': remToPx(16), // 16rem
                'pointer-events': 'auto'
            });
            // console.log("Navbar pokazany!");
        }, 6000);
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
        const newTranslateY = -(index * (boxHeight + boxGap));
        $boxes.css('transform', `translateY(${newTranslateY}px)`);

        $boxes.each(function(i) {
            if (i === index) {
                $(this).css({
                    'opacity': '1',
                    'transition': 'transform 1s 0.1s cubic-bezier(0.5, 0, 0, 1), opacity 1s 0.5s cubic-bezier(0.5, 0, 0, 1)',
                });
            } else {
                $(this).css({
                    'opacity': '0',
                    'transition': 'transform 1s 0s cubic-bezier(0.5, 0, 0, 1), opacity 0.5s 0s cubic-bezier(0.5, 0, 0, 1)'
                });
            }
        });
    }

    // Funkcja aktualizująca pozycję i opacity text-boxów
    function updateTextBoxes(index) {
        const newTranslateX = -(index * textBoxWidth);
        $textBoxes.css('transform', `translateX(${newTranslateX}px)`);

        $textBoxes.each(function(i) {
            if (i === index) {
                $(this).css({
                    'opacity': '1',
                    'transition': 'transform 1s 0.1s cubic-bezier(0.5, 0, 0, 1), opacity 1s 0.5s cubic-bezier(0.5, 0, 0, 1)',
                });
            } else {
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
    function updatePosition(index, previousIndex) {
        updateHeaders(index);
        updateTextBoxes(index);
        updateBoxes(index);
        updateActiveDot(index);

        // Obsługa animacji dla flexible (indeks 1)
        if (index === 1) {
            if (previousIndex === 0 || previousIndex === 2) {
                animateFlexibleSvgDrawing();
            }
        }

        // Obsługa animacji dla thinker (indeks 2)
        if (index === 2) {
            if (previousIndex === 0 || previousIndex === 1) {
                animateThinkerSvgDrawing();
            }
        }

        // Zmywanie flexible SVG przy opuszczaniu flexible
        if (previousIndex === 1 && index !== 1) {
            eraseFlexibleSvgDrawing();
        }

        // Zmywanie thinker SVG przy opuszczaniu thinker
        if (previousIndex === 2 && index !== 2) {
            eraseThinkerSvgDrawing();
        }

        // Upewnij się, że narysowane SVG pozostają widoczne gdy jesteśmy w ich sekcji
        if (index === 1 && flexibleSvgAnimated) {
            $flexibleSvgPath.css({
                'transition': 'none',
                'stroke-dashoffset': '0',
                'stroke-width': remToPx(1) // 1rem = 16px
            });
        }

        if (index === 2 && thinkerSvgAnimated) {
            $thinkerSvgPath.css({
                'transition': 'none',
                'stroke-dashoffset': '0',
                'stroke-width': remToPx(1) // 1rem = 16px
            });
        }

        if (index === maxIndex) {
            showNavbarWithDelay();
        } else {
            hideNavbar();
        }
    }

    // Obsługa kliknięcia na kropki
    $('.scroll-dot').on('click', function() {
        const index = $(this).index();
        const previousIndex = currentIndex;
        currentIndex = index;
        updatePosition(index, previousIndex);
    });

    // Obsługa scrollowania na całym oknie
    $(window).on('wheel', function(e) {
        e.preventDefault();

        if (isScrolling) return;

        const delta = e.originalEvent.deltaY;
        const previousIndex = currentIndex;

        if (delta > 0 && currentIndex < maxIndex) {
            currentIndex++;
            isScrolling = true;
            updatePosition(currentIndex, previousIndex);
        } else if (delta < 0 && currentIndex > 0) {
            currentIndex--;
            isScrolling = true;
            updatePosition(currentIndex, previousIndex);
        } else {
            return;
        }

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            isScrolling = false;
        }, 300);
    });

    // Obsługa klawiszy strzałek
    $(document).on('keydown', function(e) {
        if (e.key === 'ArrowDown' && currentIndex < maxIndex) {
            e.preventDefault();
            const previousIndex = currentIndex;
            currentIndex++;
            updatePosition(currentIndex, previousIndex);
        } else if (e.key === 'ArrowUp' && currentIndex > 0) {
            e.preventDefault();
            const previousIndex = currentIndex;
            currentIndex--;
            updatePosition(currentIndex, previousIndex);
        }
    });

    // Funkcja aktualizująca aktywną kropkę
    function updateActiveDot(index) {
        $('.scroll-dot').removeClass('active');
        $('.scroll-dot').eq(index).addClass('active');
    }

    // Inicjalizacja animacji SVG
    initFlexibleSvgAnimation();
    initThinkerSvgAnimation();

    // Inicjalizacja pozycji
    updatePosition(0, 0);

    // Wyłącz hover z CSS
    $pSlider.css('pointer-events', 'none');
});