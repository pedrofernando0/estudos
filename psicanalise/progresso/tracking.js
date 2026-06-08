/**
 * tracking.js — Sistema de progresso compartilhado para Estudos de Psicanálise.
 *
 * Uso:
 *   Dashboard (index.html): chama loadProgress() para exibir stats,
 *     renderModules() para timeline de módulos, getNextSession() para CTA.
 *   Sessões HTML: chama saveQuizResult(sessionId, score, total),
 *     saveReflection(sessionId, text), markSessionCompleted(sessionId).
 *
 * Storage: localStorage chave 'estudos-psicanalise-progress'.
 * Estrutura do objeto:
 *   { completedSessions: string[], quizScores: { [sid]: number },
 *     conceptsLearned: string[], streak: number, lastActiveDate: string,
 *     reflections: { [sid]: string }, badges: string[] }
 */

var EstudosTracking = (function() {
  'use strict';

  var STORAGE_KEY = 'estudos-psicanalise-progress';

  // ── SESSION MAP: todas as 36 sessões com módulo, slug e título ──
  // Fonte canônica: .claude/session-scaffold.md (atualizado 2026-06)
  var SESSION_MAP = [
    { id:'S00', mod:0, modSlug:'modulo-0-orientacao', slug:'s00-boas-vindas', title:'Boas-vindas à Jornada' },
    { id:'S01', mod:0, modSlug:'modulo-0-orientacao', slug:'s01-introducao', title:'O que é psicanálise?' },
    { id:'S02', mod:1, modSlug:'modulo-1-fundacoes', slug:'s02-pre-historia', title:'Pré-história da Psicanálise' },
    { id:'S03', mod:1, modSlug:'modulo-1-fundacoes', slug:'s03-o-inconsciente', title:'O Inconsciente: Estrutura e Provas' },
    { id:'S04', mod:1, modSlug:'modulo-1-fundacoes', slug:'s04-sonhos', title:'Sonhos: A Interpretação Freudiana' },
    { id:'S05', mod:1, modSlug:'modulo-1-fundacoes', slug:'s05-sexualidade-infantil', title:'Sexualidade Infantil e Desenvolvimento Psicossexual' },
    { id:'S06', mod:1, modSlug:'modulo-1-fundacoes', slug:'s06-segunda-topica', title:'A Segunda Tópica: Id, Ego e Superego' },
    { id:'S07', mod:1, modSlug:'modulo-1-fundacoes', slug:'s07-pulsao-de-morte', title:'Pulsão de Morte e Compulsão à Repetição' },
    { id:'S08', mod:1, modSlug:'modulo-1-fundacoes', slug:'s08-mal-estar', title:'O Mal-Estar na Civilização' },
    { id:'S09', mod:1, modSlug:'modulo-1-fundacoes', slug:'s09-transferencia', title:'Transferência, Contratransferência e a Relação Analítica' },
    { id:'S10', mod:2, modSlug:'modulo-2-dissidencias', slug:'s10-adler', title:'Alfred Adler: Poder, Inferioridade e Psicologia Individual' },
    { id:'S11', mod:2, modSlug:'modulo-2-dissidencias', slug:'s11-jung', title:'Carl Gustav Jung: Inconsciente Coletivo e Individuação' },
    { id:'S12', mod:2, modSlug:'modulo-2-dissidencias', slug:'s12-klein', title:'Melanie Klein: Posições, Inveja e Mundo Interno' },
    { id:'S13', mod:2, modSlug:'modulo-2-dissidencias', slug:'s13-anna-freud', title:'Anna Freud e o Ego: Mecanismos de Defesa' },
    { id:'S14', mod:2, modSlug:'modulo-2-dissidencias', slug:'s14-ego-psychology', title:'Psicologia do Ego: Hartmann e Erikson' },
    { id:'S15', mod:2, modSlug:'modulo-2-dissidencias', slug:'s15-rank-ferenczi', title:'Otto Rank, Ferenczi e as Dissidências da Técnica' },
    { id:'S16', mod:3, modSlug:'modulo-3-relacoes-objetais', slug:'s16-winnicott', title:'Donald Winnicott: Objeto Transitional e Ambiente Suficientemente Bom' },
    { id:'S17', mod:3, modSlug:'modulo-3-relacoes-objetais', slug:'s17-bion', title:'Wilfred Bion: Pensamento, Continente e Conteúdo' },
    { id:'S18', mod:3, modSlug:'modulo-3-relacoes-objetais', slug:'s18-bowlby', title:'John Bowlby: Apego, Separação e Perda' },
    { id:'S19', mod:3, modSlug:'modulo-3-relacoes-objetais', slug:'s19-fairbairn', title:'Ronald Fairbairn: Ego Libidinal e Relações de Objeto' },
    { id:'S20', mod:3, modSlug:'modulo-3-relacoes-objetais', slug:'s20-balint', title:'Michael Balint e a Falha Básica' },
    { id:'S21', mod:4, modSlug:'modulo-4-lacan', slug:'s21-lacan-introducao', title:'Lacan: O Retorno a Freud e o Estádio do Espelho' },
    { id:'S22', mod:4, modSlug:'modulo-4-lacan', slug:'s22-rsi', title:'Lacan: Simbólico, Real e Imaginário (RSI)' },
    { id:'S23', mod:4, modSlug:'modulo-4-lacan', slug:'s23-significante', title:'Lacan: O Significante, o Outro e o Desejo' },
    { id:'S24', mod:4, modSlug:'modulo-4-lacan', slug:'s24-discursos', title:'Lacan: Os Quatro Discursos' },
    { id:'S25', mod:4, modSlug:'modulo-4-lacan', slug:'s25-gozo-etica', title:'Lacan: Gozo, Objeto a e a Ética da Psicanálise' },
    { id:'S26', mod:4, modSlug:'modulo-4-lacan', slug:'s26-sinthome', title:'Lacan: Sinthome e a Clínica do Real' },
    { id:'S27', mod:5, modSlug:'modulo-5-contemporaneidade', slug:'s27-relacional', title:'Psicanálise Relacional e Intersubjetiva' },
    { id:'S28', mod:5, modSlug:'modulo-5-contemporaneidade', slug:'s28-campo-analitico', title:'Campo Analítico: Ferro e Civitarese' },
    { id:'S29', mod:5, modSlug:'modulo-5-contemporaneidade', slug:'s29-neuropsicanalise', title:'Neuropsicanálise: Freud e o Cérebro' },
    { id:'S30', mod:5, modSlug:'modulo-5-contemporaneidade', slug:'s30-trauma', title:'Trauma, Corpo e Psicossomática' },
    { id:'S31', mod:5, modSlug:'modulo-5-contemporaneidade', slug:'s31-psicanalise-social', title:'Psicanálise e Sociedade: Racismo, Gênero, Classe' },
    { id:'S32', mod:5, modSlug:'modulo-5-contemporaneidade', slug:'s32-psicanalise-brasil', title:'Psicanálise no Brasil: Uma Tradição Viva' },
    { id:'S33', mod:6, modSlug:'modulo-6-sintese', slug:'s33-diagnostico', title:'Diagnóstico do Presente: Sofrimento Contemporâneo' },
    { id:'S34', mod:6, modSlug:'modulo-6-sintese', slug:'s34-corpo-finitude', title:'Corpo, Desejo e Finitude' },
    { id:'S35', mod:6, modSlug:'modulo-6-sintese', slug:'s35-encerramento', title:'Encerramento: O que a Psicanálise Nos Ensinou' }
  ];

  var MODULES = [
    { num:0, title:'Orientação', range:[0,1], count:2 },
    { num:1, title:'Fundações: O Inconsciente Freudiano', range:[2,9], count:8 },
    { num:2, title:'Dissidências e Expansões', range:[10,15], count:6 },
    { num:3, title:'Escola Inglesa e Relações Objetais', range:[16,20], count:5 },
    { num:4, title:'Lacan e o Estruturalismo', range:[21,26], count:6 },
    { num:5, title:'Contemporaneidade', range:[27,32], count:6 },
    { num:6, title:'Síntese e Encerramento', range:[33,35], count:3 }
  ];

  function getDefaultProgress() {
    return {
      completedSessions: [],
      quizScores: {},
      conceptsLearned: [],
      streak: 0,
      lastActiveDate: null,
      reflections: {},
      badges: []
    };
  }

  /** Carrega progresso do localStorage, merge com defaults. */
  function loadProgress() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return getDefaultProgress();
      var data = JSON.parse(raw);
      // Garantir que todas as chaves existam
      var def = getDefaultProgress();
      for (var k in def) {
        if (!(k in data)) data[k] = def[k];
      }
      return data;
    } catch(e) {
      return getDefaultProgress();
    }
  }

  /** Salva progresso no localStorage. */
  function saveProgress(progress) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch(e) {
      console.warn('EstudosTracking: não foi possível salvar progresso', e);
    }
  }

  /** Marca uma sessão como concluída e atualiza streak. */
  function markSessionCompleted(sessionId) {
    var p = loadProgress();
    if (p.completedSessions.indexOf(sessionId) === -1) {
      p.completedSessions.push(sessionId);
    }
    var today = new Date().toISOString().split('T')[0];
    if (p.lastActiveDate === today) {
      // já registrou hoje
    } else if (p.lastActiveDate) {
      var last = new Date(p.lastActiveDate);
      var diff = Math.floor((new Date(today) - last) / 86400000);
      if (diff === 1) {
        p.streak = (p.streak || 0) + 1;
      } else if (diff > 1) {
        p.streak = 1;
      }
    } else {
      p.streak = 1;
    }
    p.lastActiveDate = today;

    // Verificar badges
    p.badges = p.badges || [];
    var completedCount = p.completedSessions.length;
    if (completedCount >= 1 && p.badges.indexOf('primeira-sessao') === -1) {
      p.badges.push('primeira-sessao');
    }
    if (completedCount >= 5 && p.badges.indexOf('5-sessoes') === -1) {
      p.badges.push('5-sessoes');
    }
    if (completedCount >= 10 && p.badges.indexOf('10-sessoes') === -1) {
      p.badges.push('10-sessoes');
    }
    if (completedCount >= 18 && p.badges.indexOf('metade') === -1) {
      p.badges.push('metade');
    }
    if (completedCount >= 36 && p.badges.indexOf('todas-sessoes') === -1) {
      p.badges.push('todas-sessoes');
    }
    if (p.streak >= 7 && p.badges.indexOf('streak-7') === -1) {
      p.badges.push('streak-7');
    }

    saveProgress(p);
  }

  /** Salva resultado de quiz para uma sessão. */
  function saveQuizResult(sessionId, score, total) {
    var p = loadProgress();
    p.quizScores = p.quizScores || {};
    p.quizScores[sessionId] = total > 0 ? Math.round(score / total * 100) : 0;
    saveProgress(p);
  }

  /** Salva reflexão escrita de uma sessão. */
  function saveReflection(sessionId, text) {
    var p = loadProgress();
    p.reflections = p.reflections || {};
    p.reflections[sessionId] = text;
    saveProgress(p);
  }

  /** Retorna a sessão da SESSION_MAP pelo ID. */
  function getSessionInfo(sessionId) {
    for (var i = 0; i < SESSION_MAP.length; i++) {
      if (SESSION_MAP[i].id === sessionId) return SESSION_MAP[i];
    }
    return null;
  }

  /** Retorna o caminho relativo do HTML da sessão (a partir de psicanalise/). */
  function getSessionPath(sessionId) {
    var info = getSessionInfo(sessionId);
    if (!info) return null;
    return 'sessoes/' + info.modSlug + '/' + info.slug + '.html';
  }

  /** Encontra a próxima sessão não concluída. */
  function getNextSession() {
    var p = loadProgress();
    for (var i = 0; i < SESSION_MAP.length; i++) {
      if (p.completedSessions.indexOf(SESSION_MAP[i].id) === -1) {
        return SESSION_MAP[i];
      }
    }
    return null; // todas concluídas!
  }

  /** Calcula progresso por módulo: { completed, total, pct }. */
  function getModuleProgress(modNum) {
    var p = loadProgress();
    var total = 0, completed = 0;
    for (var i = 0; i < SESSION_MAP.length; i++) {
      if (SESSION_MAP[i].mod === modNum) {
        total++;
        if (p.completedSessions.indexOf(SESSION_MAP[i].id) !== -1) completed++;
      }
    }
    return { completed: completed, total: total, pct: total > 0 ? Math.round(completed / total * 100) : 0 };
  }

  /** Calcula média de quiz. */
  function getQuizAverage() {
    var p = loadProgress();
    var scores = p.quizScores || {};
    var keys = Object.keys(scores);
    if (!keys.length) return null;
    var sum = 0;
    for (var i = 0; i < keys.length; i++) sum += scores[keys[i]];
    return Math.round(sum / keys.length);
  }

  // ── Public API ──
  return {
    SESSION_MAP: SESSION_MAP,
    MODULES: MODULES,
    STORAGE_KEY: STORAGE_KEY,
    loadProgress: loadProgress,
    saveProgress: saveProgress,
    markSessionCompleted: markSessionCompleted,
    saveQuizResult: saveQuizResult,
    saveReflection: saveReflection,
    getSessionInfo: getSessionInfo,
    getSessionPath: getSessionPath,
    getNextSession: getNextSession,
    getModuleProgress: getModuleProgress,
    getQuizAverage: getQuizAverage
  };
})();
