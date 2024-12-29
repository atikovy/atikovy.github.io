$(document).ready(function () {
    // Fetch JSON data
    $.getJSON("projects.json", function (projects) {
        // Select the project container
        const projectContainer = $(".project-container");

        // Loop through the JSON data and create cards
        projects.forEach(project => {
            // Convert description array into HTML with <br> tags
            const descriptionHTML = project.description.map(line => `${line}`).join('<br>');

            const card = `
            <div class="project-card" style="background-color: ${project.color}">
                <div class="project-info">
                    <h3 class="project-title">${project.name}</h3>
                    <p class="project-description">${descriptionHTML}</p>
                    <a href="${project.url}" class="project-link" target="_blank">code</a>
                </div>
                <div class="img-wrapper">
                    <img src="${project.img}" alt="${project.name}" class="project-image" />
                </div>
            </div>`;

            // Append the card to the container
            projectContainer.append(card);
        });
    }).fail(function () {
        console.error("Failed to load project data.");
    });
});
