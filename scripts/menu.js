function lockBodyScroll(lock) {
  document.documentElement.style.overflow = lock ? 'hidden' : '';
  document.body.style.overflow = lock ? 'hidden' : '';
}

function detectScrollRoot() {
  const candidates = [
    document.scrollingElement,
    document.documentElement,
    document.body,
    document.querySelector('main'),
    document.querySelector('.container')
  ].filter(Boolean);

  for (const el of candidates) {
    try {
      if (el.scrollHeight > el.clientHeight) return el;
    } catch (_) {}
  }

  return document.documentElement;
}

let SCROLL_ROOT = detectScrollRoot();


const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

if (menuToggle && mainNav) {
  menuToggle.classList.remove('active');
  mainNav.classList.remove('active');
  menuToggle.setAttribute('aria-expanded', 'false');
  lockBodyScroll(false);

  let navOverlay = document.querySelector('.nav-overlay');
  if (!navOverlay) {
    navOverlay = document.createElement('div');
    navOverlay.className = 'nav-overlay';
    document.body.appendChild(navOverlay);
  }

  function openMenu() {
    if (window.innerWidth > 768) return;
    menuToggle.classList.add('active');
    mainNav.classList.add('active');
    navOverlay.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
    lockBodyScroll(true);
  }

  function closeMenu() {
    menuToggle.classList.remove('active');
    mainNav.classList.remove('active');
    navOverlay.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    lockBodyScroll(false);
  }

  function toggleMenu() {
    mainNav.classList.contains('active') ? closeMenu() : openMenu();
  }

  menuToggle.addEventListener('click', toggleMenu);
  navOverlay.addEventListener('click', closeMenu);

  mainNav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) closeMenu();
    });
  });


  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mainNav.classList.contains('active')) {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    SCROLL_ROOT = detectScrollRoot();
    if (window.innerWidth > 768) closeMenu();
  });
}

const scrollTopButton = document.getElementById('scrollTop');

if (scrollTopButton) {
  scrollTopButton.classList.remove('visible');

  function getScrollTop() {
    if (SCROLL_ROOT && typeof SCROLL_ROOT.scrollTop === 'number') {
      return SCROLL_ROOT.scrollTop;
    }
    return window.pageYOffset || document.documentElement.scrollTop || 0;
  }

  function updateScrollTopVisibility() {
    getScrollTop() > 300
      ? scrollTopButton.classList.add('visible')
      : scrollTopButton.classList.remove('visible');
  }

  window.addEventListener('scroll', updateScrollTopVisibility);
  if (SCROLL_ROOT && SCROLL_ROOT !== document && SCROLL_ROOT.addEventListener) {
    SCROLL_ROOT.addEventListener('scroll', updateScrollTopVisibility);
  }

  scrollTopButton.addEventListener('click', e => {
    e.preventDefault();

    try {
      if (SCROLL_ROOT && typeof SCROLL_ROOT.scrollTo === 'function') {
        SCROLL_ROOT.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (_) {
      window.scrollTo(0, 0);
    }
  });

  updateScrollTopVisibility();

}
