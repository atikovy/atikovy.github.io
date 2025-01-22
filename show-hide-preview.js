

$(document).ready(function() {
    $('body').on('click', '.project-card', function() {
        const projectURL = $(this).data('url')
        const projectTitle = $(this).data('title')

        $('.project-preview-window iframe').attr('src', projectURL)
        $('.project-preview-window .title .project-title').text(projectTitle)
        $('.project-preview-window').addClass('show-preview-window')
        $('.background-blur-overlay').addClass('apply-overlay')
    });

    $('.close-preview-button').on('click', function() {
        $('.project-preview-window').removeClass('show-preview-window')
        $('.background-blur-overlay').removeClass('apply-overlay')
    })
});