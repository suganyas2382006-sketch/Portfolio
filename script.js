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

    // ---------------------------------------------------------
    // 4. Code Window Typewriter Effect
    // ---------------------------------------------------------
    const codeElement = document.querySelector('.code-body code');
    
    if (codeElement) {
        // Store the original HTML with all the syntax highlighting spans
        const rawHTML = codeElement.innerHTML;
        codeElement.innerHTML = ''; // Clear it out for the animation
        
        let cursorPosition = 0;
        let isInsideTag = false;
        let currentHTML = '';
        
        function typeCode() {
            if (cursorPosition < rawHTML.length) {
                let char = rawHTML.charAt(cursorPosition);
                currentHTML += char;
                
                // Check if we are typing inside an HTML tag (like <span class="keyword">)
                if (char === '<') isInsideTag = true;
                if (char === '>') isInsideTag = false;
                
                // Update the screen with the current HTML plus a blinking cursor
                codeElement.innerHTML = currentHTML + '<span class="typing-cursor">_</span>';
                cursorPosition++;
                
                if (isInsideTag) {
                    // If it's a structural HTML tag, render it instantly without delay
                    typeCode();
                } else {
                    // Randomize typing speed slightly for a realistic human feel (10ms to 40ms)
                    let typingSpeed = Math.random() * 30 + 10;
                    
                    // Add a slight pause when hitting a line break
                    if (char === '\n') {
                        typingSpeed = 300;
                    }
                    
                    setTimeout(typeCode, typingSpeed);
                }
            } else {
                // Animation complete: leave the cursor blinking at the end
                codeElement.innerHTML = currentHTML + '<span class="typing-cursor">_</span>';
            }
        }
        
        // Start the typing animation 800ms after the page loads
        setTimeout(typeCode, 800);
    }
});
