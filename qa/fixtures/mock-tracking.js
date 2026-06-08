/**
 * Mock tracking state injected via page.addInitScript() in tests.
 * Uses Object.defineProperty to prevent overwrite by the real tracking.js.
 */

const MOCK_TRACKING_SCRIPT = `
  window.__mockTracking = {
    saveQuizResult: function(id, score, total) {
      window.__quizSaved = { id, score, total };
    },
    markSessionCompleted: function(id) {
      window.__sessionCompleted = id;
    },
    saveReflection: function(id, text) {
      window.__reflectionSaved = { id, text };
    },
    loadProgress: function() {
      return { reflections: {}, completedSessions: [] };
    }
  };
  Object.defineProperty(window, 'EstudosTracking', {
    value: window.__mockTracking,
    writable: false,
    configurable: false
  });
`;

module.exports = { MOCK_TRACKING_SCRIPT };
