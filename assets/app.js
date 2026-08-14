// Shared, tiny utilities used across tool pages. No frameworks, no build step.

// Escape user input before it ever touches innerHTML.
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Simple debounce for input-driven scans.
function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

// Mega-dropdown nav toggle (click-based so it works with touch, not just hover)
document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    const btn = item.querySelector('button');
    if (!btn) return;
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = item.classList.contains('open');
      navItems.forEach(i => { i.classList.remove('open'); i.querySelector('button')?.setAttribute('aria-expanded', 'false'); });
      if (!isOpen) { item.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
    });
  });
  document.addEventListener('click', () => {
    navItems.forEach(i => { i.classList.remove('open'); i.querySelector('button')?.setAttribute('aria-expanded', 'false'); });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') navItems.forEach(i => i.classList.remove('open'));
  });
});
