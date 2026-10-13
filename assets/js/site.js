// Aleph Beth — comportements du site, regroupés dans un seul fichier externe
// (aucun script inline : compatible avec une CSP stricte).
import * as params from '@params';

(function () {
  'use strict';

  // --- Thème clair / sombre ------------------------------------------------
  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      const html = document.documentElement;
      const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
      html.dataset.theme = next;
      try { localStorage.setItem('pref-theme', next); } catch (e) { /* stockage indisponible */ }
    });
  }

  // --- Position de défilement du menu (mobile) -----------------------------
  const menu = document.getElementById('menu');
  if (menu) {
    try {
      const pos = localStorage.getItem('menu-scroll-position');
      if (pos) menu.scrollLeft = parseInt(pos, 10);
      menu.addEventListener('scroll', function () {
        localStorage.setItem('menu-scroll-position', String(menu.scrollLeft));
      });
    } catch (e) { /* stockage indisponible */ }
  }

  // --- Ancres internes : défilement doux ----------------------------------
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const id = decodeURIComponent(this.getAttribute('href').slice(1));
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView(reduced ? {} : { behavior: 'smooth' });
      if (id === 'top') history.replaceState(null, '', ' ');
      else history.pushState(null, '', '#' + id);
    });
  });

  // --- Lien "retour en haut" ---------------------------------------------
  const topLink = document.getElementById('top-link');
  if (topLink && params.scrollToTop) {
    window.addEventListener('scroll', function () {
      const y = document.documentElement.scrollTop || document.body.scrollTop;
      topLink.classList.toggle('hidden', y <= window.innerHeight);
    }, { passive: true });
  }

  // --- Boutons "copier" sur les blocs de code ------------------------------
  if (params.copyButtons) {
    document.querySelectorAll('pre > code').forEach(function (code) {
      const container = code.parentNode.parentNode;
      const btn = document.createElement('button');
      btn.classList.add('copy-code');
      btn.textContent = params.copy;
      const done = function () {
        btn.textContent = params.copied;
        setTimeout(function () { btn.textContent = params.copy; }, 2000);
      };
      btn.addEventListener('click', function () {
        if ('clipboard' in navigator) {
          navigator.clipboard.writeText(code.textContent).then(done);
          return;
        }
        const range = document.createRange();
        range.selectNodeContents(code);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        try { document.execCommand('copy'); done(); } catch (e) { /* ignoré */ }
        sel.removeRange(range);
      });
      if (container.classList.contains('highlight')) {
        container.appendChild(btn);
      } else if (container.parentNode.firstChild === container) {
        // cellule des numéros de ligne : rien
      } else if (code.parentNode.parentNode.parentNode.parentNode.parentNode.nodeName === 'TABLE') {
        code.parentNode.parentNode.parentNode.parentNode.parentNode.appendChild(btn);
      } else {
        code.parentNode.appendChild(btn);
      }
    });
  }

  // --- Adresse e-mail assemblée côté client --------------------------------
  document.querySelectorAll('a.ab-mail[data-u][data-d]').forEach(function (a) {
    const addr = a.dataset.u + '@' + a.dataset.d;
    a.href = 'mailto:' + addr;
    a.textContent = addr;
  });

  // --- Widgets interactifs : ajustement de hauteur des iframes -------------
  window.addEventListener('message', function (e) {
    if (!e.data || e.data.wtWidget !== 1 || typeof e.data.h !== 'number') return;
    document.querySelectorAll('iframe.wt-widget:not(.wt-app)').forEach(function (f) {
      if (f.contentWindow === e.source) f.style.height = (e.data.h + 4) + 'px';
    });
  });
})();
