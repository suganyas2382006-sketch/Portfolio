document.addEventListener('DOMContentLoaded', () => {
    const navContainer = document.querySelector('.swipe-container');
    const navItems = document.querySelectorAll('.nav-item');

    /* 1. Touch & Mouse Drag-to-Scroll Functionality */
    let isDown = false;
    let startX;
    let scrollLeft;

    navContainer.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - navContainer.offsetLeft;
        scrollLeft = navContainer.scrollLeft;
    });

    navContainer.addEventListener('mouseleave', () => isDown = false);
    navContainer.addEventListener('mouseup', () => isDown = false);

    navContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - navContainer.offsetLeft;
        const walk = (x - startX) * 2; // Adjust scroll speed multiplier
        navContainer.scrollLeft = scrollLeft - walk;
    });

    /* 2. Smooth Auto-Centering on Click */
    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            // Update Active State
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            // Scroll item smoothly to the center of the bar
            const containerWidth = navContainer.offsetWidth;
            const itemOffset = this.offsetLeft;
            const itemWidth = this.offsetWidth;

            navContainer.scrollTo({
                left: itemOffset - (containerWidth / 2) + (itemWidth / 2),
                behavior: 'smooth'
            });
        });
    });
});
