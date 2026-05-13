/* =============================================
   SAJKRIITI — MAIN JS
   ============================================= */

// ---- NAVBAR SCROLL ----
(function () {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });
})();

// ---- MOBILE MENU ----
function closeMobile() {
  const menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.remove('open');
}

(function () {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', function () {
    mobileMenu.classList.toggle('open');
  });

  // Close when clicking outside
  document.addEventListener('click', function (e) {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
    }
  });
})();

// ---- CUSTOM ORDER FORM — WHATSAPP ----
function handleCustomOrder() {
  const name     = (document.getElementById('fname')     || {}).value || '';
  const phone    = (document.getElementById('fphone')    || {}).value || '';
  const occasion = (document.getElementById('foccasion') || {}).value || '';
  const desc     = (document.getElementById('fdesc')     || {}).value || '';
  const note     = document.getElementById('formNote');

  if (!name.trim() || !phone.trim() || !occasion.trim() || !desc.trim()) {
    if (note) { note.textContent = 'Please fill in all fields.'; note.className = 'form-note error'; }
    return;
  }

  const msg = encodeURIComponent(
    `Hello Sajkriiti! 🌸\n\n` +
    `*Name:* ${name}\n` +
    `*WhatsApp:* ${phone}\n` +
    `*Occasion:* ${occasion}\n\n` +
    `*Requirement:*\n${desc}\n\n` +
    `Looking forward to your beautiful creation! 💐`
  );

  window.open(`https://wa.me/919876543210?text=${msg}`, '_blank');

  if (note) { note.textContent = 'Opening WhatsApp… 🎉'; note.className = 'form-note success'; }
  setTimeout(() => { if (note) note.textContent = ''; }, 5000);
}

// ---- TOAST ----
function showToast(msg, duration) {
  duration = duration || 3000;
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// ---- SCROLL REVEAL ----
(function () {
  function addRevealClasses() {
    const targets = [
      '.why-card',
      '.step',
      '.testi-card',
      '.cat-item',
      '.product-card',
      '.crafted-list li',
      '.section-header',
    ];
    targets.forEach(sel => {
      document.querySelectorAll(sel).forEach((el, i) => {
        el.classList.add('reveal');
        if (i > 0 && i <= 4) el.classList.add('reveal-delay-' + i);
      });
    });
  }

  function onScroll() {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 60) {
        el.classList.add('visible');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    addRevealClasses();
    onScroll(); // reveal above-fold items immediately
    window.addEventListener('scroll', onScroll, { passive: true });
  });
})();

// ---- HERO FLOWER SVG (injected) ----
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const flower = document.createElement('div');
    flower.className = 'hero-flower-svg';
    flower.innerHTML = `
      <svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg">
        <!-- Stem -->
        <line x1="60" y1="90" x2="60" y2="138" stroke="#5a7a4a" stroke-width="3.5" stroke-linecap="round"/>
        <!-- Leaf -->
        <path d="M60 115 Q44 105 40 90 Q56 96 60 115Z" fill="#6a8c5a" opacity="0.85"/>
        <!-- Petals -->
        <ellipse cx="60" cy="52" rx="13" ry="30" fill="#f5aec0" opacity="0.9"/>
        <ellipse cx="60" cy="52" rx="13" ry="30" fill="#f5aec0" opacity="0.9" transform="rotate(45 60 75)"/>
        <ellipse cx="60" cy="52" rx="13" ry="30" fill="#e896af" opacity="0.85" transform="rotate(90 60 75)"/>
        <ellipse cx="60" cy="52" rx="13" ry="30" fill="#f5aec0" opacity="0.9" transform="rotate(135 60 75)"/>
        <ellipse cx="60" cy="52" rx="13" ry="30" fill="#e896af" opacity="0.85" transform="rotate(180 60 75)"/>
        <ellipse cx="60" cy="52" rx="13" ry="30" fill="#f5aec0" opacity="0.9" transform="rotate(225 60 75)"/>
        <ellipse cx="60" cy="52" rx="13" ry="30" fill="#e896af" opacity="0.85" transform="rotate(270 60 75)"/>
        <ellipse cx="60" cy="52" rx="13" ry="30" fill="#f5aec0" opacity="0.9" transform="rotate(315 60 75)"/>
        <!-- Centre -->
        <circle cx="60" cy="75" r="14" fill="#c0576e"/>
        <circle cx="60" cy="75" r="7" fill="white" opacity="0.9"/>
        <circle cx="60" cy="75" r="3" fill="#c0576e"/>
      </svg>
    `;
    hero.appendChild(flower);
  });
})();

// ---- ACTIVE NAV LINK ON SCROLL ----
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.nav-links a');

    function setActive() {
      let current = '';
      sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
      });
      links.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === '#' + current) {
          a.style.color = 'var(--rose)';
        }
      });
    }

    window.addEventListener('scroll', setActive, { passive: true });
    setActive();
  });
})();

// ---- SMOOTH SCROLL for anchor links ----
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
});