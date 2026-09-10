// ===== PRELOADER =====
// Lock the scroll immediately when the script loads
document.body.classList.add('no-scroll');

window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  const preloaderText = document.querySelector('.preloader-text');
  
  // Sequence: Hello -> Namaskaram -> Namaste -> Vanakkam -> Konnichiwa -> Ni Hao -> Welcome -> By, -> Sagar
  const words = ['Hello', 'నమస్కారం', 'नमस्ते', 'வணக்கம்', 'こんにちは', '你好', 'Welcome',  "I'm Sagar"];
  let currentWordIndex = 0;
  let isDeleting = true; // Start by deleting 'Hello'
  let txt = 'Hello'; // Initial text
  let typingSpeed = 100;
  
  // Let the initial CSS animations finish (slideUpFade), then start deleting
  setTimeout(() => {
    typeLoop();
  }, 500);

  function typeLoop() {
    const currentWord = words[currentWordIndex];
    
    if (isDeleting) {
      txt = currentWord.substring(0, txt.length - 1);
      typingSpeed = 20; // super fast delete
    } else {
      txt = currentWord.substring(0, txt.length + 1);
      typingSpeed = 40; // faster type speed
    }
    
    preloaderText.textContent = txt;
    
    // Finished deleting
    if (isDeleting && txt === '') {
      isDeleting = false;
      currentWordIndex++;
      typingSpeed = 100; // shorter pause before typing next
    } 
    // Finished typing current word
    else if (!isDeleting && txt === currentWord) {
      // If we typed the final word ("Sagar")
      if (currentWordIndex === words.length - 1) {
        setTimeout(() => {
          preloader.classList.add('hidden');
          document.body.classList.remove('no-scroll');
        }, 400); // Hold on final word for a bit before hiding
        return; 
      } else {
        isDeleting = true;
        typingSpeed = 250; // Shorter pause at end of word before deleting again
      }
    }
    
    setTimeout(typeLoop, typingSpeed);
  }
});


// ===== LIGHT/DARK MODE TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

// 1. Check if user already chose a theme in a previous visit
const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme === 'light') {
  document.body.classList.add('light-mode');
  setMoonIcon(); // Show moon when in light mode
}

// 2. Toggle Theme on Click
themeToggle?.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  
  if (document.body.classList.contains('light-mode')) {
    localStorage.setItem('portfolio-theme', 'light');
    setMoonIcon();
  } else {
    localStorage.setItem('portfolio-theme', 'dark');
    setSunIcon();
  }
});

// Helper functions to swap the SVG icons
function setMoonIcon() {
  themeIcon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
}

function setSunIcon() {
  themeIcon.innerHTML = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
}
// ===== NAVBAR & SCROLL BEHAVIOR =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const scrollTopBtn = document.getElementById('scrollTopBtn');

function closeNav() {
  navLinks?.classList.remove('open');
  navbar?.classList.remove('nav-open');
  navToggle?.classList.remove('active'); // Turns the X back to a Hamburger
}

navToggle?.addEventListener('click', () => {
  navLinks?.classList.toggle('open');
  navbar?.classList.toggle('nav-open', navLinks?.classList.contains('open'));
  navToggle?.classList.toggle('active'); // Turns Hamburger into an X
});

// Close nav on link click (mobile)
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', closeNav);
});

// Close mobile nav when clicking outside of it
document.addEventListener('click', (e) => {
  if (navLinks?.classList.contains('open') && !navLinks.contains(e.target) && !navToggle?.contains(e.target)) {
    closeNav();
  }
});

// Cache section elements and navigation links for high-performance scroll updates
let navItems = [];
function cacheNavSections() {
  navItems = Array.from(document.querySelectorAll('section[id]')).map(sec => ({
    id: sec.id,
    sec,
    link: document.querySelector(`.nav-links a[href="#${sec.id}"]`)
  })).filter(item => item.link);
}
cacheNavSections();

// ===== ACTIVE NAV & SMOOTH SCROLL STATE =====
function updateActiveNav(scrollY) {
  // If at or close to the top, anchor active link on Home (#hero)
  if (scrollY < 80) {
    navItems.forEach(item => {
      const isHero = item.id === 'hero';
      if (item.link.classList.contains('active') !== isHero) {
        item.link.classList.toggle('active', isHero);
      }
    });
    return;
  }

  const scrollPos = scrollY + 140;
  navItems.forEach(item => {
    const top = item.sec.offsetTop;
    const bottom = top + item.sec.offsetHeight;
    const shouldBeActive = scrollPos >= top && scrollPos < bottom;
    if (item.link.classList.contains('active') !== shouldBeActive) {
      item.link.classList.toggle('active', shouldBeActive);
    }
  });
}

// Throttled high-performance scroll handler using requestAnimationFrame
let isScrolling = false;
function handleScroll() {
  const scrollY = window.scrollY;
  // Threshold of 25px gives a crisp, seamless trigger right as user leaves top
  const isScrolled = scrollY > 25;

  if (navbar && navbar.classList.contains('scrolled') !== isScrolled) {
    navbar.classList.toggle('scrolled', isScrolled);
  }

  updateActiveNav(scrollY);

  if (scrollTopBtn) {
    const showBtn = scrollY > 400;
    if (scrollTopBtn.classList.contains('show') !== showBtn) {
      scrollTopBtn.classList.toggle('show', showBtn);
    }
  }

  // Close mobile nav on scroll if open
  if (navLinks && navLinks.classList.contains('open')) {
    closeNav();
  }

  isScrolling = false;
}

window.addEventListener('scroll', () => {
  if (!isScrolling) {
    isScrolling = true;
    window.requestAnimationFrame(handleScroll);
  }
}, { passive: true });

// Initial run to sync state on load
handleScroll();

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

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    card.style.transition = 'transform 0.1s ease-out'; // Fast response while moving
  });

  card.addEventListener('mouseleave', () => {
    // Snap back to original position smoothly
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
    card.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'; 
  });
});


// ===== SCROLL TO TOP BUTTON ACTION =====
// Smoothly scrolls to top on click (visibility handled in unified handleScroll)
scrollTopBtn?.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// ===== DYNAMIC DATA FETCHING =====
async function loadDynamicData() {
  try {
    const configRes = await fetch('/firebase-applet-config.json');
    if (!configRes.ok) return;
    const firebaseConfig = await configRes.json();
    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
    
    const docRef = doc(db, 'portfolio', 'data');
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return;
    const data = docSnap.data();
    
    // Render Skills
    if (data.skills && data.skills.length > 0) {
      const skillsGrid = document.querySelector('.skills-grid');
      if (skillsGrid) {
        skillsGrid.innerHTML = ''; // Clear existing
        data.skills.forEach(skill => {
          const card = document.createElement('div');
          card.className = 'skill-card animate-fade-up';
          card.tabIndex = 0;
          
          let tagsHtml = '';
          if (skill.tags) {
            skill.tags.forEach(tag => {
              tagsHtml += `<span class="tag"><i class='bx ${tag.icon}'></i> ${tag.name}</span>`;
            });
          }
          
          card.innerHTML = `
            <div class="skill-watermark" aria-hidden="true">
              <i class='bx ${skill.icon || 'bx-code-block'}'></i>
            </div>
            <div class="skill-icon"><i class='bx ${skill.icon}'></i></div>
            <div class="skill-name">${skill.name}</div>
            <div class="skill-desc">${skill.description}</div>
            <div class="skill-tags">
              ${tagsHtml}
            </div>
          `;
          skillsGrid.appendChild(card);
          if (typeof observer !== 'undefined') observer.observe(card);
          if (typeof glowObserver !== 'undefined') glowObserver.observe(card);
          
          // Re-attach tilt effect for new skill cards
          if (window.innerWidth > 900) {
            card.addEventListener('mousemove', e => {
              const rect = card.getBoundingClientRect();
              const x = e.clientX - rect.left; 
              const y = e.clientY - rect.top;  
              const centerX = rect.width / 2;
              const centerY = rect.height / 2;
              const rotateX = ((y - centerY) / centerY) * -8;
              const rotateY = ((x - centerX) / centerX) * 8;
              card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
              card.style.transition = 'transform 0.1s ease-out';
            });
            card.addEventListener('mouseleave', () => {
              card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
              card.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'; 
            });
          }
        });
      }
    }

    // Render Contact Details
    if (data.contact) {
      const emailLink = document.getElementById('emailLink');
      const emailText = document.getElementById('emailText');
      if (emailLink && data.contact.email) {
        emailLink.href = `mailto:${data.contact.email}`;
        if (emailText) emailText.textContent = data.contact.email;
      }
      
      const linkedinLink = document.getElementById('linkedinLink');
      if (linkedinLink && data.contact.linkedin) {
        linkedinLink.href = data.contact.linkedin;
      }

      // Github link in contact section
      const githubLink = document.querySelector('.contact-links a[href*="github.com"]');
      if (githubLink && data.contact.github) {
        githubLink.href = data.contact.github;
        const textDiv = githubLink.querySelector('div > div:nth-child(2)');
        if (textDiv && data.contact.githubText) {
          textDiv.textContent = data.contact.githubText;
        }
      }
    }

    // Render Resume Link if configured
    if (data.resume && data.resume.url) {
      const resumeBtns = document.querySelectorAll('#cardResumeBtn, #aboutResumeBtn');
      resumeBtns.forEach(btn => {
        btn.href = data.resume.url;
        if (data.resume.name) {
          btn.download = data.resume.name;
        }
      });
      if (data.resume.buttonText) {
        const aboutBtn = document.getElementById('aboutResumeBtn');
        if (aboutBtn) {
          aboutBtn.innerHTML = `<i class='bx bxs-file-pdf'></i> ${data.resume.buttonText}`;
        }
      }
    }

    // Render Projects
    if (data.projects && data.projects.length > 0) {
      const projectStat = document.querySelector('.about-stats .stat-item:first-child .stat-number');
      if (projectStat && data.projects.length > 6) {
        projectStat.dataset.target = data.projects.length;
        projectStat.textContent = data.projects.length + '+';
      }

      const carousel = document.getElementById('projectsCarousel');
      if (!carousel) return;
      
      carousel.innerHTML = ''; // Clear existing static projects
      
      data.projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        
        let headerLinks = '';
        if (project.link && project.linkText) {
          headerLinks = `<a href="${project.link}" target="_blank" rel="noopener noreferrer" class="icon-link" title="${project.linkText}"><i class='bx ${project.linkIcon || 'bx-link-external'}'></i> <span>${project.linkText}</span></a>`;
        } else if (project.status) {
          headerLinks = `<span style="font-size:0.72rem; color:#f59e0b; background:rgba(255,165,0,0.15); padding:2px 7px; border-radius:999px; font-weight:600;"><i class='bx bx-moon'></i> ${project.status}</span>`;
        }
        
        let tagsHtml = '';
        if (project.tags) {
          project.tags.forEach(tag => {
            tagsHtml += `<span class="tag"><i class='bx ${tag.icon}'></i> ${tag.name}</span>`;
          });
        }
        
        let featuredHtml = project.featured 
          ? `<span style="font-size:0.7rem; color:var(--accent); border:1px solid var(--accent); padding:2px 6px; border-radius:4px; margin-left:5px; vertical-align:middle;"><i class='bx bxs-star'></i> Featured</span>` 
          : '';

        card.innerHTML = `
          <div class="project-image" style="background-image: url('${project.image}');">
            <img src="${project.image}" alt="${project.title} Preview">
          </div>
          <div class="project-card-header">
            <div class="project-card-icon"><i class='bx ${project.icon}'></i></div>
            <div class="project-card-links">
              ${headerLinks}
            </div>
          </div>
          <h3 class="project-card-title">${project.title} ${featuredHtml}</h3>
          <p class="project-card-desc">${project.description}</p>
          <div class="project-card-tags">
            ${tagsHtml}
          </div>
        `;
        
        carousel.appendChild(card);
        if (typeof glowObserver !== 'undefined') {
          glowObserver.observe(card);
        }
      });
      
      // Update carousel buttons since content changed
      if (typeof updateCarouselButtons === 'function') {
        updateCarouselButtons();
      }
      // Re-cache section boundaries after dynamic content renders
      cacheNavSections();
    }
  } catch (err) {
    console.error('Failed to load dynamic data:', err);
  }
}

// Call on load
loadDynamicData();

// ===== HERO DEV SPHERE INTERACTIVE CYCLER =====
(function initDevSphere() {
  const sphereCmd = document.getElementById('sphereTermCmd');
  const sphereEl = document.getElementById('devSphere');
  if (!sphereCmd) return;

  const commands = [
    'build.future()',
    'code.innovate()',
    'create.apps()',
    'ship.ideas()',
    'while(true).learn()',
    'pwa.deploy()'
  ];
  let cmdIndex = 0;

  function cycleNextCommand() {
    cmdIndex = (cmdIndex + 1) % commands.length;
    sphereCmd.style.opacity = '0';
    sphereCmd.style.transform = 'translateY(4px)';
    sphereCmd.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    
    setTimeout(() => {
      sphereCmd.textContent = commands[cmdIndex];
      sphereCmd.style.opacity = '1';
      sphereCmd.style.transform = 'translateY(0)';
    }, 200);
  }

  // Auto cycle every 3.5s
  let cycleInterval = setInterval(cycleNextCommand, 3500);

  // Click to trigger next command immediately
  sphereEl?.addEventListener('click', () => {
    clearInterval(cycleInterval);
    cycleNextCommand();
    cycleInterval = setInterval(cycleNextCommand, 3500);
  });
})();

// ===== SCROLL PROGRESS BAR =====
window.addEventListener('scroll', () => {
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  if (scrollProgressBar) {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    scrollProgressBar.style.width = progress + '%';
  }
});

// ===== CUSTOM CURSOR =====
const customCursor = document.getElementById('customCursor');

if (customCursor) {
  // Use a slight translate adjustment so it perfectly centers on the real mouse
  document.addEventListener('mousemove', (e) => {
    customCursor.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
  });

  // Re-run interactive elements query periodically if content is dynamic, 
  // but for portfolio, running once on DOMContentLoaded is usually fine.
  // We'll wrap in an event listener just to be safe.
  document.addEventListener('DOMContentLoaded', () => {
    const interactiveElements = document.querySelectorAll('a, button, input[type="submit"], input[type="text"], input[type="email"], textarea, .skill-card, .project-card, .contact-link-item, .nav-logo');
    
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        customCursor.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        customCursor.classList.remove('hover');
      });
    });
  });
}

