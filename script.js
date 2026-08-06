document.addEventListener('DOMContentLoaded', () => {
  /* --------------------------------------------------
     1. Navigation Bar (Auto-Centering & Swipe Control)
  -------------------------------------------------- */
  const navContainer = document.querySelector('.swipe-container');
  const navItems = document.querySelectorAll('.nav-item');
  const activeTab = document.querySelector('.nav-item.active');

  // Auto-center active tab on initial page load
  if (activeTab && navContainer) {
    const containerWidth = navContainer.offsetWidth;
    const tabOffset = activeTab.offsetLeft;
    const tabWidth = activeTab.offsetWidth;
    navContainer.scrollLeft = tabOffset - (containerWidth / 2) + (tabWidth / 2);
  }

  // Mouse drag-to-scroll controls
  let isDown = false;
  let isDragging = false;
  let startX;
  let scrollLeft;

  if (navContainer) {
    navContainer.addEventListener('mousedown', (e) => {
      isDown = true;
      isDragging = false;
      startX = e.pageX - navContainer.offsetLeft;
      scrollLeft = navContainer.scrollLeft;
    });

    navContainer.addEventListener('mouseleave', () => isDown = false);
    navContainer.addEventListener('mouseup', () => isDown = false);

    navContainer.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - navContainer.offsetLeft;
      const walk = (x - startX) * 1.5;
      if (Math.abs(walk) > 5) isDragging = true;
      navContainer.scrollLeft = scrollLeft - walk;
    });
  }

  // Smooth centering on click
  navItems.forEach(item => {
    item.addEventListener('click', function (e) {
      if (isDragging) {
        e.preventDefault();
        return;
      }
      navItems.forEach(nav => nav.classList.remove('active'));
      this.classList.add('active');
      this.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    });
  });

  /* --------------------------------------------------
     2. Interactive Node Canvas Background
  -------------------------------------------------- */
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Cursor & touch position tracking
  const pointer = { x: null, y: null, radius: 150 };

  function updatePointer(e) {
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    pointer.x = x;
    pointer.y = y;
  }

  window.addEventListener('mousemove', updatePointer);
  window.addEventListener('touchmove', updatePointer);
  window.addEventListener('mouseleave', () => { pointer.x = null; pointer.y = null; });
  window.addEventListener('touchend', () => { pointer.x = null; pointer.y = null; });

  // Particle creation
  const particles = [];
  const particleCount = Math.floor((width * height) / 15000);

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = 2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(124, 58, 237, 0.6)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Canvas animation loop
  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p, index) => {
      p.update();
      p.draw();

      // Draw connection lines between nearby particles
      for (let j = index + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);

        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(124, 58, 237, ${0.15 * (1 - dist / 100)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Draw connection lines to active cursor/touch point
      if (pointer.x !== null && pointer.y !== null) {
        const pDist = Math.hypot(p.x - pointer.x, p.y - pointer.y);
        if (pDist < pointer.radius) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.strokeStyle = `rgba(124, 58, 237, ${0.4 * (1 - pDist / pointer.radius)})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(animate);
  }

  animate();
});
