$(document).ready(function() {
    let projectsData = [];
    let currentProject = null;
    let isFirstLoad = true;
    let isAnimating = false;
    let animationQueue = [];

    // Load projects from JSON file
    $.getJSON('projects.json', function(data) {
        projectsData = data.projects;
        renderProjectList(projectsData);

        // Automatically select the first project
        if (projectsData.length > 0) {
            selectProject(projectsData[0].id);

            // Add selected class to first project after a small delay
            setTimeout(function() {
                $('.project-item').first().addClass('selected');
                // Apply the transform for the selected item
                $('.project-item.selected').css('transform', 'translateX(2rem)');
            }, 100);
        }
    }).fail(function() {
        console.error('Failed to load projects.json');
        // Fallback example data
        projectsData = getExampleProjects();
        renderProjectList(projectsData);
        if (projectsData.length > 0) {
            selectProject(projectsData[0].id);

            setTimeout(function() {
                $('.project-item').first().addClass('selected');
                $('.project-item.selected').css('transform', 'translateX(2rem)');
            }, 100);
        }
    });

    // Function to render the project list (left side) with sequential animation
    function renderProjectList(projects) {
        const listContainer = $('.project-list');
        listContainer.empty();

        projects.forEach((project, index) => {
            const projectItem = createProjectListItem(project);
            listContainer.append(projectItem);

            // Add sequential animation with delay based on index
            setTimeout(() => {
                projectItem.css({
                    'opacity': '1',
                    'transform': 'translateX(0)'
                });
            }, 100 + (index * 80));
        });
    }

    // Function to create a single project list item
    function createProjectListItem(project) {
        const item = $('<div>').addClass('logo-wrapper project-item').attr('data-project-id', project.id);

        // Set initial styles for animation
        item.css({
            'opacity': '0',
            'transform': 'translateX(-1rem)',
            'transition': 'opacity 0.3s ease, transform 0.3s ease, background-color 0.3s ease, outline-color 0.3s ease'
        });

        const img = $('<img>').attr({
            'src': project.logoPath,
            'alt': project.name + ' logo',
            'onerror': "this.src='./media/fallback-logo.png'"
        });

        item.append(img);

        // Add click handler with animation lock
        item.click(function() {
            if (isAnimating || currentProject?.id === project.id) {
                return;
            }

            selectProject(project.id);

            // Remove selected class from all items and reset their transform
            $('.project-item').each(function() {
                $(this).removeClass('selected');
                // Reset transform to original position if not animating
                if (!$(this).hasClass('selected')) {
                    $(this).css('transform', 'translateX(0)');
                }
            });

            // Add selected class to current item and apply transform
            $(this).addClass('selected');
            $(this).css('transform', 'translateX(2rem)');
        });

        return item;
    }

    // Function to select and display a project
    function selectProject(projectId) {
        const project = projectsData.find(p => p.id === projectId);
        if (!project) return;

        // Queue the animation if another is in progress
        if (isAnimating && !isFirstLoad) {
            animationQueue.push(project);
            return;
        }

        currentProject = project;
        updateProjectCard(project);
    }

    // Function to process queued animations
    function processQueue() {
        if (animationQueue.length > 0 && !isAnimating) {
            const nextProject = animationQueue.shift();
            selectProject(nextProject.id);
        }
    }

    // Function to update the project card with selected project data with animation
    function updateProjectCard(project) {
        const card = $('.project-card');

        // If first load, fill card with vertical entrance animation
        if (isFirstLoad) {
            // Remove any existing animation classes
            card.removeClass('card-exit card-enter');

            // Set initial position for entrance animation (from above)
            card.css({
                'opacity': '0',
                'transform': 'translateY(-2rem)',
                'transition': 'none'
            });

            // Fill card without animation
            card.empty();
            fillCardContent(card, project);

            // Trigger reflow to ensure initial styles are applied
            card[0].offsetHeight;

            // Add entrance animation with smooth transition
            setTimeout(() => {
                card.css({
                    'transition': 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    'opacity': '1',
                    'transform': 'translateY(0)'
                });
            }, 50);

            isFirstLoad = false;
            return;
        }

        // Set animation lock
        isAnimating = true;

        // Add exit animation
        card.addClass('card-exit');

        // Wait for exit animation to complete
        setTimeout(function() {
            // Clear current content
            card.empty();
            card.removeClass('card-exit');

            // Set initial position for new content entrance (from above)
            card.css({
                'opacity': '0',
                'transform': 'translateY(-2rem)',
                'transition': 'none'
            });

            // Fill with new content
            fillCardContent(card, project);

            // Trigger reflow
            card[0].offsetHeight;

            // Add enter animation with smooth transition
            setTimeout(function() {
                card.css({
                    'transition': 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    'opacity': '1',
                    'transform': 'translateY(0)'
                });

                // Release lock after animation completes
                setTimeout(function() {
                    isAnimating = false;
                    // Process any queued animations
                    processQueue();
                }, 500);
            }, 20);

        }, 200);
    }

    // Helper function to fill card content
    function fillCardContent(card, project) {
        // Create type section (tags at the top)
        const typeDiv = $('<div>').addClass('type-container');
        if (project.tags && project.tags.length > 0) {
            project.tags.forEach(tagText => {
                const type = $('<p>').addClass('type').text(tagText);
                typeDiv.append(type);
            });
        }

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
            const defaultTags = generateDefaultTags(project);
            defaultTags.forEach(tagText => {
                const tag = $('<p>').addClass('tag').text(tagText);
                tagContainer.append(tag);
            });
        }

        // Create buttons wrapper
        const buttonsWrapper = $('<div>').addClass('buttons-wrapper');

        // Create buttons based on project data
        if (project.buttons && project.buttons.length > 0) {
            project.buttons.forEach(buttonData => {
                const button = $('<div>').addClass('button');
                const buttonText = $('<p>').text(buttonData.label);

                button.append(buttonText);

                // Add click handler if link is provided and not '#'
                if (buttonData.link && buttonData.link !== '#') {
                    button.css('cursor', 'pointer');
                    button.click(function(e) {
                        e.stopPropagation();

                        if (buttonData.link.toLowerCase().endsWith('.pdf')) {
                            window.open(buttonData.link, '_blank');
                        } else {
                            window.open(buttonData.link, '_blank');
                        }
                    });
                }

                buttonsWrapper.append(button);
            });
        }

        // Assemble the card
        card.append(typeDiv, descriptionDiv, tagContainer, buttonsWrapper);
    }

    // Helper function to generate default tags based on project properties
    function generateDefaultTags(project) {
        const tags = [];

        if (project.name) {
            tags.push(project.name.toLowerCase());
        }

        if (project.id) {
            tags.push(project.id);
        }

        if (project.projectTags && project.projectTags.includes('finished')) {
            tags.push('complete');
        }
        if (project.projectTags && project.projectTags.includes('work in progress')) {
            tags.push('wip');
        }
        if (project.projectTags && project.projectTags.includes('non-commercial')) {
            tags.push('personal');
        }

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