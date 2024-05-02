
function delay(URL) {
    const body = document.body;
    let elements = document.getElementsByClassName("portal");
    for (let i = 0; i < elements.length; i++) {
        setTimeout(() => {
            elements[i].style.width = "300vw";
            elements[i].style.height = "300vw";
        }, 0);}
    setTimeout(() => {
        window.location = URL;
    }, 1000)
}

window.addEventListener( "pageshow", function ( event ) {
    let historyTraversal = event.persisted ||
        ( typeof window.performance != "undefined" &&
            window.performance.navigation.type === 2 );
    if ( historyTraversal ) {
        // Handle page restore.
        let elements = document.getElementsByClassName("portal");
        for (let i = 0; i < elements.length; i++) {
            setTimeout(() => {
                elements[i].style.width = "0vw";
                elements[i].style.height = "0vw";
            }, 0);}
    }
});
