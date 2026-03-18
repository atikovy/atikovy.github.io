// svg-animation.js
// Independent SVG drawing animation for flexible slide

const SVGDrawing = (function() {
    // Prywatne zmienne
    let animationPlayed = false;
    let pathElement = null;
    let pathLength = 0;

    // Inicjalizacja - przygotuj SVG
    function init() {
        pathElement = document.getElementById('drawing-path');

        if (!pathElement) {
            console.log('SVG path not found yet, retrying...');
            // Spróbuj ponownie za chwilę (dla pewności że DOM jest załadowany)
            setTimeout(init, 100);
            return;
        }

        pathLength = pathElement.getTotalLength();

        // Ustaw początkowy stan - linia niewidoczna
        pathElement.style.strokeDasharray = pathLength;
        pathElement.style.strokeDashoffset = pathLength;
        pathElement.style.transition = 'none';

        console.log('SVG Drawing module initialized');
    }

    // Uruchom animację rysowania
    function play() {
        if (!pathElement || animationPlayed) return;

        // Force reflow
        pathElement.getBoundingClientRect();

        // Ustaw transition i uruchom animację
        pathElement.style.transition = 'stroke-dashoffset 2s cubic-bezier(0.5, 0, 0, 1)';
        pathElement.style.strokeDashoffset = '0';

        animationPlayed = true;
        console.log('SVG drawing animation played');
    }

    // Resetuj do stanu początkowego
    function reset() {
        if (!pathElement) return;

        pathElement.style.transition = 'none';
        pathElement.style.strokeDashoffset = pathLength;
        animationPlayed = false;
    }

    // Sprawdź czy animacja była już odtworzona
    function wasPlayed() {
        return animationPlayed;
    }

    // Publiczne API
    return {
        init: init,
        play: play,
        reset: reset,
        wasPlayed: wasPlayed
    };
})();

// Auto-inicjalizacja po załadowaniu DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SVGDrawing.init());
} else {
    // DOM już załadowany
    SVGDrawing.init();
}