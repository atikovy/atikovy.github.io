$(document).ready(function() {
    let projectsData = [];
    let currentProject = null;
    let isFirstLoad = true; // Flaga dla pierwszego załadowania
    let isAnimating = false; // Flaga blokady animacji

    // Load projects from JSON file
    $.getJSON('projects.json', function(data) {
        projectsData = data.projects;
        renderProjectList(projectsData);

        // Automatically select the first project
        if (projectsData.length > 0) {
            selectProject(projectsData[0].id);

            // Dodaj klasę selected do pierwszego projektu w liście
            setTimeout(function() {
                $('.project-item').first().addClass('selected');
            }, 100); // Małe opóźnienie, aby upewnić się że elementy są w DOM
        }
    }).fail(function() {
        console.error('Failed to load projects.json');
        // Fallback example data
        projectsData = getExampleProjects();
        renderProjectList(projectsData);
        if (projectsData.length > 0) {
            selectProject(projectsData[0].id);

            // Dodaj klasę selected do pierwszego projektu w liście
            setTimeout(function() {
                $('.project-item').first().addClass('selected');
            }, 100);
        }
    });

    // Function to render the project list (left side)
    function renderProjectList(projects) {
        const listContainer = $('.project-list');
        listContainer.empty(); // Remove placeholder items

        projects.forEach(project => {
            const projectItem = createProjectListItem(project);
            listContainer.append(projectItem);
        });
    }

    // Function to create a single project list item
    function createProjectListItem(project) {
        const item = $('<div>').addClass('logo-wrapper project-item').attr('data-project-id', project.id);

        const img = $('<img>').attr({
            'src': project.logoPath,
            'alt': project.name + ' logo',
            'onerror': "this.src='./media/fallback-logo.png'"
        });

        item.append(img);

        // Add click handler z blokadą animacji
        item.click(function() {
            // Sprawdź czy animacja jest w toku lub to ten sam projekt
            if (isAnimating || currentProject?.id === project.id) {
                return; // Blokuj kliknięcie
            }

            selectProject(project.id);

            // Add visual feedback for selected item
            $('.project-item').removeClass('selected');
            $(this).addClass('selected');
        });

        return item;
    }

    // Function to select and display a project
    function selectProject(projectId) {
        const project = projectsData.find(p => p.id === projectId);
        if (!project) return;

        currentProject = project;
        updateProjectCard(project);
    }

    // Function to update the project card with selected project data with animation
    function updateProjectCard(project) {
        const card = $('.project-card');

        // Jeśli to pierwsze załadowanie, po prostu wypełnij kartę bez animacji
        if (isFirstLoad) {
            // Wypełnij kartę bez animacji
            card.empty();

            // Create type section (formerly tags) - NOW AT THE TOP
            const typeDiv = $('<div>').addClass('type-container');
            project.tags.forEach(tagText => {
                const type = $('<p>').addClass('type').text(tagText);
                typeDiv.append(type);
            });

            // Create description section
            const descriptionDiv = $('<div>').addClass('project-description');
            const descriptionTitle = $('<h4>').text('Description:');
            const descriptionText = $('<p>').html(project.description.replace(/\n/g, '<br>'));
            descriptionDiv.append(descriptionTitle, descriptionText);

            // Create tags container with individual tags
            const tagContainer = $('<div>').addClass('tag-container');
            if (project.projectTags && project.projectTags.length > 0) {
                project.projectTags.forEach(tagText => {
                    const tag = $('<p>').addClass('tag').text(tagText);
                    tagContainer.append(tag);
                });
            } else {
                // Add some default tags based on project properties or leave empty
                const defaultTags = generateDefaultTags(project);
                defaultTags.forEach(tagText => {
                    const tag = $('<p>').addClass('tag').text(tagText);
                    tagContainer.append(tag);
                });
            }

            // Create buttons wrapper
            const buttonsWrapper = $('<div>').addClass('buttons-wrapper');

            // Create buttons based on project data
            project.buttons.forEach(buttonData => {
                const button = $('<div>').addClass('button');
                const buttonText = $('<p>').text(buttonData.label);

                button.append(buttonText);

                // Add click handler if link is provided and not '#'
                if (buttonData.link && buttonData.link !== '#') {
                    button.css('cursor', 'pointer');
                    button.click(function(e) {
                        e.stopPropagation(); // Prevent event bubbling
                        window.open(buttonData.link, '_blank');
                    });
                }

                buttonsWrapper.append(button);
            });

            // Assemble the card with type at the top, then description, then tags, then buttons
            card.append(typeDiv, descriptionDiv, tagContainer, buttonsWrapper);

            // Ustaw flagę, że pierwsze załadowanie się zakończyło
            isFirstLoad = false;

            return;
        }

        // Ustaw blokadę animacji
        isAnimating = true;

        // Dla kolejnych kliknięć - dodajemy animację
        // Add animation class for slide
        card.addClass('card-exit');

        // Wait for exit animation to complete
        setTimeout(function() {
            // Clear current content
            card.empty();
            card.removeClass('card-exit');

            // Create type section (formerly tags) - NOW AT THE TOP
            const typeDiv = $('<div>').addClass('type-container');
            project.tags.forEach(tagText => {
                const type = $('<p>').addClass('type').text(tagText);
                typeDiv.append(type);
            });

            // Create description section
            const descriptionDiv = $('<div>').addClass('project-description');
            const descriptionTitle = $('<h4>').text('Description:');
            const descriptionText = $('<p>').html(project.description.replace(/\n/g, '<br>'));
            descriptionDiv.append(descriptionTitle, descriptionText);

            // Create tags container with individual tags
            const tagContainer = $('<div>').addClass('tag-container');
            if (project.projectTags && project.projectTags.length > 0) {
                project.projectTags.forEach(tagText => {
                    const tag = $('<p>').addClass('tag').text(tagText);
                    tagContainer.append(tag);
                });
            } else {
                // Add some default tags based on project properties or leave empty
                const defaultTags = generateDefaultTags(project);
                defaultTags.forEach(tagText => {
                    const tag = $('<p>').addClass('tag').text(tagText);
                    tagContainer.append(tag);
                });
            }

            // Create buttons wrapper
            const buttonsWrapper = $('<div>').addClass('buttons-wrapper');

            // Create buttons based on project data
            project.buttons.forEach(buttonData => {
                const button = $('<div>').addClass('button');
                const buttonText = $('<p>').text(buttonData.label);

                button.append(buttonText);

                // Add click handler if link is provided and not '#'
                if (buttonData.link && buttonData.link !== '#') {
                    button.css('cursor', 'pointer');
                    button.click(function(e) {
                        e.stopPropagation(); // Prevent event bubbling

                        // Sprawdź czy to plik PDF
                        if (buttonData.link.toLowerCase().endsWith('.pdf')) {
                            // Otwórz PDF w nowej karcie
                            window.open(buttonData.link, '_blank');
                        } else {
                            // Dla innych linków
                            window.open(buttonData.link, '_blank');
                        }
                    });
                }

                buttonsWrapper.append(button);
            });

            // Assemble the card with type at the top, then description, then tags, then buttons
            card.append(typeDiv, descriptionDiv, tagContainer, buttonsWrapper);

            // Add enter animation class
            card.addClass('card-enter');

            // Remove enter animation class and release lock after animation completes
            setTimeout(function() {
                card.removeClass('card-enter');
                isAnimating = false; // Zwolnij blokadę
            }, 400);

        }, 200); // Match this with CSS transition duration
    }

    // Helper function to generate default tags based on project properties
    function generateDefaultTags(project) {
        const tags = [];

        // Add tag based on project name
        if (project.name) {
            tags.push(project.name.toLowerCase());
        }

        // Add tag based on id
        if (project.id) {
            tags.push(project.id);
        }

        // Add some generic tags based on project properties
        if (project.projectTags && project.projectTags.includes('finished')) {
            tags.push('complete');
        }
        if (project.projectTags && project.projectTags.includes('work in progress')) {
            tags.push('wip');
        }
        if (project.projectTags && project.projectTags.includes('non-commercial')) {
            tags.push('personal');
        }

        // Return unique tags (max 3 to avoid overcrowding)
        return [...new Set(tags)].slice(0, 3);
    }

    // Fallback example data function
    function getExampleProjects() {
        return [
            {
                id: "croppy",
                name: "Croppy",
                logoPath: "./media/logo-croppy.png",
                description: "Started as a simple logotype idea for\nan imaginary plant shop.\nOver time, it evolved into mobile app\nprototype with its own design system.",
                tags: ["work in progress", "non-commercial"],
                projectTags: ["mobile", "design-system", "conceptual"],
                buttons: [
                    { label: "prototype", link: "#" },
                    { label: "project file", link: "#" }
                ]
            },
            {
                id: "weather-app",
                name: "Weather App",
                logoPath: "./media/logo-weather.png",
                description: "Minimalist weather application with\nreal-time data and beautiful animations.\nBuilt with vanilla JavaScript and\nOpenWeather API.",
                tags: ["completed", "open-source"],
                projectTags: ["javascript", "api", "weather"],
                buttons: [
                    { label: "demo", link: "#" },
                    { label: "github", link: "#" }
                ]
            },
            {
                id: "going",
                name: "Going",
                logoPath: "./media/logo-going.png",
                description: "College assignment, focused on a specific UX problem based on a real website.",
                tags: ["finished", "non-commercial", "college"],
                projectTags: ["ux", "research", "prototype"],
                buttons: [
                    { label: "presentation", link: "#" }
                ]
            }
        ];
    }
});