function delay (URL) {
    const body = document.body;
    let elements = document.getElementsByClassName("portal");
    for (let i = 0; i < elements.length; i++) {
        setTimeout(() => {
            elements[i].style.width = "200vw";
            elements[i].style.height = "200vw";
        });
    }
    setTimeout( function() { window.location = URL }, 1000 );
}

function delay2 (URL) {
    const body = document.body;
    let elements = document.getElementsByClassName("portal");
    for (let i = 0; i < elements.length; i++) {
        setTimeout(() => {
            elements[i].style.backgroundColor = "var(--github)";
            elements[i].style.width = "200vw";
            elements[i].style.height = "200vw";
        });
    }
    setTimeout( function() { window.location = URL }, 1000 );
}