/* ═══════════════════════════════════════════════════════════════════════
   preferences.js — Reader Customization + ADHD Features
   Estudos Design System v3

   Standalone: sem dependências de sessao.js ou tracking.js.
   Carregado após sessao.js em todas as sessões HTML.
   Persistência: localStorage['estudos-preferences']
   ═══════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── Schema de preferências ─── */
  var PREFS_KEY = 'estudos-preferences';

  var DEFAULTS = {
    theme: 'parchment',
    fontSize: 'medium',
    lineHeight: 'normal',
    focusMode: false,
    chunking: false
  };

  /* ─── Themes — cores dos swatches para visualização no painel ─── */
  var THEMES = [
    { id: 'parchment',     label: 'Parchment',  bg: '#fbf8f0', text: '#1f1a14' },
    { id: 'creme',         label: 'Creme',       bg: '#fffff4', text: '#1a1a1a' },
    { id: 'sepia-dark',    label: 'Sépia',       bg: '#2a2018', text: '#e8dcc8' },
    { id: 'low-light',     label: 'Suave',       bg: '#1e1b16', text: '#d4c9b4' },
    { id: 'high-contrast', label: 'Alto Contr.', bg: '#000000', text: '#ffffff' }
  ];

  /* ─── Tamanhos de fonte ─── */
  var FONT_SIZES = [
    { id: 'small',   label: 'A',  px: '14px', title: 'Pequeno' },
    { id: 'medium',  label: 'A',  px: '17px', title: 'Médio (padrão)' },
    { id: 'large',   label: 'A',  px: '20px', title: 'Grande' },
    { id: 'xlarge',  label: 'A',  px: '23px', title: 'Muito grande' }
  ];

  /* ─── Alturas de linha ─── */
  var LINE_HEIGHTS = [
    { id: 'compact', label: 'Compacto', value: '1.5'  },
    { id: 'normal',  label: 'Normal',   value: '1.75' },
    { id: 'wide',    label: 'Amplo',    value: '2.1'  }
  ];

  /* ═══════════════════════════════════════════════════════════════════
     PERSISTÊNCIA
     ═══════════════════════════════════════════════════════════════════ */

  function loadPrefs() {
    try {
      var stored = localStorage.getItem(PREFS_KEY);
      if (!stored) return Object.assign({}, DEFAULTS);
      return Object.assign({}, DEFAULTS, JSON.parse(stored));
    } catch (e) {
      return Object.assign({}, DEFAULTS);
    }
  }

  function savePrefs(prefs) {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    } catch (e) { /* silencioso — modo privado ou quota */ }
  }

  /* ═══════════════════════════════════════════════════════════════════
     APLICAÇÃO DAS PREFERÊNCIAS
     ═══════════════════════════════════════════════════════════════════ */

  function applyTheme(themeId) {
    document.documentElement.setAttribute('data-theme', themeId);
  }

  function applyFontSize(sizeId) {
    var size = FONT_SIZES.find(function (s) { return s.id === sizeId; });
    if (!size) return;
    document.documentElement.style.setProperty('--reader-font-size', size.px);
    /* Força re-avaliação mesmo quando media queries tentam sobrescrever */
    document.documentElement.style.fontSize = size.px;
  }

  function applyLineHeight(lhId) {
    var lh = LINE_HEIGHTS.find(function (l) { return l.id === lhId; });
    if (!lh) return;
    document.documentElement.style.setProperty('--reader-line-height', lh.value);
  }

  function applyFocusMode(enabled) {
    document.body.classList.toggle('focus-mode', enabled);
    if (enabled) {
      initFocusMode();
    } else {
      destroyFocusMode();
    }
  }

  function applyChunking(enabled) {
    document.body.classList.toggle('chunking-active', enabled);
    if (enabled) {
      initChunking();
    } else {
      destroyChunking();
    }
  }

  function applyAll(prefs) {
    applyTheme(prefs.theme);
    applyFontSize(prefs.fontSize);
    applyLineHeight(prefs.lineHeight);
    applyFocusMode(prefs.focusMode);
    applyChunking(prefs.chunking);
  }

  /* ═══════════════════════════════════════════════════════════════════
     FOCUS MODE
     ═══════════════════════════════════════════════════════════════════ */

  var focusScrollRAF = null;
  var focusClickHandler = null;

  function getFocusTargets() {
    var corpo = document.querySelector('.corpo');
    if (!corpo) return [];
    /* :scope> não é suportado em todos os contextos; filtra manualmente */
    return Array.from(corpo.children).filter(function (el) {
      var tag = el.tagName.toLowerCase();
      return tag === 'p' || tag === 'li' || tag === 'ul' || tag === 'ol' ||
             tag === 'blockquote' || el.classList.contains('callout');
    });
  }

  function updateFocusActive() {
    var targets = getFocusTargets();
    if (!targets.length) return;

    var viewportMid = window.innerHeight / 2;
    var best = null;
    var bestDist = Infinity;

    targets.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      var elMid = rect.top + rect.height / 2;
      var dist = Math.abs(elMid - viewportMid);
      if (dist < bestDist) {
        bestDist = dist;
        best = el;
      }
    });

    targets.forEach(function (el) {
      el.classList.toggle('focus-active', el === best);
    });
  }

  function onFocusScroll() {
    if (focusScrollRAF) cancelAnimationFrame(focusScrollRAF);
    focusScrollRAF = requestAnimationFrame(updateFocusActive);
  }

  function initFocusMode() {
    updateFocusActive();
    window.addEventListener('scroll', onFocusScroll, { passive: true });

    /* Clicar em qualquer parágrafo o destaca */
    focusClickHandler = function (e) {
      var targets = getFocusTargets();
      var clicked = targets.find(function (el) { return el.contains(e.target); });
      if (clicked) {
        targets.forEach(function (el) { el.classList.remove('focus-active'); });
        clicked.classList.add('focus-active');
      }
    };
    var corpo = document.querySelector('.corpo');
    if (corpo) corpo.addEventListener('click', focusClickHandler);
  }

  function destroyFocusMode() {
    window.removeEventListener('scroll', onFocusScroll);
    var corpo = document.querySelector('.corpo');
    if (corpo && focusClickHandler) corpo.removeEventListener('click', focusClickHandler);
    focusClickHandler = null;
    getFocusTargets().forEach(function (el) { el.classList.remove('focus-active'); });
  }

  /* ═══════════════════════════════════════════════════════════════════
     CHUNKING — seções colapsáveis
     ═══════════════════════════════════════════════════════════════════ */

  var CHUNK_MARKER = 'data-chunking-original-parent';

  /* Seções que serão agrupadas */
  var CHUNK_SELECTORS = [
    '.pre-leitura',
    '.corpo',
    '.timeline-mini',
    '.viver-bem',
    '.quiz',
    '.reflexao',
    '.para-ir-alem'
  ];

  var CHUNK_LABELS = {
    'pre-leitura':  'Antes de começar',
    'corpo':        'Conteúdo principal',
    'timeline-mini':'Linha do tempo',
    'viver-bem':    'Viver Bem?',
    'quiz':         'Quiz de fixação',
    'reflexao':     'Reflexão escrita',
    'para-ir-alem': 'Para ir além'
  };

  function getSectionLabel(el) {
    for (var cls in CHUNK_LABELS) {
      if (el.classList.contains(cls)) return CHUNK_LABELS[cls];
    }
    /* Fallback: usa o primeiro h2/h3/h4 dentro da seção */
    var heading = el.querySelector('h2, h3, h4');
    return heading ? heading.textContent.trim() : 'Seção';
  }

  function initChunking() {
    var main = document.getElementById('main-content');
    if (!main) return;

    /* Encontra seções elegíveis ainda não transformadas */
    var sections = [];
    CHUNK_SELECTORS.forEach(function (sel) {
      main.querySelectorAll(sel).forEach(function (el) {
        if (!el.closest('.section-collapsible')) sections.push(el);
      });
    });

    if (!sections.length) return;

    var total = sections.length;

    sections.forEach(function (section, idx) {
      var label = getSectionLabel(section);
      var counter = (idx + 1) + ' / ' + total;

      /* Cria wrapper colapsável */
      var wrapper = document.createElement('div');
      wrapper.className = 'section-collapsible';
      wrapper.setAttribute('data-chunking-section', 'true');

      /* Header clicável */
      var header = document.createElement('button');
      header.className = 'section-header';
      header.setAttribute('aria-expanded', 'true');
      header.setAttribute('aria-controls', 'chunk-body-' + idx);

      var titleSpan = document.createElement('span');
      titleSpan.className = 'section-header-title';
      titleSpan.textContent = label;

      var counterSpan = document.createElement('span');
      counterSpan.className = 'section-counter';
      counterSpan.textContent = counter;
      counterSpan.setAttribute('aria-hidden', 'true');

      /* Chevron SVG */
      var chevron = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      chevron.setAttribute('class', 'section-chevron');
      chevron.setAttribute('viewBox', '0 0 16 16');
      chevron.setAttribute('fill', 'none');
      chevron.setAttribute('aria-hidden', 'true');
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M4 6l4 4 4-4');
      path.setAttribute('stroke', 'currentColor');
      path.setAttribute('stroke-width', '2');
      path.setAttribute('stroke-linecap', 'round');
      chevron.appendChild(path);

      header.appendChild(titleSpan);
      header.appendChild(counterSpan);
      header.appendChild(chevron);

      /* Body */
      var body = document.createElement('div');
      body.className = 'section-body';
      body.id = 'chunk-body-' + idx;

      /* Insere wrapper antes da seção original */
      section.parentNode.insertBefore(wrapper, section);
      body.appendChild(section);
      wrapper.appendChild(header);
      wrapper.appendChild(body);

      /* Toggle */
      header.addEventListener('click', function () {
        var collapsed = wrapper.classList.toggle('collapsed');
        header.setAttribute('aria-expanded', String(!collapsed));
      });

      /* Keyboard: Space/Enter já funcionam em <button> nativamente */
    });

    /* Progress bar no topo */
    updateChunkingProgress();
  }

  function updateChunkingProgress() {
    var bar = document.querySelector('.chunking-progress');
    if (!bar) return;
    var wrappers = document.querySelectorAll('[data-chunking-section]');
    var total = wrappers.length;
    if (!total) return;
    var open = 0;
    wrappers.forEach(function (w) { if (!w.classList.contains('collapsed')) open++; });
    bar.textContent = open + ' de ' + total + ' seções abertas';
  }

  function destroyChunking() {
    /* Desempacota todas as seções transformadas */
    var wrappers = document.querySelectorAll('[data-chunking-section]');
    wrappers.forEach(function (wrapper) {
      var body = wrapper.querySelector('.section-body');
      if (body) {
        while (body.firstChild) {
          wrapper.parentNode.insertBefore(body.firstChild, wrapper);
        }
      }
      wrapper.parentNode.removeChild(wrapper);
    });

    var bar = document.querySelector('.chunking-progress');
    if (bar) bar.textContent = '';
  }

  /* ═══════════════════════════════════════════════════════════════════
     PAINEL DE PREFERÊNCIAS — UI
     ═══════════════════════════════════════════════════════════════════ */

  function buildPanel(prefs) {
    /* Botão flutuante */
    var toggle = document.createElement('button');
    toggle.id = 'prefs-toggle';
    toggle.setAttribute('aria-label', 'Configurações de leitura');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'prefs-panel');
    toggle.innerHTML = '⚙';
    toggle.title = 'Configurações de leitura';

    /* Painel */
    var panel = document.createElement('div');
    panel.id = 'prefs-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'false'); /* não bloqueia background */
    panel.setAttribute('aria-label', 'Configurações de leitura');

    panel.innerHTML = buildPanelHTML(prefs);

    document.body.appendChild(toggle);
    document.body.appendChild(panel);

    /* Progress bar do chunking */
    var bar = document.createElement('div');
    bar.className = 'chunking-progress';
    bar.setAttribute('aria-live', 'polite');
    bar.setAttribute('aria-label', 'Progresso das seções');
    document.body.appendChild(bar);

    bindEvents(toggle, panel, prefs);
  }

  function buildPanelHTML(prefs) {
    /* ── Header ── */
    var html = '<div class="prefs-header">' +
      '<span class="prefs-title">Configurações de leitura</span>' +
      '<button class="prefs-close" aria-label="Fechar configurações">✕</button>' +
      '</div>';

    /* ── Tema ── */
    html += '<div class="prefs-section">' +
      '<span class="prefs-label" id="prefs-theme-label">Tema</span>' +
      '<div class="prefs-themes" role="group" aria-labelledby="prefs-theme-label">';
    THEMES.forEach(function (t) {
      var pressed = t.id === prefs.theme ? 'true' : 'false';
      html += '<button class="prefs-theme-btn"' +
        ' data-theme-id="' + t.id + '"' +
        ' aria-pressed="' + pressed + '"' +
        ' aria-label="Tema ' + t.label + '"' +
        ' title="' + t.label + '"' +
        ' style="background:' + t.bg + '; border-color:' + (pressed === 'true' ? 'var(--color-accent)' : 'transparent') + '">' +
        '<span class="theme-swatch-label" style="color:' + t.text + '">' + t.label + '</span>' +
        '</button>';
    });
    html += '</div></div>';

    /* ── Tamanho do texto ── */
    html += '<div class="prefs-section">' +
      '<span class="prefs-label" id="prefs-size-label">Tamanho do texto</span>' +
      '<div class="prefs-font-sizes" role="group" aria-labelledby="prefs-size-label">';
    FONT_SIZES.forEach(function (s, i) {
      var fontSize = (0.7 + i * 0.15) + 'rem';
      var pressed = s.id === prefs.fontSize ? 'true' : 'false';
      html += '<button class="prefs-size-btn"' +
        ' data-size-id="' + s.id + '"' +
        ' aria-pressed="' + pressed + '"' +
        ' title="' + s.title + '"' +
        ' style="font-size:' + fontSize + '">' +
        s.label + '</button>';
    });
    html += '</div></div>';

    /* ── Espaçamento ── */
    html += '<div class="prefs-section">' +
      '<span class="prefs-label" id="prefs-lh-label">Espaçamento</span>' +
      '<div class="prefs-line-heights" role="group" aria-labelledby="prefs-lh-label">';
    LINE_HEIGHTS.forEach(function (l) {
      var pressed = l.id === prefs.lineHeight ? 'true' : 'false';
      html += '<button class="prefs-lh-btn"' +
        ' data-lh-id="' + l.id + '"' +
        ' aria-pressed="' + pressed + '">' +
        l.label + '</button>';
    });
    html += '</div></div>';

    /* ── ADHD ── */
    html += '<div class="prefs-section">' +
      '<span class="prefs-label">Modo de Atenção</span>' +

      /* Focus Mode */
      '<div class="prefs-toggle-row">' +
        '<div class="prefs-toggle-info">' +
          '<span class="prefs-toggle-name">Modo Foco</span>' +
          '<span class="prefs-toggle-desc">Destaca o parágrafo atual, esmaeça o restante</span>' +
        '</div>' +
        '<label class="prefs-switch">' +
          '<input type="checkbox" id="prefs-focus-mode" aria-label="Ativar Modo Foco"' +
          (prefs.focusMode ? ' checked' : '') + '>' +
          '<span class="prefs-switch-track"></span>' +
        '</label>' +
      '</div>' +

      /* Chunking */
      '<div class="prefs-toggle-row">' +
        '<div class="prefs-toggle-info">' +
          '<span class="prefs-toggle-name">Seções Colapsáveis</span>' +
          '<span class="prefs-toggle-desc">Divide a página em blocos — abre um por vez</span>' +
        '</div>' +
        '<label class="prefs-switch">' +
          '<input type="checkbox" id="prefs-chunking" aria-label="Ativar Seções Colapsáveis"' +
          (prefs.chunking ? ' checked' : '') + '>' +
          '<span class="prefs-switch-track"></span>' +
        '</label>' +
      '</div>' +
      '</div>';

    /* ── Reset ── */
    html += '<div class="prefs-section">' +
      '<button class="prefs-reset" data-action="reset">Restaurar padrões</button>' +
      '</div>';

    return html;
  }

  /* ═══════════════════════════════════════════════════════════════════
     EVENT BINDING
     ═══════════════════════════════════════════════════════════════════ */

  function bindEvents(toggle, panel, prefs) {
    /* Abrir / fechar painel */
    toggle.addEventListener('click', function () {
      var isOpen = panel.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      if (isOpen) {
        /* Foco no primeiro elemento focável do painel */
        var first = panel.querySelector('button, input');
        if (first) first.focus();
      }
    });

    /* Fechar com botão ✕ */
    panel.addEventListener('click', function (e) {
      if (e.target.classList.contains('prefs-close')) {
        closePanel(toggle, panel);
      }
    });

    /* Fechar com Escape */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('open')) {
        closePanel(toggle, panel);
      }
    });

    /* Trap de foco dentro do painel */
    panel.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var focusable = Array.from(panel.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ));
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    /* Themes */
    panel.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-theme-id]');
      if (!btn) return;
      var themeId = btn.getAttribute('data-theme-id');
      prefs.theme = themeId;
      savePrefs(prefs);
      applyTheme(themeId);
      panel.querySelectorAll('[data-theme-id]').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === btn));
      });
    });

    /* Font sizes */
    panel.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-size-id]');
      if (!btn) return;
      var sizeId = btn.getAttribute('data-size-id');
      prefs.fontSize = sizeId;
      savePrefs(prefs);
      applyFontSize(sizeId);
      panel.querySelectorAll('[data-size-id]').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === btn));
      });
    });

    /* Line heights */
    panel.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-lh-id]');
      if (!btn) return;
      var lhId = btn.getAttribute('data-lh-id');
      prefs.lineHeight = lhId;
      savePrefs(prefs);
      applyLineHeight(lhId);
      panel.querySelectorAll('[data-lh-id]').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === btn));
      });
    });

    /* Focus Mode toggle */
    var focusInput = panel.querySelector('#prefs-focus-mode');
    if (focusInput) {
      focusInput.addEventListener('change', function () {
        prefs.focusMode = focusInput.checked;
        savePrefs(prefs);
        applyFocusMode(prefs.focusMode);
      });
    }

    /* Chunking toggle */
    var chunkInput = panel.querySelector('#prefs-chunking');
    if (chunkInput) {
      chunkInput.addEventListener('change', function () {
        prefs.chunking = chunkInput.checked;
        savePrefs(prefs);
        applyChunking(prefs.chunking);
        updateChunkingProgress();
      });
    }

    /* Reset */
    panel.addEventListener('click', function (e) {
      if (e.target.getAttribute('data-action') !== 'reset') return;
      prefs = Object.assign({}, DEFAULTS);
      savePrefs(prefs);
      applyAll(prefs);
      /* Re-renderiza o painel com os defaults */
      panel.innerHTML = buildPanelHTML(prefs);
      bindPanelInternalEvents(panel, prefs);
    });
  }

  /* Re-bind eventos internos após reset (evita duplicação com bindEvents completo) */
  function bindPanelInternalEvents(panel, prefs) {
    var focusInput = panel.querySelector('#prefs-focus-mode');
    if (focusInput) {
      focusInput.addEventListener('change', function () {
        prefs.focusMode = focusInput.checked;
        savePrefs(prefs);
        applyFocusMode(prefs.focusMode);
      });
    }
    var chunkInput = panel.querySelector('#prefs-chunking');
    if (chunkInput) {
      chunkInput.addEventListener('change', function () {
        prefs.chunking = chunkInput.checked;
        savePrefs(prefs);
        applyChunking(prefs.chunking);
        updateChunkingProgress();
      });
    }
    panel.addEventListener('click', function (e) {
      var themeBtn = e.target.closest('[data-theme-id]');
      if (themeBtn) {
        var themeId = themeBtn.getAttribute('data-theme-id');
        prefs.theme = themeId;
        savePrefs(prefs);
        applyTheme(themeId);
        panel.querySelectorAll('[data-theme-id]').forEach(function (b) {
          b.setAttribute('aria-pressed', String(b === themeBtn));
        });
      }
      var sizeBtn = e.target.closest('[data-size-id]');
      if (sizeBtn) {
        var sizeId = sizeBtn.getAttribute('data-size-id');
        prefs.fontSize = sizeId;
        savePrefs(prefs);
        applyFontSize(sizeId);
        panel.querySelectorAll('[data-size-id]').forEach(function (b) {
          b.setAttribute('aria-pressed', String(b === sizeBtn));
        });
      }
      var lhBtn = e.target.closest('[data-lh-id]');
      if (lhBtn) {
        var lhId = lhBtn.getAttribute('data-lh-id');
        prefs.lineHeight = lhId;
        savePrefs(prefs);
        applyLineHeight(lhId);
        panel.querySelectorAll('[data-lh-id]').forEach(function (b) {
          b.setAttribute('aria-pressed', String(b === lhBtn));
        });
      }
    });
  }

  function closePanel(toggle, panel) {
    panel.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.focus();
  }

  /* ═══════════════════════════════════════════════════════════════════
     INIT
     ═══════════════════════════════════════════════════════════════════ */

  function init() {
    var prefs = loadPrefs();

    /* Aplica tudo imediatamente (tema já foi aplicado pelo anti-FOUC no <head>,
       mas font-size, line-height e ADHD features precisam do DOM) */
    applyFontSize(prefs.fontSize);
    applyLineHeight(prefs.lineHeight);

    /* ADHD features precisam do DOM completo */
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        if (prefs.focusMode) applyFocusMode(true);
        if (prefs.chunking)  applyChunking(true);
        buildPanel(prefs);
      });
    } else {
      if (prefs.focusMode) applyFocusMode(true);
      if (prefs.chunking)  applyChunking(true);
      buildPanel(prefs);
    }
  }

  init();

})();
