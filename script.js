document.addEventListener('DOMContentLoaded', () => {
  /* --------------------------------------------------
     1. Bottom Navigation Bar (Auto-Centering & Drag)
  -------------------------------------------------- */
  const navContainer = document.querySelector('.swipe-container');
  const navItems = document.querySelectorAll('.nav-item');

  function centerActiveTab(smooth = false) {
    const activeTab = document.querySelector('.nav-item.active');
    if (!activeTab || !navContainer) return;

    const containerWidth = navContainer.offsetWidth;
    const tabOffset = activeTab.offsetLeft;
    const tabWidth = activeTab.offsetWidth;

    // Prevent scrolling if layout dimensions are not calculated yet
    if (containerWidth === 0 || tabWidth === 0) return;

    const targetScroll = tabOffset - (containerWidth / 2) + (tabWidth / 2);

    navContainer.scrollTo({
      left: targetScroll,
      behavior: smooth ? 'smooth' : 'auto'
    });
  }

  // Trigger centering across initial render passes
  centerActiveTab(false);
  window.addEventListener('load', () => centerActiveTab(false));
  setTimeout(() => centerActiveTab(false), 80);
  setTimeout(() => centerActiveTab(false), 300);

  // Recenter on window resize
  window.addEventListener('resize', () => centerActiveTab(false));

  // Desktop Mouse Drag-to-Scroll Controls
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

  // Prevent drag action from opening links on mouse release
  navItems.forEach(item => {
    item.addEventListener('click', function (e) {
      if (isDragging) {
        e.preventDefault();
      }
    });
  });

  /* --------------------------------------------------
     2. Interactive High-DPI Node Canvas Background
  -------------------------------------------------- */
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, dpr;

  function resizeCanvas() {
    dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Pointer position tracking
  const pointer = { x: null, y: null, radius: 140 };

  function updatePointer(e) {
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    pointer.x = x;
    pointer.y = y;
  }

  window.addEventListener('mousemove', updatePointer);
  window.addEventListener('touchmove', updatePointer, { passive: true });
  window.addEventListener('mouseleave', () => { pointer.x = null; pointer.y = null; });
  window.addEventListener('touchend', () => { pointer.x = null; pointer.y = null; });

  // Particles setup
  const particles = [];
  const particleCount = Math.floor((width * height) / 16000);

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
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

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p, index) => {
      p.update();
      p.draw();

      // Inter-particle line connections
      for (let j = index + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);

        if (dist < 95) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(124, 58, 237, ${0.14 * (1 - dist / 95)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Cursor/Touch line connections
      if (pointer.x !== null && pointer.y !== null) {
        const pDist = Math.hypot(p.x - pointer.x, p.y - pointer.y);
        if (pDist < pointer.radius) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.strokeStyle = `rgba(124, 58, 237, ${0.35 * (1 - pDist / pointer.radius)})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(animate);
  }

  animate();
});
