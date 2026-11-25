// Menu mobile
const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('menu');
toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menu.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
}));

// Bordure du header au scroll
const header = document.querySelector('.site-header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Apparition progressive des sections
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Année du footer
document.getElementById('year').textContent = new Date().getFullYear();

// Formulaire : ouvre le client mail avec le message pré-rempli
const CONTACT_EMAIL = 'contact@exemple.fr'; // <- à remplacer par l'adresse d'Adeline
const form = document.getElementById('contact-form');
const note = form.querySelector('.form-note');
form.addEventListener('submit', e => {
  e.preventDefault();
  if (!form.checkValidity()) {
    note.textContent = 'Merci de remplir tous les champs.';
    return;
  }
  const d = new FormData(form);
  const subject = `Demande de rendez-vous – ${d.get('nom')}`;
  const body = `Nom : ${d.get('nom')}\nE-mail : ${d.get('email')}\nPour : ${d.get('pour')}\n\n${d.get('message')}`;
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  note.textContent = 'Votre messagerie va s\'ouvrir pour envoyer le message.';
});
