/* =============================================
   SAJKRIITI — FALLING PETALS CANVAS (Enhanced)
   ============================================= */

(function () {
  const canvas = document.getElementById('petalCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = window.innerWidth;
  let H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;

  // Reduce petal count on mobile for performance
  const isMobile = W < 768;
  const NUM_PETALS = isMobile ? 45 : 80;

  window.addEventListener('resize', () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
  });

  // Petal colors matching the brand palette — richer variety
  const COLORS = [
    'rgba(245,198,208,0.80)',
    'rgba(192,87,110,0.50)',
    'rgba(255,220,230,0.70)',
    'rgba(240,180,195,0.65)',
    'rgba(253,235,240,0.85)',
    'rgba(220,140,160,0.55)',
    'rgba(255,182,193,0.70)',
    'rgba(255,105,135,0.35)',
    'rgba(250,210,220,0.75)',
    'rgba(200,100,120,0.45)',
    'rgba(255,240,245,0.80)',
    'rgba(230,160,175,0.60)',
  ];

  const petals = [];

  function randomBetween(a, b) {
    return a + Math.random() * (b - a);
  }

  function createPetal(startY) {
    const size = randomBetween(5, 16);
    const type = Math.floor(Math.random() * 3); // 0=ellipse, 1=heart-ish, 2=teardrop
    return {
      x: randomBetween(0, W),
      y: startY !== undefined ? startY : randomBetween(-200, H),
      size,
      type,
      speedY: randomBetween(0.5, 2.0),
      speedX: randomBetween(-0.6, 0.6),
      angle: randomBetween(0, Math.PI * 2),
      angleSpeed: randomBetween(-0.025, 0.025),
      sway: randomBetween(0.4, 1.5),
      swayOffset: randomBetween(0, Math.PI * 2),
      swaySpeed: randomBetween(0.008, 0.03),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      opacity: randomBetween(0.35, 0.90),
      tick: Math.random() * 200, // stagger phase
    };
  }

  // Initialise petals spread across the viewport
  for (let i = 0; i < NUM_PETALS; i++) {
    petals.push(createPetal());
  }

  function drawEllipsePetal(p) {
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size * 0.42, p.size, 0, 0, Math.PI * 2);
    ctx.fill();
    // highlight
    ctx.globalAlpha = p.opacity * 0.28;
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.beginPath();
    ctx.ellipse(-p.size * 0.12, -p.size * 0.28, p.size * 0.14, p.size * 0.32, -0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawTearPetal(p) {
    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.bezierCurveTo(p.size * 0.55, -p.size * 0.4, p.size * 0.55, p.size * 0.5, 0, p.size * 0.5);
    ctx.bezierCurveTo(-p.size * 0.55, p.size * 0.5, -p.size * 0.55, -p.size * 0.4, 0, -p.size);
    ctx.fill();
  }

  function drawRoundPetal(p) {
    ctx.beginPath();
    ctx.arc(0, 0, p.size * 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = p.opacity * 0.25;
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath();
    ctx.arc(-p.size * 0.15, -p.size * 0.15, p.size * 0.22, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;

    if (p.type === 0) drawEllipsePetal(p);
    else if (p.type === 1) drawTearPetal(p);
    else drawRoundPetal(p);

    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);

    petals.forEach((p, i) => {
      p.tick++;
      p.y += p.speedY;
      p.x += p.speedX + Math.sin(p.swayOffset + p.tick * p.swaySpeed) * p.sway * 0.45;
      p.angle += p.angleSpeed;
      drawPetal(p);

      // Recycle petal when it falls off screen
      if (p.y > H + 30 || p.x < -50 || p.x > W + 50) {
        petals[i] = createPetal(-randomBetween(10, 60));
      }
    });

    requestAnimationFrame(animate);
  }

  animate();
})();
