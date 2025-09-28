// smooth-horizontal-scroll.js
document.addEventListener('DOMContentLoaded', function() {
    const projectGrid = document.querySelector('.project-grid');

    if (!projectGrid) return;

    // Zmienne do śledzenia stanu scrolla
    let isScrolling = false;
    let scrollStartTime = 0;
    let scrollVelocity = 0;
    let animationFrameId = null;

    // Funkcja smooth scroll z inertia
    function smoothScroll() {
        if (Math.abs(scrollVelocity) > 0.1) {
            projectGrid.scrollLeft += scrollVelocity;
            scrollVelocity *= 0.95; // inertia effect

            animationFrameId = requestAnimationFrame(smoothScroll);
        } else {
            isScrolling = false;
            scrollVelocity = 0;
        }
    }

    // Obsługa kółka myszy
    projectGrid.addEventListener('wheel', function(e) {
        e.preventDefault();

        // Dodaj momentum do istniejącego scrollVelocity
        scrollVelocity += e.deltaY * 0.2;

        if (!isScrolling) {
            isScrolling = true;
            scrollStartTime = Date.now();
            smoothScroll();
        }
    });

    // Opcjonalnie: obsługa touch events dla urządzeń mobilnych
    let touchStartX = 0;
    let touchStartScrollLeft = 0;

    projectGrid.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        touchStartScrollLeft = projectGrid.scrollLeft;

        // Zatrzymaj aktualną animację
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            isScrolling = false;
            scrollVelocity = 0;
        }
    });

    projectGrid.addEventListener('touchmove', function(e) {
        e.preventDefault();
        const touchX = e.touches[0].clientX;
        const diff = touchStartX - touchX;
        projectGrid.scrollLeft = touchStartScrollLeft + diff;
    });

    projectGrid.addEventListener('touchend', function(e) {
        const touchX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchX;

        // Dodaj momentum po zakończeniu touch
        scrollVelocity = diff * 0.5;

        if (!isScrolling && Math.abs(scrollVelocity) > 1) {
            isScrolling = true;
            smoothScroll();
        }
    });

    // Zapobiegaj domyślnemu zachowaniu scrolla klawiszem strzałek
    projectGrid.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
            scrollVelocity += e.key === 'ArrowRight' ? 30 : -30;

            if (!isScrolling) {
                isScrolling = true;
                smoothScroll();
            }
        }
    });

    // Cleanup przy usuwaniu elementu
    window.addEventListener('beforeunload', function() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    });
});