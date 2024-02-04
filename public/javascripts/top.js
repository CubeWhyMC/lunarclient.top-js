document.addEventListener('DOMContentLoaded', function() {
    const scrollButtons = document.querySelectorAll('.scrollToTopButton');
    scrollButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });
});