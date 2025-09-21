
document.addEventListener('DOMContentLoaded', function() {
const heading = document.getElementById('surname');
const text = heading.textContent;

heading.textContent = '';

for (let i = 0; i < text.length; i++) {
if (text[i] === ' ') {
    heading.appendChild(document.createTextNode(' '));
}
else {
    const span = document.createElement('span');
    span.textContent = text[i];
    span.className = 'surname-letter';

    // Losowe opóźnienie między 0s a 0.5s
    span.style.animationDelay = (0.2 + (Math.random() * 0.2)).toFixed(2) + 's';

    heading.appendChild(span);
    }
}
});

document.addEventListener('DOMContentLoaded', function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Dla elementów przy scrollowaniu - BRAK opóźnienia
                requestAnimationFrame(() => {
                    entry.target.classList.add('show');
                });
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '50px 0px'
    });

    const wrappers = document.querySelectorAll('.img-wrapper');
    const visibleWrappers = [];
    const hiddenWrappers = [];

    wrappers.forEach(wrapper => {
        const rect = wrapper.getBoundingClientRect();
        const isVisible = (
            rect.top <= (window.innerHeight * 0.9) &&
            rect.bottom >= (window.innerHeight * 0.1)
        );

        if (isVisible) {
            visibleWrappers.push(wrapper);
        } else {
            hiddenWrappers.push(wrapper);
            observer.observe(wrapper);
        }
    });

    // TYLKO dla początkowych elementów dodajemy opóźnienie
    visibleWrappers.forEach((wrapper, index) => {
        const delay = 1000 + index * 200;
        setTimeout(() => {
            wrapper.classList.add('show');
        }, delay);
    });
});