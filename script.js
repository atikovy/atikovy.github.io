
var aspectRatio = window.innerWidth / window.innerHeight

// change link to mobile figma preview
if (aspectRatio < 1) {$('.small-button > .figma-preview').attr('href', 'https://www.figma.com/proto/ggE3nCyHQSDY5j0HrEiGlO/lorem-version?node-id=121-856');}

$(window).resize(function() {
    aspectRatio = window.innerWidth / window.innerHeight
});

if (aspectRatio > 1 ); {
    $(document).on('mousemove', function (e) {
        $('body').css({'--x': (((e.clientX + window.innerWidth/2) + window.innerWidth) / 2) /2 + 'px'});
        $('body').css({'--y': (((e.clientY + window.innerHeight/2) + window.innerHeight) / 2) /2 + 'px'});
    })
}

// show contact
$('.mobile-contact-button').click(function() {
    $(this).css({
        'transform': 'translateX(200%)',
    })

    $('.mobile-contact-overlay').css({
        'transform': 'translateX(50%)'
    })
})

// show contact
$('.mobile-contact-overlay').click(function() {
    $(this).css({
        'transform': 'translateX(200%)',
    })

    $('.mobile-contact-button').css({
        'transform': 'translateX(0%)'
    })
})

function resizeContainer() {
    const container = document.querySelector('.container-main');
    const footer = document.querySelector('.footer');
    $('body').css({'gap': 'var(--padding)'});
    $('.container-main').css({'margin-bottom': '10vh', 'height': '63vh'});
}

// project info
$(document).ready(function () {
    if (aspectRatio < 1) return;

    $('.project-preview > .icon').click(function () {
        if ($('.project-overlay').css('opacity') == '1') {
            $('.project-overlay').css({
                'transform': 'translateX(0%)',
            })
            $('.project-preview > .icon').css({
                'transform': 'translateX(-200%)',
            })
        }
        else {
            $('.project-overlay').css({
                'transform': 'translateX(-205%)',
            })
            $('.project-preview > .icon').css({
                'transform': 'translateX(0%)'
            })
        }
    })
    $('.project-img').click(function () {
        $('.project-overlay').css({
            'transform': 'translateX(-205%)'
        })
        $('.project-preview > .icon').css({
            'transform': 'translateX(0%)'
        })
    })
})

// update button border
$(document).ready(function() {
    if (aspectRatio < 1) return;

    function updateBorder($button) {
        var $border = $(".border");
        var buttonWidth = $button.outerWidth();
        var buttonPosition = $button.position().left;

        $border.animate({
            width: buttonWidth,
            left: buttonPosition
        }, 100); // Animation duration can be adjusted
    }

    $(".button").click(function() {
        var $button = $(this);

        // Change color of all buttons
        $(".button").css({
            'color': '#888888'
        });

        // Highlight the clicked button
        $button.css({
            'color': 'white'
        });

        // Update the position of the border
        updateBorder($button);
    });

    $(window).resize(function() {
        var $activeButton = $(".button").filter(function() {
            return $(this).css('color') == 'rgb(255, 255, 255)'; // white
        });

        if ($activeButton.length) {
            updateBorder($activeButton);
        }
    });
});

// main menu scroll
function ScrollToSection(sectionID) {
    if (aspectRatio < 1) return;

    const container = document.querySelector('.container-horizontal');

    if (sectionID == 'portfolio') {
        container.style.transform = 'translateX(0%)';
        $('.slider').css({
            'opacity': '1'
        })
    }
    if (sectionID == 'about') {
        container.style.transform = 'translateX(-33.334%)';
        $('.about-slide:nth-child(1)').each(function() {
            $(this).find('h1 , p').addClass('animate')

        })
        $('.slider').css({
            'opacity': '0'
        })
    }
    if (sectionID == 'contact') {
        container.style.transform = 'translateX(-66.667%)';
        $('.slider').css({
            'opacity': '0'
        })
    }

    $('.portfolio').css({
        'opacity': '0'
    })
    $('.about').css({
        'opacity': '0'
    })
    $('.contact').css({
        'opacity': '0'
    })
    document.getElementById(sectionID).style.opacity = '1';
    resizeContainer();
}

// portfolio scroll
document.addEventListener("DOMContentLoaded", function() {
    const portfolio = document.getElementById('portfolio');
    let portfolioPostion = 0
    let isScrolling = false;

    portfolio.addEventListener('wheel', function(event) {
        if (isScrolling || (aspectRatio < 1)) return;

        isScrolling = true;
        event.preventDefault();

        if (event.deltaY > 0) {
            //scroll down
            portfolioPostion = Math.min(portfolioPostion + 1, 2)
        } else {
            //scroll up
            portfolioPostion = Math.max(portfolioPostion - 1, 0)
        }

        $('.slider-thumb').css({ // this works
            'top': 'calc(0.5vh + 33% *' + (portfolioPostion) + ')'
        })

        position = -(portfolioPostion * 63) - (portfolioPostion * 2)
        portfolio.style.transform = `translateY(${position}vh)`

        setTimeout(function() {
            isScrolling = false;
        }, 500);
    });
});

// about scroll
document.addEventListener("DOMContentLoaded", function() {
    const about = $('#about');
    let nthSlide = 0
    let isScrolling = false;

    about.on('wheel', function(event) {
        if (isScrolling || (aspectRatio < 1)) return;

        isScrolling = true;
        event.preventDefault();

        if (event.originalEvent.deltaY > 0) {
            //scroll down
            nthSlide = Math.min(nthSlide + 1, 3)
        } else {
            //scroll up
            nthSlide = Math.max(nthSlide - 1, 0)
        }

        position = -(nthSlide * 63) - (nthSlide * 2)
        $('.about').css({
            'transform': `translateY(${position}vh)`
        })

        $('.about-slide:nth-child(' + (nthSlide + 1) + ') > h1').addClass('animate')
        $('.about-slide:nth-child(' + (nthSlide + 1) + ') > p').addClass('animate')

        setTimeout(function() {
            isScrolling = false;
        }, 500);
    });
});
