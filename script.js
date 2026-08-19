// ---------- Mobile nav toggle ----------
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ---------- Case Study Modal ----------
(function caseStudyModal() {
  const modal = document.getElementById('caseModal');
  const panel = modal ? modal.querySelector('.case-modal-panel') : null;
  const body = document.getElementById('caseModalBody');
  const closeBtn = document.getElementById('caseModalClose');
  const triggers = document.querySelectorAll('[data-case-study]');
  if (!modal || !panel || !body || !triggers.length) return;

  let lastFocused = null;
  let scrollY = 0;

  function bindLightboxTriggers(container) {
    container.querySelectorAll('[data-lightbox]').forEach(el => {
      el.addEventListener('click', () => {
        openLightbox(el.getAttribute('data-lightbox'), el.getAttribute('data-caption'));
      });
    });
  }

  function fieldHTML(article, selector) {
    const el = article.querySelector(selector);
    return el ? el.innerHTML : '';
  }

  function detailHTML(article, labelText) {
    const paras = article.querySelectorAll('.work-details p');
    for (const p of paras) {
      const label = p.querySelector('.detail-label');
      if (label && label.textContent.trim() === labelText) return p.innerHTML;
    }
    return '';
  }

  function buildModalContent(article) {
    const title = article.querySelector('h3') ? article.querySelector('h3').textContent : '';
    const shotBtn = article.querySelector('.work-shot');
    const shotSrc = shotBtn ? shotBtn.getAttribute('data-lightbox') : '';
    const shotCaption = shotBtn ? shotBtn.getAttribute('data-caption') : '';
    const shotImg = shotBtn ? shotBtn.querySelector('img') : null;
    const shotAlt = shotImg ? shotImg.getAttribute('alt') : '';

    const problem = fieldHTML(article, '.work-problem');
    const solution = fieldHTML(article, '.work-solution');
    const tools = fieldHTML(article, '.work-tools');
    const whyMattered = detailHTML(article, 'WHY IT MATTERED');
    const howItWorks = detailHTML(article, 'HOW IT WORKS');
    const humanRole = detailHTML(article, 'HUMAN ROLE');
    const result = detailHTML(article, 'RESULT');

    const extraShotBtn = article.querySelector('.work-more-shot');
    const extraShot = extraShotBtn ? extraShotBtn.outerHTML : '';

    let html = '';
    html += `<h3 id="caseModalTitle">${title}</h3>`;
    if (problem) html += `<p>${problem}</p>`;
    if (whyMattered) html += `<p><span class="mono detail-label">WHY IT MATTERED</span>${whyMattered.replace(/^.*?<\/span>/, '')}</p>`;
    if (solution) html += `<p>${solution}</p>`;
    if (howItWorks) html += `<p><span class="mono detail-label">HOW IT WORKS</span>${howItWorks.replace(/^.*?<\/span>/, '')}</p>`;
    if (humanRole) html += `<p><span class="mono detail-label">HUMAN ROLE</span>${humanRole.replace(/^.*?<\/span>/, '')}</p>`;
    if (result) html += `<p><span class="mono detail-label">RESULT</span>${result.replace(/^.*?<\/span>/, '')}</p>`;
    if (tools) html += `<p class="work-tools mono"><span class="mono detail-label">TECHNOLOGY / STACK</span>${tools}</p>`;
    if (shotSrc) {
      html += `<button class="case-modal-shot" data-lightbox="${shotSrc}" data-caption="${shotCaption || ''}" aria-label="Enlarge ${title} screenshot">` +
              `<img src="${shotSrc}" alt="${shotAlt || ''}"></button>`;
    }
    if (extraShot) html += extraShot;

    return html;
  }

  function openModal(article) {
    body.innerHTML = buildModalContent(article);
    bindLightboxTriggers(body);

    scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';

    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('is-open'));
    closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    const onEnd = () => {
      modal.hidden = true;
      body.innerHTML = '';
      panel.removeEventListener('transitionend', onEnd);
    };
    panel.addEventListener('transitionend', onEnd);
    setTimeout(onEnd, 260); // fallback in case transitionend doesn't fire

    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    window.scrollTo(0, scrollY);

    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  triggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const article = btn.closest('.work-card');
      if (!article) return;
      lastFocused = btn;
      openModal(article);
    });
  });

  closeBtn.addEventListener('click', closeModal);
  modal.querySelectorAll('[data-case-modal-close]').forEach(el => {
    el.addEventListener('click', closeModal);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
    if (e.key === 'Tab' && !modal.hidden) {
      const focusable = panel.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
})();

// ---------- Lightbox ----------
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');

function openLightbox(src, caption) {
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = src;
  lightboxImg.alt = caption || '';
  if (lightboxCaption) lightboxCaption.textContent = caption || '';
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.hidden = true;
  lightboxImg.src = '';
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-lightbox]').forEach(el => {
  el.addEventListener('click', () => {
    openLightbox(el.getAttribute('data-lightbox'), el.getAttribute('data-caption'));
  });
});

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

// ---------- Scroll reveal ----------
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('is-visible'));
}
