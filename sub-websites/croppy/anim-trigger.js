// Zamiast wielokrotnego użycia $(selector).find(), użyj jednego zapytania
const animatedElements = $('section .img-wrapper, section .header-container, .img-wrapper img, .img-wrapper .leaf-shadow');
animatedElements.addClass('animate-on-scroll');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Użyj requestAnimationFrame dla płynniejszej animacji
            requestAnimationFrame(() => {
                $(entry.target).addClass('trigger-animation');
                // Przestań obserwować element po uruchomieniu animacji
                observer.unobserve(entry.target);
            });
        }
    });
}, {
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.5 // Zmniejsz threshold dla szybszej reakcji
});

// Optymalizacja: ogranicz liczbę obserwowanych elementów
animatedElements.each(function () {
    observer.observe(this);
});