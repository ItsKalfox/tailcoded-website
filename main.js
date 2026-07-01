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
  const formBody = document.getElementById('form-body');
  const formSuccess = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      btn.disabled = true;
      btn.textContent = 'Sending...';

      setTimeout(() => {
        formBody.style.display = 'none';
        formSuccess.classList.add('show');
        btn.disabled = false;
        btn.textContent = 'Send Message';
        form.reset();
      }, 1400);
    });
  }

});
