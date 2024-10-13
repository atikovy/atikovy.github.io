
var aspectRatio = window.innerWidth / window.innerHeight

// change link to mobile figma preview
if (aspectRatio < 3/4) {$('#project-0 .small-button > .figma-preview').attr('href', 'https://www.figma.com/proto/OKXMxzrX3pqYVzZALghq4H/LandingPage?page-id=113%3A1379&node-id=121-856&node-type=frame&viewport=1344%2C440%2C0.13&t=KCnsxP5gOgDcjMHc-8&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=121%3A856&share=1&show-proto-sidebar=1&hide-ui=1');}

$(window).resize(function() {
    aspectRatio = window.innerWidth / window.innerHeight
});

// "blob background" following mouse, theres propably way more efficient math formula for that
if (aspectRatio > 3/4) {
    let requestId;
    $(document).on('mousemove', function (e) {
        if (!requestId) {
            requestId = requestAnimationFrame(function () {
                $('body').css({
                    '--x': (((e.clientX + window.innerWidth / 2) + window.innerWidth) / 2) / 2 + 'px',
                    '--y': (((e.clientY + window.innerHeight / 2) + window.innerHeight) / 2) / 2 + 'px'
                });
                requestId = null;
            });
        }
    });
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
    $('.project-img').on('click', function () {
        if (aspectRatio > 3/4) {
            if ($('.project-overlay').css('--visible') == 'true') {
                $('.project-overlay').css({
                    'transform': 'translateX(-100%)',
                    '--visible': false
                })
                console.log($('.project-overlay').css('--visible'));
            }
            else {
                $('.project-overlay').css({
                    'transform': 'translateX(0%)',
                    '--visible': true
                })
                console.log($('.project-overlay').css('--visible'));
            }
        }
    })
})

// update button border
$(document).ready(function() {
    if (aspectRatio < 3/4) return;

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
            return $(this).css('color') == 'white'; // white
        });

        if ($activeButton.length) {
            updateBorder($activeButton);
        }
    });
});

// main menu scroll
function ScrollToSection(sectionID) {
    if (aspectRatio < 3/4) return;

    const container = document.querySelector('.container-horizontal');

    if (sectionID == 'portfolio') {
        container.style.transform = 'translateX(0%)';
        $('.slider').css({
            'transition': 'opacity 0.5s 1s var(--bezier)',
            'opacity': '1'
        })
    }
    if (sectionID == 'about') {
        container.style.transform = 'translateX(-33.334%)';
        $('.about-slide:nth-child(1)').each(function() {
            $(this).find('h1 , p').addClass('animate')

        })
        $('.slider').css({
            'transition': 'opacity 0.2s 0s var(--bezier)',
            'opacity': '0'
        })
    }
    if (sectionID == 'contact') {
        container.style.transform = 'translateX(-66.667%)';
        $('.slider').css({
            'transition': 'opacity 0.2s 0s var(--bezier)',
            'opacity': '0'
        })
    }

    $('.portfolio, .about, .contact').css({
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
            portfolioPostion = Math.min(portfolioPostion + 1, 3)
        } else {
            //scroll up
            portfolioPostion = Math.max(portfolioPostion - 1, 0)
        }

        $('.slider-thumb').css({ // this works
            'top': 'calc(25% *' + (portfolioPostion) + ')'
        })

        position = -(portfolioPostion * 63) - (portfolioPostion * 2)
        portfolio.style.transform = `translateY(${position}vh)`

        setTimeout(function() {
            isScrolling = false;
        }, 1000);
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
