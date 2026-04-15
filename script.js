// ===== PRELOADER =====
// Lock the scroll immediately when the script loads
document.body.classList.add('no-scroll');

window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  
  // Wait for the 2.2 seconds (matches the CSS animation duration) 
  // before sliding the preloader up and unlocking the scroll
  setTimeout(() => {
    preloader.classList.add('hidden');
    document.body.classList.remove('no-scroll');
  }, 2200); 
});

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
  // Adjust scrollPos to be more sensitive (150 instead of 100)
  const scrollPos = window.scrollY + 150; 
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
      } else {
        // REMOVES the class when out of view so it animates again!
        entry.target.classList.remove('visible');
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
form?.addEventListener('submit', async e => {
  e.preventDefault(); // Stop the default page redirect
  
  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.textContent; 
  
  // Show a loading state
  btn.textContent = 'Sending... ⏳';
  btn.disabled = true;

  try {
    // Send the data to your Formspree endpoint silently
    const response = await fetch(form.action, {
      method: form.method,
      body: new FormData(form),
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      // Success! Show your original animation
      btn.textContent = '✅ Message Sent!';
      form.reset();
    } else {
      // Formspree returned an error
      btn.textContent = '❌ Oops! Try Again.';
    }
  } catch (error) {
    // Network error
    btn.textContent = '❌ Network Error';
  }

  // Reset the button back to normal after 3 seconds
  setTimeout(() => {
    btn.textContent = 'Send Message 🚀';
    btn.disabled = false;
  }, 3000);
});

// ===== SMOOTH SCROLL =====
// Update the Smooth Scroll section in script.js
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      // Changed offset from 80 to 60 for tighter alignment
      const offset = 60; 
      window.scrollTo({ 
        top: target.offsetTop - offset, 
        behavior: 'smooth' 
      });
      
      // Ensure nav closes on mobile after clicking
      closeNav(); 
    }
  });
});


// ===== PROJECTS CAROUSEL AUTO-SCROLL & BUTTONS =====
const carousel = document.getElementById('projectsCarousel');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let isCarouselPaused = false;
let autoScrollTimer;

// Function to hide/show arrows based on scroll position
function updateCarouselButtons() {
  if (!carousel || !prevBtn || !nextBtn) return;
  
  // Max amount you can scroll to the right
  const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;

  // Hide Left button if at the very start
  if (carousel.scrollLeft <= 10) {
    prevBtn.classList.remove('show');
  } else {
    prevBtn.classList.add('show');
  }

  // Hide Right button if at the very end
  if (carousel.scrollLeft >= maxScrollLeft - 10) {
    nextBtn.classList.remove('show');
  } else {
    nextBtn.classList.add('show');
  }
}

if (carousel) {
  // Pause auto-scroll on hover/touch
  carousel.addEventListener('mouseenter', () => isCarouselPaused = true);
  carousel.addEventListener('mouseleave', () => isCarouselPaused = false);
  carousel.addEventListener('touchstart', () => isCarouselPaused = true);
  carousel.addEventListener('touchend', () => {
    setTimeout(() => isCarouselPaused = false, 2000);
  });

  // Check button visibility whenever the user or code scrolls
  carousel.addEventListener('scroll', updateCarouselButtons);
  // Initial check on load
  updateCarouselButtons();

  // Manual Button Clicks
  prevBtn?.addEventListener('click', () => {
    const cardWidth = carousel.querySelector('.project-card').offsetWidth + 24;
    carousel.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    resetAutoScroll(); // Restart timer so it doesn't jump immediately after click
  });

  nextBtn?.addEventListener('click', () => {
    const cardWidth = carousel.querySelector('.project-card').offsetWidth + 24;
    carousel.scrollBy({ left: cardWidth, behavior: 'smooth' });
    resetAutoScroll();
  });

  // Auto-scroll loop
  function startAutoScroll() {
    autoScrollTimer = setInterval(() => {
      if (!isCarouselPaused) {
        const card = carousel.querySelector('.project-card');
        if (!card) return;
        const scrollStep = card.offsetWidth + 24; 
        
        // If at the end, jump back to start, else scroll right
        if (carousel.scrollLeft + carousel.offsetWidth >= carousel.scrollWidth - 10) {
          carousel.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          carousel.scrollBy({ left: scrollStep, behavior: 'smooth' });
        }
      }
    }, 3500);
  }

  function resetAutoScroll() {
    clearInterval(autoScrollTimer);
    startAutoScroll();
  }

  // Start the loop
  startAutoScroll();
}// ===== FOCUS GLOW EFFECT =====
// Automatically highlights cards when they scroll into the viewport
const glowObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      // If the card is at least 50% visible on screen
      if (entry.isIntersecting) {
        entry.target.classList.add('glow-active');
      } else {
        // Remove glow when it scrolls away
        entry.target.classList.remove('glow-active');
      }
    });
  },
  {
    // Threshold 0.5 means 50% of the element must be visible to trigger
    threshold: 0.5,
    // RootMargin slightly shrinks the trigger box so it happens closer to the center
    rootMargin: "-10% 0px -10% 0px" 
  }
);

// Apply this observer to all skill cards and project cards
document.querySelectorAll('.skill-card, .project-card').forEach(card => {
  glowObserver.observe(card);
});



// ===== 3D TILT EFFECT FOR DESKTOP =====
// Select the cards you want to tilt
const tiltCards = document.querySelectorAll('.skill-card, .about-card');

tiltCards.forEach(card => {
  card.addEventListener('mousemove', e => {
    // Only run on desktop/devices with a mouse
    if (window.innerWidth <= 900) return; 

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // X position within the card
    const y = e.clientY - rect.top;  // Y position within the card
    
    // Calculate rotation limits (max 8 degrees)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px) scale(1.02)`;
    card.style.transition = 'transform 0.1s ease-out'; // Fast response while moving
  });

  card.addEventListener('mouseleave', () => {
    // Snap back to original position smoothly
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)`;
    card.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'; 
  });
});
