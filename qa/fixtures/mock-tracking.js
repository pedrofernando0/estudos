/**
 * Mock tracking state injected via page.addInitScript() in tests.
 * Simulates EstudosTracking already initialized with clean state.
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
  window.EstudosTracking = window.__mockTracking;
`;

module.exports = { MOCK_TRACKING_SCRIPT };
