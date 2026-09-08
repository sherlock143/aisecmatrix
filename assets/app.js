// Shared, tiny utilities used across tool pages. No frameworks, no build step.

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

// Services slideshow — one slide at a time, auto-advancing, pauses on hover/focus
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.ss-wrap').forEach(wrap => {
    const track = wrap.querySelector('.ss-track');
    const slides = wrap.querySelectorAll('.ss-slide');
    const dots = wrap.querySelectorAll('.ss-dot');
    if (!track || slides.length === 0) return;

    let index = 0;
    const total = slides.length;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const autoplayMs = parseInt(wrap.dataset.autoplay || '5000', 10);
    let timer = null;

    function render() {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
    }
    function goTo(i) { index = (i + total) % total; render(); }
    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    function startAutoplay() {
      if (reducedMotion || !autoplayMs) return;
      stopAutoplay();
      timer = setInterval(next, autoplayMs);
    }
    function stopAutoplay() { if (timer) clearInterval(timer); timer = null; }

    dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); startAutoplay(); }));

    // Nav buttons live in the section header, siblings of ss-wrap — find them within the same section
    const section = wrap.closest('.wrap') || document;
    const localPrev = section.querySelector('.ss-prev');
    const localNext = section.querySelector('.ss-next');
    localPrev?.addEventListener('click', () => { prev(); startAutoplay(); });
    localNext?.addEventListener('click', () => { next(); startAutoplay(); });

    wrap.addEventListener('mouseenter', stopAutoplay);
    wrap.addEventListener('mouseleave', startAutoplay);
    wrap.addEventListener('focusin', stopAutoplay);
    wrap.addEventListener('focusout', startAutoplay);

    render();
    startAutoplay();
  });
});

// Scroll-reveal — elements fade/slide up into view one by one as the user scrolls to them.
// Applied automatically to cards/slides so no per-page markup changes are needed.
document.addEventListener('DOMContentLoaded', () => {
  const revealEls = document.querySelectorAll('.card, .about-card, .ss-slide');
  if (!revealEls.length) return;

  revealEls.forEach(el => el.classList.add('reveal'));

  if (!('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  // Stagger reveal timing within each row/group so items visibly cascade in one by one
  let order = 0;
  let lastParent = null;
  revealEls.forEach(el => {
    if (el.parentElement !== lastParent) { order = 0; lastParent = el.parentElement; }
    el.style.transitionDelay = `${Math.min(order, 6) * 80}ms`;
    order++;
    observer.observe(el);
  });
});
