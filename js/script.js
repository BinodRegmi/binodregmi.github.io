const root = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const backToTop = document.querySelector('#back-to-top');

function setTheme(theme) {
  root.dataset.theme = theme;
  if (themeToggle) {
    const isDark = theme === 'dark';
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    themeToggle.querySelector('span').textContent = isDark ? '☀' : '◐';
  }
}

const savedTheme = localStorage.getItem('portfolio-theme');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
setTheme(savedTheme || systemTheme);

themeToggle?.addEventListener('click', () => {
  const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(nextTheme);
  localStorage.setItem('portfolio-theme', nextTheme);
});

function closeMenu() {
  navLinks?.classList.remove('is-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', 'Open navigation menu');
  if (menuToggle) menuToggle.querySelector('span').textContent = '☰';
}

menuToggle?.addEventListener('click', () => {
  const isOpen = navLinks?.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(Boolean(isOpen)));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  menuToggle.querySelector('span').textContent = isOpen ? '×' : '☰';
});

navLinks?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

window.addEventListener('scroll', () => {
  backToTop?.classList.toggle('is-visible', window.scrollY > 500);
}, { passive: true });
backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

document.querySelector('#current-year').textContent = new Date().getFullYear();

const contactForm = document.querySelector('#contact-form');
const fields = {
  name: { input: document.querySelector('#name'), error: document.querySelector('#name-error'), message: 'Please enter your name.' },
  email: { input: document.querySelector('#email'), error: document.querySelector('#email-error'), message: 'Please enter a valid email address.' },
  message: { input: document.querySelector('#message'), error: document.querySelector('#message-error'), message: 'Please include a short message.' }
};

function validateField(fieldName) {
  const field = fields[fieldName];
  if (!field.input) return true;
  const validEmail = fieldName !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.input.value.trim());
  const isValid = field.input.value.trim() !== '' && validEmail;
  field.input.closest('.form-field')?.classList.toggle('has-error', !isValid);
  if (field.error) field.error.textContent = isValid ? '' : field.message;
  field.input.setAttribute('aria-invalid', String(!isValid));
  return isValid;
}

Object.keys(fields).forEach((fieldName) => fields[fieldName].input?.addEventListener('blur', () => validateField(fieldName)));
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const isValid = Object.keys(fields).map(validateField).every(Boolean);
  const status = document.querySelector('#form-status');
  if (!isValid) {
    if (status) status.textContent = 'Please check the highlighted fields.';
    return;
  }
  const formData = new FormData(contactForm);
  const subject = encodeURIComponent(`Portfolio enquiry from ${formData.get('name')}`);
  const body = encodeURIComponent(`${formData.get('message')}\n\nReply to: ${formData.get('email')}`);
  window.location.href = `mailto:binodrajregmi1@gmail.com?subject=${subject}&body=${body}`;
  if (status) status.textContent = 'Opening your email client...';
});
