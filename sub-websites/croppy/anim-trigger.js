
$('section').find('.img-container').addClass('animate-on-scroll')
$('section').find('.header-wrapper').addClass('animate-on-scroll')

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        console.log(entry)
        if (entry.isIntersecting) {
            $(entry.target).addClass('trigger-animation')
        }
    })
}, {
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.5
})

$('.animate-on-scroll').each(function () {
    observer.observe(this)
})
