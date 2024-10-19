
$('section').find('.passion, .quality, .choice').find('.wrap-horizontally.header-wrapper').addClass('animate-on-scroll')

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        console.log(entry)
        if (entry.isIntersecting) {
            $(entry.target).addClass('trigger-animation')
        }
        else {
            $(entry.target).removeClass('trigger-animation')
        }
    })
})

$('.animate-on-scroll').each(function () {
    observer.observe(this)
})
