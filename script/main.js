// ============================================================
//  TAILCODED STUDIO — MAIN JS (redesign)
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  const navbar      = document.getElementById('navbar');
  const navLinks    = document.querySelectorAll('.nav-link[data-section]');
  const sections    = document.querySelectorAll('section[id]');
  const burger      = document.getElementById('nav-burger');
  const mobileMenu  = document.getElementById('nav-mobile');
  const mobileItems = document.querySelectorAll('.nav-mobile .nav-link, .nav-mobile .nav-cta');
  const scrollTopBtn = document.getElementById('scroll-top');

  const scrollHint   = document.getElementById('scroll-hint');

  // ── Scroll listener ──────────────────────────────────
  function onScroll() {
    const sy = window.scrollY;
    const atTop = sy < 40;

    // Sticky nav bg
    navbar.classList.toggle('scrolled', sy > 20);

    // Scroll-down hint: visible at top, hidden once scrolled
    scrollHint.classList.toggle('hidden', !atTop);

    // Scroll-to-top button: hidden at top, visible once scrolled
    scrollTopBtn.classList.toggle('visible', !atTop);

    // Active nav link
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - navH() - 40;
      if (sy >= top) current = sec.id;
    });
    navLinks.forEach(a => a.classList.toggle('active', a.dataset.section === current));
  }

  window.addEventListener('scroll', onScroll);
  onScroll(); // run on load

  function navH() {
    return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
  }

  // ── Scroll-hint click → scroll to About ───────────────
  scrollHint.addEventListener('click', () => {
    const about = document.getElementById('about');
    if (about) window.scrollTo({ top: about.offsetTop - navH() - 8, behavior: 'smooth' });
  });

  // ── Scroll-to-top click → back to top ─────────────────
  scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ── Hamburger ─────────────────────────────────────────
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

  // ── Smooth scroll for all anchor links ────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) window.scrollTo({ top: target.offsetTop - navH() - 8, behavior: 'smooth' });
    });
  });

  // ── Scroll reveal (IntersectionObserver) ──────────────
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.sr').forEach(el => obs.observe(el));

  // ── Animated counters ─────────────────────────────────
  const cObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { animCount(e.target); cObs.unobserve(e.target); } });
  }, { threshold: 0.6 });

  document.querySelectorAll('[data-count]').forEach(el => cObs.observe(el));

  function animCount(el) {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const dur = 1200, step = 16;
    const inc = target / (dur / step);
    let v = 0;
    const t = setInterval(() => {
      v += inc;
      if (v >= target) { v = target; clearInterval(t); }
      el.textContent = Math.floor(v) + suffix;
    }, step);
  }

  // ── Contact form ──────────────────────────────────────
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
