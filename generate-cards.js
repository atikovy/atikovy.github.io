$(document).ready(function() {
    // Fetch the JSON data from the 'projects.json' file
    $.getJSON("projects.json", function (projects) {
        // Iterate through each project in the JSON data
        projects.forEach(function(project, index) {
            // Create a new project card
            let projectCard = $('<div>', {
                class: 'project-card',
                css: { 'animation-delay': (index * 100) + 'ms' } // Delay increases with index
            });

            // Add title and link to the project card
            let projectTitle = $('<h2>').text(project.title);
            let projectLink = $('<a>', {
                href: project.url,
                text: 'View Project',
                target: '_blank'
            });

            // Create a div for tags
            let tagsDiv = $('<div>', { class: 'tags' });
            project.tags.forEach(function(tag) {
                let tagElement = $('<span>', { class: 'tag' }).text(tag);
                tagsDiv.append(tagElement);
            });

            // Append the elements to the project card
            projectCard.append(projectTitle, tagsDiv);

            // clickable
            projectCard.on('click', function() {
                $('.project-window').attr('src', project.url);
                $('.project-window').addClass('show');
                $('.project-preview').addClass('show');
            });

            // Append the project card to the project list container
            $('.project-list').append(projectCard);
        });
    }).fail(function() {
        console.error("Failed to load the JSON file.");
    });
});
