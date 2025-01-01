$(document).ready(function () {
    // Fetch JSON data
    $.getJSON("projects.json", function (projects) {
        const projectContainer = $(".projects-container");

        // Loop through the JSON data and create cards
        projects.forEach(project => {
            const descriptionHTML = project.description.map(line => `${line}`).join('<br>');

            const card = `
            <div class="project-card" style="background-color: ${project.color}" data-name="${project.name}" data-description="${descriptionHTML}" data-img="${project.img}" data-url="${project.url}">
                <div class="project-info">
                    <h3 class="project-title">${project.name}</h3>
                </div>
                <div class="img-wrapper">
                    <img src="${project.img}" alt="${project.name}" class="project-image" />
                </div>
                <a href="${project.url}" class="project-link" target="_blank"></a>
            </div>`;

            // Append the card to the container
            projectContainer.append(card);

            // Create a new overlay specifically for this card
            const overlay = `
            <div class="description-overlay">
                <h3 class="project-title">.info</h3>
                <p class="project-description"></p>
            </div>`;

            // Append the individual overlay to the card
            projectContainer.append(overlay);

            // Attach hover events to show overlay
            projectContainer.on("mouseenter", ".project-card", function () {
                // Retrieve project-specific data
                const name = $(this).data('name');
                const description = $(this).data('description');
                const img = $(this).data('img');
                const url = $(this).data('url');
                const color = $(this).css('background-color');  // Get the background color of the card

                // Find the overlay corresponding to the current project card
                const $overlay = $(this).next(".description-overlay");

                // Update the overlay content with the current project details
                // $overlay.find(".project-title").html(name);
                $overlay.find(".project-description").html(description);

                // Set the overlay background color to the project card color
                // $overlay.css('background-color', color);

                // Use .position() to get position relative to parent container
                const cardPosition = $(this).position();

                // Convert pixel values to rem (assuming 16px base font size)
                const topPositionInRem = (cardPosition.top / 16) + 0;  // 140px -> 8.75rem
                const leftPositionInRem = ((cardPosition.left + $(this).outerWidth()) / 16) + 1;  // 50px -> 3.125rem

                // Position overlay next to the hovered card (with rem unit for responsiveness)
                $overlay.css({
                    opacity: 1,
                    transform: 'translateX(2%)',
                    top: 0,  // Positioning using rem
                    left: 'calc(100% + 2rem)'  // Positioning using rem
                });
            });

            projectContainer.on("mouseleave", ".project-card", function () {
                // Hide the overlay when mouse leaves the card
                const $overlay = $(this).next(".description-overlay");
                $overlay.css({
                    opacity: 0,
                    transform: 'translateX(0%)',
                });
            });
        });
    }).fail(function () {
        console.error("Failed to load project data.");
    });
});
