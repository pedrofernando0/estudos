/**
 * Estudos — Shared session script
 * Loaded by all session HTML pages and the session template.
 *
 * Requires these globals set BEFORE loading this script:
 *   var SESSION_ID = 'S00';
 *   var SESSION_CORRECT_MESSAGES = ['...', '...'];
 *
 * Also requires tracking.js to be loaded before this script.
 */
(function() {
  'use strict';

  if (typeof SESSION_ID === 'undefined') {
    console.warn('SESSION_ID not set — session script disabled');
    return;
  }

  var totalQuestions = document.querySelectorAll('.quiz-question').length;
  var answeredCorrect = 0;

  // ─── Reading Progress Bar ───
  var progressBar = document.getElementById('reading-progress');
  function updateProgress() {
    if (!progressBar) return;
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
    progressBar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // ─── Keyboard Navigation ───
  document.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
    if (e.key === 'ArrowRight' && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
      var nextLink = document.querySelector('.session-nav a[rel="next"]');
      if (nextLink && nextLink.href) window.location.href = nextLink.href;
    }
    if (e.key === 'ArrowLeft' && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
      var prevLink = document.querySelector('.session-nav a[rel="prev"]');
      if (prevLink && prevLink.href) window.location.href = prevLink.href;
    }
  });

  // ─── Restore previous reflection ───
  if (typeof EstudosTracking !== 'undefined') {
    var prev = EstudosTracking.loadProgress();
    var prevRefl = (prev.reflections || {})[SESSION_ID];
    if (prevRefl) {
      var ta = document.querySelector('.reflexao textarea');
      if (ta && !ta.value) ta.value = prevRefl;
    }
  }

  // ─── Quiz ───
  var correctMessages = typeof SESSION_CORRECT_MESSAGES !== 'undefined'
    ? SESSION_CORRECT_MESSAGES
    : [];

  document.querySelectorAll('.quiz-option').forEach(function(opt) {
    opt.addEventListener('click', function() {
      var question = this.closest('.quiz-question');
      if (question.dataset.answered) return;
      question.dataset.answered = '1';

      var correct = question.dataset.correct;
      var chosen = this.dataset.opt;
      var feedback = question.querySelector('.quiz-feedback');
      var isCorrect = chosen === correct;
      if (isCorrect) answeredCorrect++;

      question.querySelectorAll('.quiz-option').forEach(function(o) {
        o.style.pointerEvents = 'none';
        if (o.dataset.opt === correct) o.classList.add('correct');
        if (o.dataset.opt === chosen && !isCorrect) o.classList.add('incorrect');
      });

      var correctIdx = parseInt(correct);
      feedback.textContent = isCorrect
        ? (correctMessages[correctIdx] || '✓ Correto!')
        : '✗ Incorreto. A resposta certa está destacada em verde.';
      feedback.classList.add('show', isCorrect ? 'correct' : 'incorrect');

      var allAnswered = document.querySelectorAll('.quiz-question[data-answered]').length === totalQuestions;
      if (allAnswered && typeof EstudosTracking !== 'undefined') {
        EstudosTracking.saveQuizResult(SESSION_ID, answeredCorrect, totalQuestions);
        EstudosTracking.markSessionCompleted(SESSION_ID);
      }
    });

    opt.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.click(); }
    });
  });

  // ─── Reflexão ───
  window.salvarReflexao = function() {
    var textarea = document.querySelector('.reflexao textarea');
    var msg = document.querySelector('.reflexao-salva');
    if (textarea.value.trim()) {
      if (typeof EstudosTracking !== 'undefined') {
        EstudosTracking.saveReflection(SESSION_ID, textarea.value);
        EstudosTracking.markSessionCompleted(SESSION_ID);
      } else {
        localStorage.setItem('reflexao-' + SESSION_ID, textarea.value);
      }
      msg.style.display = 'block';
      setTimeout(function() { msg.style.display = 'none'; }, 3000);
    }
  };
})();
