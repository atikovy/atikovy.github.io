document.addEventListener('DOMContentLoaded', function() {
    const heading = document.getElementById('surname');
    const text = heading.textContent;
    const projectGrid = document.querySelector('.project-grid');
    const surnameWrap = document.querySelector('.surname-wrap');

    heading.textContent = '';

    const surnameLetters = [];
    const baseDelay = 0.01;
    const delayIncrement = 0.01;

    // Zmienne do śledzenia kierunku scrolla
    let lastScrollTop = 0;
    let isScrollingDown = true;

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
        const gridScrollTop = projectGrid.scrollTop;

        // Sprawdź kierunek scrollowania
        if (gridScrollTop > lastScrollTop) {
            isScrollingDown = true;
        } else if (gridScrollTop < lastScrollTop) {
            isScrollingDown = false;
        }
        lastScrollTop = gridScrollTop;

        const gridScrollHeight = projectGrid.scrollHeight;
        const gridClientHeight = projectGrid.clientHeight;
        const scrollPercentage = gridScrollTop / (gridScrollHeight - gridClientHeight);
        const wrapHeight = surnameWrap.offsetHeight;
        const surnameHeight = heading.offsetHeight;
        const maxTranslate = wrapHeight - surnameHeight;
        const translateY = -scrollPercentage * maxTranslate;

        // Aktualizuj transition delay w zależności od kierunku
        surnameLetters.forEach((letter, index) => {
            let delayIndex;

            if (isScrollingDown) {
                // Scroll w dół - normalna kolejność (0, 1, 2, ...)
                delayIndex = index;
            } else {
                // Scroll w górę - odwrócona kolejność (ostatnia, przedostatnia, ...)
                delayIndex = surnameLetters.length - 1 - index;
            }

            const transitionDelay = (delayIndex * delayIncrement + baseDelay).toFixed(2) + 's';
            letter.style.transition = `transform 0.5s ${transitionDelay} ease`;
            letter.style.transform = `translateY(${translateY}px)`;
        });

        heading.style.transform = 'rotate(180deg)';
    }

    projectGrid.addEventListener('scroll', updateSurnamePosition);
    window.addEventListener('resize', updateSurnamePosition);
    updateSurnamePosition();
});