document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Ripple Effect for Buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            let x = e.clientX - e.target.getBoundingClientRect().left;
            let y = e.clientY - e.target.getBoundingClientRect().top;
            
            let ripples = document.createElement('span');
            ripples.style.left = x + 'px';
            ripples.style.top = y + 'px';
            ripples.classList.add('ripple');
            this.appendChild(ripples);
            
            setTimeout(() => { ripples.remove(); }, 600);
        });
    });

    // 2. Scroll Reveal Observer for Cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Staggered delay based on element index
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedCards = document.querySelectorAll('.anim-card, .cert-item');
    animatedCards.forEach(card => observer.observe(card));

    // 3. Center Active Nav Item on Mobile Swipe Bar
    const navWrapper = document.querySelector('.floating-nav-wrapper');
    const activeLink = document.querySelector('.nav-links a.active');
    
    if (navWrapper && activeLink) {
        const scrollPos = activeLink.offsetLeft - (navWrapper.offsetWidth / 2) + (activeLink.offsetWidth / 2);
        navWrapper.scrollTo({ left: scrollPos, behavior: 'smooth' });
    }
});
