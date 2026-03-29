/* ═══════════════════════════════════════════════════════════
   SHIELD TECH — Stealth Coating for Defence Assets
   script.js
═══════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════
   1. CUSTOM CURSOR
═══════════════════════════════════════════ */
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px'; dot.style.top = my + 'px';
});
(function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animRing);
})();
document.querySelectorAll('a,button,.mat-card,.innov-card,.feasibility-card,.layer,.phase-card').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
});

/* ═══════════════════════════════════════════
   2. PARTICLE CANVAS
═══════════════════════════════════════════ */
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];
function resizeCanvas() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 1.5 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.alpha = Math.random() * 0.4 + 0.05;
    this.life = Math.random() * 300 + 100;
    this.age = 0;
  }
  update() {
    this.x += this.vx; this.y += this.vy; this.age++;
    if (this.age > this.life || this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(0,212,255,${this.alpha * (1 - this.age/this.life)})`;
    ctx.fill();
  }
}
for (let i = 0; i < 80; i++) particles.push(new Particle());

// Mouse-repel
let pmx = W/2, pmy = H/2;
document.addEventListener('mousemove', e => { pmx = e.clientX; pmy = e.clientY; });

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i+1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,212,255,${0.06 * (1 - dist/100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animParticles);
}
animParticles();

/* ═══════════════════════════════════════════
   3. TYPING EFFECT (hero sub)
═══════════════════════════════════════════ */
const heroSub = document.getElementById('hero-sub');
const heroText = 'Next-generation radar absorbing material system achieving 99.95% microwave absorptivity with dual-layer Epoxy–Polyaspartic architecture at 2mm thickness.';
let ti = 0;
function typeHero() {
  if (ti <= heroText.length) {
    heroSub.textContent = heroText.slice(0, ti);
    ti++;
    setTimeout(typeHero, 18);
  } else {
    heroSub.classList.remove('typing-cursor');
  }
}
setTimeout(typeHero, 800);

/* ═══════════════════════════════════════════
   4. SCROLL PROGRESS + HUD
═══════════════════════════════════════════ */
const progressBar = document.getElementById('scroll-progress');
const hudScroll = document.getElementById('hud-scroll');
const hudBar = document.getElementById('hud-bar');
const hudSection = document.getElementById('hud-section');
const scrollTopBtn = document.getElementById('scroll-top');
const hudSignalBars = document.querySelectorAll('#hud-signal span');

const sectionNames = {
  'overview': 'OVERVIEW', 'howitworks': 'MECHANISM',
  'performance': 'ANALYSIS', 'materials': 'MATERIALS',
  'lifecycle': 'LIFECYCLE', 'cost': 'COST',
  'feasibility': 'FEASIBILITY', 'roadmap': 'ROADMAP',
  'innovation': 'INNOVATION'
};

function onScroll() {
  const scrolled = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const pct = Math.round((scrolled / maxScroll) * 100);
  progressBar.style.width = pct + '%';
  hudScroll.textContent = pct + '%';
  hudBar.style.width = pct + '%';

  // Signal bars
  const bars = Math.ceil(pct / 20);
  hudSignalBars.forEach((b, i) => b.classList.toggle('active', i < bars));

  // Scroll to top visibility
  scrollTopBtn.classList.toggle('visible', scrolled > 400);

  // Active section
  const sections = document.querySelectorAll('section[id]');
  let current = 'overview';
  sections.forEach(sec => {
    if (scrolled >= sec.offsetTop - 200) current = sec.id;
  });
  hudSection.textContent = sectionNames[current] || current.toUpperCase();

  // Active nav link
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}
window.addEventListener('scroll', onScroll);

/* ═══════════════════════════════════════════
   5. COUNTER ANIMATION
═══════════════════════════════════════════ */
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const prefix = target < 0 ? '−' : '';
  const abs = Math.abs(target);
  const duration = 1400;
  const start = performance.now();
  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    const val = abs * ease;
    el.textContent = prefix + val.toFixed(val >= 10 ? 1 : 2) + suffix;
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ═══════════════════════════════════════════
   6. INTERSECTION OBSERVER (reveal + counter)
═══════════════════════════════════════════ */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      // fire counters inside
      e.target.querySelectorAll('.count-up').forEach(c => animateCounter(c));
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObs.observe(el));

// Counter on hero stats (always visible)
setTimeout(() => {
  document.querySelectorAll('.hero-stats .count-up').forEach(animateCounter);
}, 1200);

/* ═══════════════════════════════════════════
   7. TILT EFFECT on cards
═══════════════════════════════════════════ */
document.querySelectorAll('.mat-card,.innov-card,.feasibility-card,.chart-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(4px)`;
    card.style.setProperty('--mx', (e.clientX - r.left) / r.width * 100 + '%');
    card.style.setProperty('--my', (e.clientY - r.top) / r.height * 100 + '%');
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ═══════════════════════════════════════════
   8. SECTION NUMBERS (injected)
═══════════════════════════════════════════ */
const numMap = { howitworks:'01', performance:'02', materials:'03', lifecycle:'04', cost:'05', feasibility:'06', roadmap:'07', innovation:'08' };
Object.entries(numMap).forEach(([id, num]) => {
  const sec = document.getElementById(id);
  if (sec) {
    sec.style.position = 'relative';
    const n = document.createElement('div');
    n.className = 'section-num';
    n.textContent = num;
    sec.appendChild(n);
  }
});

/* ═══════════════════════════════════════════
   9. HUD STATUS BLINK
═══════════════════════════════════════════ */
const hudStatus = document.getElementById('hud-status');
setInterval(() => {
  hudStatus.style.opacity = hudStatus.style.opacity === '0.3' ? '1' : '0.3';
}, 1200);

/* ═══════════════════════════════════════════
   10. CHARTS
═══════════════════════════════════════════ */
Chart.defaults.color = '#5a7a9a';
Chart.defaults.borderColor = 'rgba(0,212,255,0.08)';
Chart.defaults.font.family = "'DM Mono', monospace";
Chart.defaults.font.size = 10;

const freqs = [2,4,6,8,10,12,14,16,18];

new Chart(document.getElementById('rlChart'), {
  type: 'line',
  data: {
    labels: freqs.map(f => f+'GHz'),
    datasets: [{
      label: 'RL (dB)',
      data: [-8,-14,-20,-28,-33.7,-31,-25,-18,-12],
      borderColor: '#00d4ff', backgroundColor: 'rgba(0,212,255,0.08)',
      borderWidth: 2, fill: true, tension: 0.4, pointRadius: 3,
      pointBackgroundColor: '#00d4ff'
    }]
  },
  options: {
    animation: { duration: 1200, easing: 'easeOutQuart' },
    plugins: { legend: { display: false } },
    scales: {
      y: { title: { display: true, text: 'dB' }, grid: { color: 'rgba(0,212,255,0.06)' } },
      x: { grid: { color: 'rgba(0,212,255,0.06)' } }
    }
  }
});

new Chart(document.getElementById('absChart'), {
  type: 'line',
  data: {
    labels: freqs.map(f => f+'GHz'),
    datasets: [{
      label: 'Absorptivity (%)',
      data: [84,90,95,99.2,99.95,99.9,99.5,98,96],
      borderColor: '#0d5eff', backgroundColor: 'rgba(13,94,255,0.08)',
      borderWidth: 2, fill: true, tension: 0.4, pointRadius: 3,
      pointBackgroundColor: '#0d5eff'
    }]
  },
  options: {
    animation: { duration: 1400, easing: 'easeOutQuart' },
    plugins: { legend: { display: false } },
    scales: {
      y: { min: 80, max: 100, title: { display: true, text: '%' }, grid: { color: 'rgba(0,212,255,0.06)' } },
      x: { grid: { color: 'rgba(0,212,255,0.06)' } }
    }
  }
});

new Chart(document.getElementById('irChart'), {
  type: 'bar',
  data: {
    labels: ['2µm','4µm','6µm','8µm','10µm','12µm'],
    datasets: [{
      label: 'Thermal Absorptivity (%)',
      data: [78,84,88,91,89.6,85],
      backgroundColor: 'rgba(245,158,11,0.5)',
      borderColor: '#f59e0b', borderWidth: 1
    }]
  },
  options: {
    animation: { duration: 1000, easing: 'easeOutBounce' },
    plugins: { legend: { display: false } },
    scales: {
      y: { min: 70, max: 100, title: { display: true, text: '%' }, grid: { color: 'rgba(0,212,255,0.06)' } },
      x: { grid: { color: 'rgba(0,212,255,0.06)' } }
    }
  }
});

new Chart(document.getElementById('rcsChart'), {
  type: 'bar',
  data: {
    labels: ['Fighter Jet', 'UAV', 'Ship Hull', 'Tank', 'Helicopter'],
    datasets: [
      { label: 'Without Coating (m²)', data: [4.0,0.8,1200,8.0,2.5], backgroundColor: 'rgba(239,68,68,0.4)', borderColor: '#ef4444', borderWidth: 1 },
      { label: 'With Coating (m²)', data: [0.08,0.02,24,0.18,0.05], backgroundColor: 'rgba(0,212,255,0.4)', borderColor: '#00d4ff', borderWidth: 1 }
    ]
  },
  options: {
    animation: { duration: 1200 },
    plugins: { legend: { labels: { color: '#5a7a9a', font: { size: 10 } } } },
    scales: {
      y: { type: 'logarithmic', title: { display: true, text: 'RCS m² (log)' }, grid: { color: 'rgba(0,212,255,0.06)' } },
      x: { grid: { color: 'rgba(0,212,255,0.06)' } }
    }
  }
});

new Chart(document.getElementById('radarChart'), {
  type: 'radar',
  data: {
    labels: ['Microwave\nAbsorption','IR Suppression','Durability','Adhesion','Cost\nEfficiency','Thickness\nOptimality'],
    datasets: [
      { label: 'SHIELD TECH', data: [99,90,85,90,88,95], borderColor: '#00d4ff', backgroundColor: 'rgba(0,212,255,0.15)', borderWidth: 2, pointBackgroundColor: '#00d4ff' },
      { label: 'Conventional RAM', data: [80,60,75,70,65,55], borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 2, pointBackgroundColor: '#ef4444' }
    ]
  },
  options: {
    animation: { duration: 1600 },
    plugins: { legend: { labels: { color: '#5a7a9a', font: { size: 10 } } } },
    scales: {
      r: {
        min: 0, max: 100,
        grid: { color: 'rgba(0,212,255,0.1)' },
        angleLines: { color: 'rgba(0,212,255,0.1)' },
        pointLabels: { color: '#5a7a9a', font: { size: 10 } },
        ticks: { display: false }
      }
    }
  }
});

new Chart(document.getElementById('degradeChart'), {
  type: 'line',
  data: {
    labels: ['Year 0','Year 1','Year 2','Year 3','Year 4\n(Maint)','Year 5','Year 6\n(Recoat)'],
    datasets: [
      {
        label: 'RL (dB)', data: [-30,-27,-24,-21,-18,-15,-12],
        borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.08)',
        borderWidth: 2, fill: true, tension: 0.3, pointRadius: 5,
        pointBackgroundColor: ['#10b981','#10b981','#00d4ff','#f59e0b','#f59e0b','#ef4444','#ef4444']
      },
      { label: 'Threshold (−20 dB)', data: [-20,-20,-20,-20,-20,-20,-20], borderColor: 'rgba(239,68,68,0.5)', borderDash: [6,3], borderWidth: 1, pointRadius: 0 }
    ]
  },
  options: {
    animation: { duration: 1400 },
    plugins: { legend: { labels: { color: '#5a7a9a', font: { size: 10 } } } },
    scales: {
      y: { title: { display: true, text: 'dB' }, grid: { color: 'rgba(0,212,255,0.06)' } },
      x: { grid: { color: 'rgba(0,212,255,0.06)' } }
    }
  }
});

new Chart(document.getElementById('costCompChart'), {
  type: 'bar',
  data: {
    labels: ['Salisbury Screen','Ferrite Tiles','Carbon RAM','SHIELD TECH'],
    datasets: [{
      label: '₹/m²', data: [55000,62000,48000,42400],
      backgroundColor: ['rgba(239,68,68,0.4)','rgba(239,68,68,0.4)','rgba(245,158,11,0.4)','rgba(0,212,255,0.5)'],
      borderColor: ['#ef4444','#ef4444','#f59e0b','#00d4ff'], borderWidth: 1
    }]
  },
  options: {
    animation: { duration: 1200, easing: 'easeOutQuart' },
    plugins: { legend: { display: false } },
    scales: {
      y: { title: { display: true, text: '₹/m²' }, grid: { color: 'rgba(0,212,255,0.06)' } },
      x: { grid: { color: 'rgba(0,212,255,0.06)' } }
    }
  }
});

/* ═══════════════════════════════════════════
   11. KEYBOARD SHORTCUT: G = scroll to top
═══════════════════════════════════════════ */
document.addEventListener('keydown', e => {
  if (e.key === 'g' && !e.ctrlKey) window.scrollTo({ top: 0, behavior: 'smooth' });
  if (e.key === 'e') window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
});

/* ═══════════════════════════════════════════
   12. CLICK RIPPLE
═══════════════════════════════════════════ */
document.addEventListener('click', e => {
  const ripple = document.createElement('div');
  ripple.style.cssText = `
    position:fixed;left:${e.clientX}px;top:${e.clientY}px;
    width:4px;height:4px;border-radius:50%;
    border:1px solid rgba(0,212,255,0.8);
    transform:translate(-50%,-50%) scale(1);
    pointer-events:none;z-index:9000;
    animation:rippleOut 0.6s ease forwards;
  `;
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
});
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `@keyframes rippleOut { to { transform:translate(-50%,-50%) scale(30); opacity:0; } }`;
document.head.appendChild(rippleStyle);
