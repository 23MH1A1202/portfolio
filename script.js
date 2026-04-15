// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

function closeNav() {
  navLinks.classList.remove('open');
  navbar.classList.remove('nav-open');
}

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNav();
  // Close mobile nav on scroll
  if (navLinks.classList.contains('open')) {
    closeNav();
  }
});

navToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navbar.classList.toggle('nav-open', navLinks.classList.contains('open'));
});

// Close nav on link click (mobile)
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', closeNav);
});

// ===== ACTIVE NAV =====
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 100;
  sections.forEach(sec => {
    const link = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
    if (!link) return;
    const top = sec.offsetTop;
    const bottom = top + sec.offsetHeight;
    link.classList.toggle('active', scrollPos >= top && scrollPos < bottom);
  });
}

// ===== TYPING EFFECT =====
const roles = [
  'Web Developer',
  'PWA Builder',
  'Firebase Enthusiast',
  'Flutter Developer',
  'Problem Solver',
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('typed-text');

function typeRole() {
  if (!typedEl) return;
  const current = roles[roleIndex];
  typedEl.textContent = isDeleting
    ? current.slice(0, charIndex)
    : current.slice(0, charIndex);

  if (isDeleting) {
    charIndex--;
  } else {
    charIndex++;
  }

  let delay = isDeleting ? 60 : 100;
  if (!isDeleting && charIndex > current.length) {
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex < 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    charIndex = 0;
    delay = 400;
  }
  setTimeout(typeRole, delay);
}

typeRole();

// ===== INTERSECTION OBSERVER (scroll animations) =====
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);

document.querySelectorAll('.animate-fade-up').forEach(el => observer.observe(el));

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  let count = 0;
  const step = Math.ceil(target / 40);
  const interval = setInterval(() => {
    count = Math.min(count + step, target);
    el.textContent = count + suffix;
    if (count >= target) clearInterval(interval);
  }, 40);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-target]').forEach(animateCounter);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const statsSection = document.querySelector('.about-stats');
if (statsSection) counterObserver.observe(statsSection);

// ===== CONTACT FORM =====
const form = document.getElementById('contactForm');
form?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = '✅ Message Sent!';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Send Message';
    btn.disabled = false;
    form.reset();
  }, 3000);
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});
