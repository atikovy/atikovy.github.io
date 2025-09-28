document.addEventListener('DOMContentLoaded', function() {
    // === KONFIGURACJA SURNAME SCROLL ===
    const heading = document.getElementById('surname');
    const text = heading.textContent;
    const projectGrid = document.querySelector('.project-grid');
    const surnameWrap = document.querySelector('.surname-wrap');

    heading.textContent = '';
    const surnameLetters = [];

    // Inicjalizacja liter
    for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') {
            heading.appendChild(document.createTextNode(' '));
        } else {
            const span = document.createElement('span');
            span.textContent = text[i];
            span.className = 'surname-letter';
            span.style.animationDelay = ((Math.random() * 0.5)).toFixed(5) + 's';
            heading.appendChild(span);
            surnameLetters.push(span);
        }
    }

    // Inicjalizacja obrazków
    const imgWrappers = document.querySelectorAll('.img-wrapper');
    const imgBaseDelay = 0.5;
    const imgIncrement = 0.1;
    imgWrappers.forEach((wrapper, index) => {
        const delay = imgBaseDelay + (index * imgIncrement);
        wrapper.style.transitionDelay = `${delay}s`;
        setTimeout(() => wrapper.classList.add('show'), 50);
    });

    // Funkcja aktualizacji pozycji liter w zależności od scrolla
    function updateLettersPosition() {
        const gridScrollLeft = projectGrid.scrollLeft;
        const gridScrollWidth = projectGrid.scrollWidth;
        const gridClientWidth = projectGrid.clientWidth;
        const maxScroll = gridScrollWidth - gridClientWidth;

        // Jeśli nie ma scrolla (strona jest za wąska), ustaw na początek
        const scrollPercentage = maxScroll > 0 ? gridScrollLeft / maxScroll : 0;

        // Sprawdź czy jesteśmy na początku lub końcu scrolla
        const isAtStart = gridScrollLeft <= 0;
        const isAtEnd = gridScrollLeft >= maxScroll;

        // Jeśli jesteśmy na początku lub końcu, zresetuj pozycje liter
        if (isAtStart || isAtEnd) {
            surnameLetters.forEach((letter) => {
                letter.style.transform = 'translateY(0px)';
                letter.style.transition = 'transform 0.3s ease';
            });
            return;
        }

        // Znajdź indeks litery, która powinna być uniesiona
        const activeIndex = Math.round(scrollPercentage * (surnameLetters.length - 1));

        // Aktualizuj pozycję każdej litery
        surnameLetters.forEach((letter, index) => {
            const distanceFromActive = Math.abs(index - activeIndex);

            // Tylko najbliższa litera jest uniesiona, reszta opada płynnie
            let translateY = 0;

            if (distanceFromActive === 0) {
                // Aktywna litera - uniesiona do góry
                translateY = -1.25;
            } else if (distanceFromActive === 1) {
                // Sąsiednie litery - lekko uniesione
                translateY = -0.75;
            } else if (distanceFromActive === 2) {
                // Drugi sąsiad - minimalnie uniesiony
                translateY = 0.15;
            }
            // Pozostałe litery mają translateY = 0 (normalna pozycja)

            letter.style.transform = `translateY(${translateY}rem)`;
            letter.style.transition = `transform 0.3s ease`;
        });
    }

    // === KONFIGURACJA SMOOTH SCROLL ===
    let isSmoothScrolling = false;
    let scrollVelocity = 0;
    let animationFrameId = null;
    let touchStartX = 0;
    let touchStartScrollLeft = 0;

    function smoothScroll() {
        if (Math.abs(scrollVelocity) > 0.1) {
            projectGrid.scrollLeft += scrollVelocity;
            scrollVelocity *= 0.94;

            updateLettersPosition();
            animationFrameId = requestAnimationFrame(smoothScroll);
        } else {
            isSmoothScrolling = false;
            scrollVelocity = 0;
        }
    }

    // Obsługa zdarzeń
    projectGrid.addEventListener('wheel', function(e) {
        e.preventDefault();
        scrollVelocity += e.deltaY * 0.1;

        if (!isSmoothScrolling) {
            isSmoothScrolling = true;
            smoothScroll();
        }
    }, { passive: false });

    projectGrid.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        touchStartScrollLeft = projectGrid.scrollLeft;

        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            isSmoothScrolling = false;
            scrollVelocity = 0;
        }
    }, { passive: true });

    projectGrid.addEventListener('touchmove', function(e) {
        e.preventDefault();
        const touchX = e.touches[0].clientX;
        const diff = touchStartX - touchX;
        projectGrid.scrollLeft = touchStartScrollLeft + diff;
        updateLettersPosition();
    }, { passive: false });

    projectGrid.addEventListener('touchend', function(e) {
        const touchX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchX;
        scrollVelocity = diff * 0.3;

        if (!isSmoothScrolling && Math.abs(scrollVelocity) > 1) {
            isSmoothScrolling = true;
            smoothScroll();
        }
    }, { passive: true });

    // Ręczny scroll też aktualizuje pozycje liter
    projectGrid.addEventListener('scroll', updateLettersPosition);
    window.addEventListener('resize', updateLettersPosition);

    // Inicjalizacja
    updateLettersPosition();

    // Cleanup
    window.addEventListener('beforeunload', function() {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
    });
});