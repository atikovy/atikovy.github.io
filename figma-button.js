$(document).ready(function() {
    // Dodaj przyciski "figma preview" dla elementów z klasą "figma"
    $('.img-wrapper.figma').each(function() {
        const $button = $('<div class="figma-button">figma preview</div>');
        $(this).append($button);
    });

    // Obsługa kliknięcia w przycisk figma
    $(document).on('click', '.figma-button', function(e) {
        e.stopPropagation();
        e.preventDefault();

        // Tutaj dodaj akcję dla przycisku figma
        console.log('Figma preview clicked for:', $(this).closest('.img-wrapper'));

        // Przykład: otwarcie linku (możesz dostosować)
        window.open('https://www.figma.com/proto/On8kdyzBu8ynaacCaj6orJ/-shadcn-ui---Design-System--Community-?node-id=113-1379&t=LCTwnmVIk1Bmryda-1', '_blank');
    });

    // Zapobiegaj otwieraniu overlay gdy klikamy w przycisk figma
    $(document).on('click', '.img-wrapper.figma', function(e) {
        // Jeśli kliknięto w przycisk figma, nie otwieraj overlay
        if ($(e.target).hasClass('figma-button') || $(e.target).closest('.figma-button').length) {
            e.stopPropagation();
            return false;
        }
    });
});