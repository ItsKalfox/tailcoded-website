// ============================================================
//  TAILCODED STUDIO — MAIN JS REDESIGN (2026)
//  Constellation Canvas · 3D Card Tilts · Magnetic Buttons
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  const sections = document.querySelectorAll('section[id]');
  const burger = document.getElementById('nav-burger');
  const mobileMenu = document.getElementById('nav-mobile');
  const mobileItems = document.querySelectorAll('.nav-mobile .nav-link, .nav-mobile .nav-cta');
  const scrollTopBtn = document.getElementById('scroll-top');
  const scrollHint = document.getElementById('scroll-hint');

  // ── Scroll Listener (Sticky Nav & Scroll-to-Top) ────────
  function onScroll() {
    const sy = window.scrollY;
    const atTop = sy < 40;

    // Sticky nav toggle scrolled
    navbar.classList.toggle('scrolled', sy > 20);

    // Scroll-down hint: visible only at the very top
    if (scrollHint) {
      scrollHint.classList.toggle('hidden', !atTop);
    }

    // Scroll-to-top button visibility
    scrollTopBtn.classList.toggle('visible', !atTop);

    // Active nav link highlight based on section scroll offset
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - navH() - 100;
      if (sy >= top) current = sec.id;
    });
    navLinks.forEach(a => a.classList.toggle('active', a.dataset.section === current));
  }

  window.addEventListener('scroll', onScroll);
  onScroll(); // Run initially

  function navH() {
    return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 80;
  }

  // Scroll hint: click triggers scroll to About
  if (scrollHint) {
    scrollHint.addEventListener('click', () => {
      const about = document.getElementById('about');
      if (about) {
        const targetTop = about.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: targetTop - navH() - 8, behavior: 'smooth' });
      }
    });
  }

  // Scroll-to-top button click
  scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ── Mobile Hamburger Menu ──────────────────────────────
  burger.addEventListener('click', () => {
    const open = burger.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
    mobileMenu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  function closeMenu() {
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  mobileItems.forEach(el => el.addEventListener('click', closeMenu));
  document.addEventListener('click', e => {
    if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) closeMenu();
  });

  // ── Smooth Scroll for Anchor Links ────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        const targetTop = target.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: targetTop - navH() - 8, behavior: 'smooth' });
      }
    });
  });

  // ── IntersectionObserver (Scroll Reveal Animation) ────
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.sr').forEach(el => revealObserver.observe(el));

  const hasHover = window.matchMedia('(hover: hover)').matches;

  if (hasHover) {
    // ── Mouse Coordinate Tracking for Glowing Borders ──────
    const glowContainers = document.querySelectorAll('.hover-glow-container');
    
    glowContainers.forEach(container => {
      const cards = container.querySelectorAll('.hover-glow');
      
      container.addEventListener('mousemove', e => {
        cards.forEach(card => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);
        });
      });
    });

    // Support single standalone glowing cards
    document.querySelectorAll('.hover-glow:not(.hover-glow-container *)').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });

    // ── 3D Card Tilt Effect ──────────────────────────────
    const tiltCards = document.querySelectorAll('.tilt-card');
    
    tiltCards.forEach(card => {
      const speed = parseFloat(card.dataset.tiltSpeed) || 3;
      
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        
        const rotateX = -y * speed;
        const rotateY = x * speed;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.5s var(--ease)';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
      });
      
      card.addEventListener('mouseenter', () => {
        card.style.transition = 'none';
      });
    });

    // ── Magnetic Buttons Hover Effect ─────────────────────
    const magneticBtns = document.querySelectorAll('.btn-magnetic');
    
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        btn.style.transform = 'translate(0px, 0px)';
      });
      
      btn.addEventListener('mouseenter', () => {
        btn.style.transition = 'none';
      });
    });
  }

  // ── Interactive Hero Particle Canvas ──────────────────
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;
    
    let particles = [];
    let mouse = { x: null, y: null, radius: 140 };
    
    // Resize handler
    window.addEventListener('resize', () => {
      if (canvas.offsetWidth) {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
        initParticles();
      }
    });
    
    // Tracks mouse coordinates relative to hero visual container
    const heroVisual = canvas.closest('.hero-visual');
    if (heroVisual && hasHover) {
      heroVisual.addEventListener('mousemove', e => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      });
      
      heroVisual.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
      });
    }
    
    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.radius = Math.random() * 2 + 1;
        // Alternating theme colors
        this.color = Math.random() > 0.5 ? 'rgba(139, 92, 246, 0.4)' : 'rgba(6, 182, 212, 0.4)';
      }
      
      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Boundaries bounce
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
        
        // Mouse interact (push away slightly, only on desktop)
        if (hasHover && mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            // Scale pushing speed based on closeness
            this.x -= (dx / dist) * force * 1.6;
            this.y -= (dy / dist) * force * 1.6;
          }
        }
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }
    
    function initParticles() {
      particles = [];
      const isMobile = window.innerWidth <= 768;
      // Dynamic count based on screen bounds, lower count on mobile
      const count = isMobile 
        ? 20 
        : Math.min(65, Math.floor((width * height) / 7500));
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }
    
    initParticles();
    
    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      const isMobile = window.innerWidth <= 768;
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      
      // Connect nearby particles (disabled on mobile to maximize scroll frame rate)
      if (!isMobile) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 100) {
              // Fades lines smoothly as nodes pull apart
              const opacity = (100 - dist) / 100 * 0.18;
              ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }
      
      requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
  }

  // ── Contact Form Validation & Formspree Handling ────────
  const form = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const nameError = document.getElementById('name-error-msg');
  const emailInput = document.getElementById('contact-email-field');
  const emailError = document.getElementById('email-error-msg');
  const subjectInput = document.getElementById('contact-subject');
  const subjectError = document.getElementById('subject-error-msg');
  const messageInput = document.getElementById('contact-message');
  const messageError = document.getElementById('message-error-msg');

  function validateRequired(input, errorElement, fieldName) {
    if (!input || !errorElement) return true;
    const value = input.value.trim();
    if (!value) {
      errorElement.textContent = `${fieldName} is required`;
      errorElement.style.display = 'block';
      input.classList.add('has-error');
      return false;
    }
    errorElement.style.display = 'none';
    input.classList.remove('has-error');
    return true;
  }

  function validateEmail() {
    if (!emailInput || !emailError) return true;
    const value = emailInput.value.trim();
    if (!value) {
      emailError.textContent = 'Email address is required';
      emailError.style.display = 'block';
      emailInput.classList.add('has-error');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      emailError.textContent = 'Please enter a valid email address';
      emailError.style.display = 'block';
      emailInput.classList.add('has-error');
      return false;
    }
    emailError.style.display = 'none';
    emailInput.classList.remove('has-error');
    return true;
  }

  function validateAll() {
    const isNameValid = validateRequired(nameInput, nameError, 'Your Name');
    const isEmailValid = validateEmail();
    const isSubjectValid = validateRequired(subjectInput, subjectError, 'Subject');
    const isMessageValid = validateRequired(messageInput, messageError, 'Your Message');
    return isNameValid && isEmailValid && isSubjectValid && isMessageValid;
  }

  function setupValidation(input, errorElement, validationFn) {
    if (!input) return;
    input.addEventListener('blur', validationFn);
    input.addEventListener('input', () => {
      if (input.classList.contains('has-error')) {
        validationFn();
      }
    });
  }

  setupValidation(nameInput, nameError, () => validateRequired(nameInput, nameError, 'Your Name'));
  setupValidation(emailInput, emailError, validateEmail);
  setupValidation(subjectInput, subjectError, () => validateRequired(subjectInput, subjectError, 'Subject'));
  setupValidation(messageInput, messageError, () => validateRequired(messageInput, messageError, 'Your Message'));

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      if (!validateAll()) {
        return;
      }

      const btn = form.querySelector('.form-submit');
      const originalHTML = btn.innerHTML;

      btn.disabled = true;
      btn.innerHTML = 'Sending...';

      const data = new FormData(form);
      fetch(form.action, {
        method: form.method,
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      })
        .then(response => {
          if (response.ok) {
            btn.innerHTML = 'Message Sent';
            btn.disabled = true;
            form.reset();
            
            // Show success screen inside the glassmorphic form wrapper
            document.getElementById('form-body').style.display = 'none';
            document.getElementById('form-success').style.display = 'flex';

            [nameError, emailError, subjectError, messageError].forEach(err => {
              if (err) err.style.display = 'none';
            });
            [nameInput, emailInput, subjectInput, messageInput].forEach(inp => {
              if (inp) inp.classList.remove('has-error');
            });
          } else {
            response.json().then(data => {
              if (Object.hasOwn(data, 'errors')) {
                let handled = false;
                data.errors.forEach(err => {
                  if (err.field === 'email' && emailInput && emailError) {
                    emailError.textContent = err.message || 'Email is not valid';
                    emailError.style.display = 'block';
                    emailInput.classList.add('has-error');
                    handled = true;
                  } else if (err.field === 'name' && nameInput && nameError) {
                    nameError.textContent = err.message || 'Name is required';
                    nameError.style.display = 'block';
                    nameInput.classList.add('has-error');
                    handled = true;
                  } else if (err.field === 'subject' && subjectInput && subjectError) {
                    subjectError.textContent = err.message || 'Subject is required';
                    subjectError.style.display = 'block';
                    subjectInput.classList.add('has-error');
                    handled = true;
                  } else if (err.field === 'message' && messageInput && messageError) {
                    messageError.textContent = err.message || 'Message is required';
                    messageError.style.display = 'block';
                    messageInput.classList.add('has-error');
                    handled = true;
                  }
                });

                if (!handled) {
                  alert(data['errors'].map(error => error['message']).join(", "));
                }
              } else {
                alert("Oops! There was a problem submitting your form");
              }
              btn.disabled = false;
              btn.innerHTML = originalHTML;
            });
          }
        })
        .catch(error => {
          alert("Oops! There was a problem submitting your form");
          btn.disabled = false;
          btn.innerHTML = originalHTML;
        });
    });
  }

});
