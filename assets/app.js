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

// Slider carousel prev/next controls
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.slider-wrap').forEach(wrap => {
    const track = wrap.querySelector('.slider');
    const prevBtn = wrap.querySelector('.slider-prev');
    const nextBtn = wrap.querySelector('.slider-next');
    if (!track) return;
    const step = () => (track.querySelector('.card')?.offsetWidth || 300) + 16;
    prevBtn?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    nextBtn?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  });
});
