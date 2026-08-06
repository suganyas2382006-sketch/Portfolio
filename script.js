document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Interactive position state (mouse & touch)
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

  // Node / Particle setup
  const particles = [];
  const particleCount = Math.floor((width * height) / 15000); // Responsive density

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
      ctx.fillStyle = 'rgba(124, 58, 237, 0.6)'; // Lavender accent node
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p, index) => {
      p.update();
      p.draw();

      // Connect nodes to each other
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

      // Connect nodes to touch / cursor position
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
