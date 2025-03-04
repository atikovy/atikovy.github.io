
$(document).ready(function() {
    let name1 = "gracjan_pawłowski";
    let name2 = ":       portfolio";
    let outputDiv = $("nav .surname div:nth-of-type(1)");
    let outputDiv2 = $("nav .surname div:nth-of-type(2)");

    // Iterate through each character in the string
    $.each(name1.split(''), function(index, letter) {
        // Append a span with the letter to the output div
        outputDiv.append(`<h1 style="--delay: ${index + 1}">${letter}</h1>`);
    });
    $.each(name2.split(''), function(index, letter) {
        // Append a span with the letter to the output div
        outputDiv2.append(`<h2 style="--delay: ${index + 1}">${letter}</h2>`);
    });
});
