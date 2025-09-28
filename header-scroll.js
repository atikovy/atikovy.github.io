document.addEventListener('DOMContentLoaded', function() {
    const heading = document.getElementById('surname');
    const text = heading.textContent;
    const projectGrid = document.querySelector('.project-grid');
    const surnameWrap = document.querySelector('.surname-wrap');

    heading.textContent = '';

    const surnameLetters = [];
    const baseDelay = 0.01;
    const delayIncrement = 0.01;

    // Zmienne do śledzenia kierunku scrolla poziomego
    let lastScrollLeft = 0;
    let isScrollingRight = true;

    for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') {
            heading.appendChild(document.createTextNode(' '));
        }
        else {
            const span = document.createElement('span');
            span.textContent = text[i];
            span.className = 'surname-letter';
            span.style.animationDelay = (0.2 + (Math.random() * 0.2)).toFixed(2) + 's';

            heading.appendChild(span);
            surnameLetters.push(span);
        }
    }

    const imgWrappers = document.querySelectorAll('.img-wrapper');
    const imgBaseDelay = 0.5;
    const imgIncrement = 0.1;

    imgWrappers.forEach((wrapper, index) => {
        const delay = imgBaseDelay + (index * imgIncrement);
        wrapper.style.transitionDelay = `${delay}s`;

        setTimeout(() => {
            wrapper.classList.add('show');
        }, 50);
    });

    function updateSurnamePosition() {
        const gridScrollLeft = projectGrid.scrollLeft;

        // Sprawdź kierunek scrollowania poziomego
        if (gridScrollLeft > lastScrollLeft) {
            isScrollingRight = true;
        } else if (gridScrollLeft < lastScrollLeft) {
            isScrollingRight = false;
        }
        lastScrollLeft = gridScrollLeft;

        const gridScrollWidth = projectGrid.scrollWidth;
        const gridClientWidth = projectGrid.clientWidth;

        // Oblicz procent przewinięcia poziomego (0 = lewo, 1 = prawo)
        const scrollPercentage = gridScrollLeft / (gridScrollWidth - gridClientWidth);

        const wrapWidth = surnameWrap.offsetWidth;
        const surnameWidth = heading.offsetWidth;
        const maxTranslate = wrapWidth - surnameWidth;

        // Teraz przesuwamy w poziomie zamiast w pionie
        const translateX = scrollPercentage * maxTranslate;

        // Aktualizuj transition delay w zależności od kierunku
        surnameLetters.forEach((letter, index) => {
            let delayIndex;

            if (isScrollingRight) {
                // Scroll w prawo - normalna kolejność (0, 1, 2, ...)
                delayIndex = surnameLetters.length - 1 - index;
            } else {
                // Scroll w lewo - odwrócona kolejność (ostatnia, przedostatnia, ...)
                delayIndex = index;
            }

            const transitionDelay = (delayIndex * delayIncrement + baseDelay).toFixed(2) + 's';
            letter.style.transition = `transform 0.5s ${transitionDelay} ease`;
            // Używamy translateX zamiast translateY
            letter.style.transform = `translateX(${translateX}px)`;
        });

        // Usuwamy rotate(180deg) ponieważ tekst już nie jest pionowy
        heading.style.transform = 'none';
    }

    projectGrid.addEventListener('scroll', updateSurnamePosition);
    window.addEventListener('resize', updateSurnamePosition);
    updateSurnamePosition();
});