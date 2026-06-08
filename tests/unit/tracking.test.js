/**
 * Unit tests for tracking.js
 *
 * Covers: loadProgress, saveProgress, markSessionCompleted,
 * saveQuizResult, saveReflection, getSessionInfo, getSessionPath,
 * getNextSession, getModuleProgress, getQuizAverage
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load tracking.js into global scope via indirect eval (sloppy mode)
const code = readFileSync(
  path.resolve(__dirname, '../../psicanalise/progresso/tracking.js'),
  'utf-8'
);
const indirectEval = eval;
indirectEval(code);

// Now EstudosTracking should be accessible via globalThis (var in sloppy mode)
const T = globalThis.EstudosTracking;

function clearStorage() {
  localStorage.clear();
}

describe('EstudosTracking', () => {
  beforeEach(() => {
    clearStorage();
  });

  // ─── Module structure ───
  describe('structure', () => {
    it('should expose SESSION_MAP with 36 entries', () => {
      expect(T.SESSION_MAP).toHaveLength(36);
    });

    it('should expose MODULES with 7 entries', () => {
      expect(T.MODULES).toHaveLength(7);
    });

    it('should expose STORAGE_KEY', () => {
      expect(T.STORAGE_KEY).toBe('estudos-psicanalise-progress');
    });
  });

  // ─── loadProgress ───
  describe('loadProgress', () => {
    it('should return default progress when localStorage is empty', () => {
      const p = T.loadProgress();
      expect(p.completedSessions).toEqual([]);
      expect(p.quizScores).toEqual({});
      expect(p.conceptsLearned).toEqual([]);
      expect(p.streak).toBe(0);
      expect(p.lastActiveDate).toBeNull();
      expect(p.reflections).toEqual({});
      expect(p.badges).toEqual([]);
    });

    it('should return default progress when localStorage is corrupted', () => {
      localStorage.setItem(T.STORAGE_KEY, 'not-json{{{');
      const p = T.loadProgress();
      expect(p.completedSessions).toEqual([]);
    });

    it('should merge missing keys into existing data', () => {
      localStorage.setItem(T.STORAGE_KEY, JSON.stringify({ completedSessions: ['S00'] }));
      const p = T.loadProgress();
      expect(p.completedSessions).toEqual(['S00']);
      expect(p.quizScores).toEqual({});
      expect(p.badges).toEqual([]);
    });

    it('should load valid progress from localStorage', () => {
      const data = {
        completedSessions: ['S00', 'S01'],
        quizScores: { S00: 100, S01: 50 },
        conceptsLearned: ['inconsciente'],
        streak: 3,
        lastActiveDate: '2026-06-07',
        reflections: { S00: 'Boa sessão!' },
        badges: ['primeira-sessao']
      };
      localStorage.setItem(T.STORAGE_KEY, JSON.stringify(data));
      const p = T.loadProgress();
      expect(p.completedSessions).toEqual(['S00', 'S01']);
      expect(p.quizScores).toEqual({ S00: 100, S01: 50 });
      expect(p.streak).toBe(3);
      expect(p.badges).toContain('primeira-sessao');
    });
  });

  // ─── markSessionCompleted ───
  describe('markSessionCompleted', () => {
    it('should add session to completedSessions', () => {
      T.markSessionCompleted('S00');
      const p = T.loadProgress();
      expect(p.completedSessions).toContain('S00');
    });

    it('should not duplicate session in completedSessions', () => {
      T.markSessionCompleted('S00');
      T.markSessionCompleted('S00');
      const p = T.loadProgress();
      expect(p.completedSessions.filter(s => s === 'S00')).toHaveLength(1);
    });

    it('should award "primeira-sessao" badge on first completion', () => {
      T.markSessionCompleted('S00');
      const p = T.loadProgress();
      expect(p.badges).toContain('primeira-sessao');
    });

    it('should award "5-sessoes" badge after 5 completions', () => {
      for (let i = 0; i <= 4; i++) {
        T.markSessionCompleted('S0' + i);
      }
      const p = T.loadProgress();
      expect(p.badges).toContain('5-sessoes');
    });

    it('should award "10-sessoes" badge after 10 completions', () => {
      for (let i = 0; i <= 9; i++) {
        T.markSessionCompleted('S' + String(i).padStart(2, '0'));
      }
      const p = T.loadProgress();
      expect(p.badges).toContain('10-sessoes');
    });

    it('should award "metade" badge after 18 completions', () => {
      for (let i = 0; i <= 17; i++) {
        T.markSessionCompleted('S' + String(i).padStart(2, '0'));
      }
      const p = T.loadProgress();
      expect(p.badges).toContain('metade');
    });

    it('should award "todas-sessoes" badge after all 36', () => {
      for (let i = 0; i <= 35; i++) {
        T.markSessionCompleted('S' + String(i).padStart(2, '0'));
      }
      const p = T.loadProgress();
      expect(p.badges).toContain('todas-sessoes');
    });

    it('should set streak to 1 on first session', () => {
      T.markSessionCompleted('S00');
      const p = T.loadProgress();
      expect(p.streak).toBe(1);
    });

    it('should increment streak on consecutive days', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      // Simulate yesterday's progress
      const progress = T.loadProgress();
      progress.lastActiveDate = yesterdayStr;
      progress.streak = 1;
      T.saveProgress(progress);

      T.markSessionCompleted('S01');
      const p = T.loadProgress();
      expect(p.streak).toBe(2);
    });

    it('should reset streak if gap > 1 day', () => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      const oldDate = threeDaysAgo.toISOString().split('T')[0];

      const progress = T.loadProgress();
      progress.lastActiveDate = oldDate;
      progress.streak = 5;
      T.saveProgress(progress);

      T.markSessionCompleted('S01');
      const p = T.loadProgress();
      expect(p.streak).toBe(1);
    });
  });

  // ─── saveQuizResult ───
  describe('saveQuizResult', () => {
    it('should save quiz score as percentage', () => {
      T.saveQuizResult('S00', 2, 3);
      const p = T.loadProgress();
      expect(p.quizScores['S00']).toBe(67); // Math.round(2/3 * 100)
    });

    it('should save 0 when score is 0', () => {
      T.saveQuizResult('S00', 0, 3);
      const p = T.loadProgress();
      expect(p.quizScores['S00']).toBe(0);
    });

    it('should save 100 when perfect score', () => {
      T.saveQuizResult('S00', 3, 3);
      const p = T.loadProgress();
      expect(p.quizScores['S00']).toBe(100);
    });

    it('should handle 0 total gracefully', () => {
      T.saveQuizResult('S00', 0, 0);
      const p = T.loadProgress();
      expect(p.quizScores['S00']).toBe(0);
    });
  });

  // ─── saveReflection ───
  describe('saveReflection', () => {
    it('should save reflection text', () => {
      T.saveReflection('S00', 'Reflexão sobre o inconsciente');
      const p = T.loadProgress();
      expect(p.reflections['S00']).toBe('Reflexão sobre o inconsciente');
    });
  });

  // ─── getSessionInfo ───
  describe('getSessionInfo', () => {
    it('should return session info for valid ID', () => {
      const info = T.getSessionInfo('S00');
      expect(info).toBeDefined();
      expect(info.id).toBe('S00');
      expect(info.mod).toBe(0);
      expect(info.title).toBe('Boas-vindas à Jornada');
    });

    it('should return null for invalid ID', () => {
      expect(T.getSessionInfo('S99')).toBeNull();
    });

    it('should return correct module for S02', () => {
      const info = T.getSessionInfo('S02');
      expect(info.mod).toBe(1);
      expect(info.modSlug).toBe('modulo-1-fundacoes');
    });

    it('should return info for last session S35', () => {
      const info = T.getSessionInfo('S35');
      expect(info).toBeDefined();
      expect(info.title).toBe('Síntese Final');
    });
  });

  // ─── getSessionPath ───
  describe('getSessionPath', () => {
    it('should return correct relative path', () => {
      expect(T.getSessionPath('S00')).toBe('sessoes/modulo-0-orientacao/s00-boas-vindas.html');
      expect(T.getSessionPath('S02')).toBe('sessoes/modulo-1-fundacoes/s02-pre-historia.html');
    });

    it('should return null for invalid session', () => {
      expect(T.getSessionPath('S99')).toBeNull();
    });
  });

  // ─── getNextSession ───
  describe('getNextSession', () => {
    it('should return S00 when nothing is completed', () => {
      const next = T.getNextSession();
      expect(next.id).toBe('S00');
    });

    it('should return S01 when S00 is completed', () => {
      T.markSessionCompleted('S00');
      const next = T.getNextSession();
      expect(next.id).toBe('S01');
    });

    it('should return S02 when S00 and S01 are completed', () => {
      T.markSessionCompleted('S00');
      T.markSessionCompleted('S01');
      const next = T.getNextSession();
      expect(next.id).toBe('S02');
    });

    it('should return null when all 36 sessions are completed', () => {
      for (let i = 0; i <= 35; i++) {
        T.markSessionCompleted('S' + String(i).padStart(2, '0'));
      }
      expect(T.getNextSession()).toBeNull();
    });
  });

  // ─── getModuleProgress ───
  describe('getModuleProgress', () => {
    it('should return correct progress for empty module', () => {
      const mp = T.getModuleProgress(0);
      expect(mp.total).toBe(2);
      expect(mp.completed).toBe(0);
      expect(mp.pct).toBe(0);
    });

    it('should return correct progress after completing S00', () => {
      T.markSessionCompleted('S00');
      const mp = T.getModuleProgress(0);
      expect(mp.total).toBe(2);
      expect(mp.completed).toBe(1);
      expect(mp.pct).toBe(50);
    });

    it('should return 100% for fully completed module', () => {
      T.markSessionCompleted('S00');
      T.markSessionCompleted('S01');
      const mp = T.getModuleProgress(0);
      expect(mp.pct).toBe(100);
    });

    it('should return 8 total for module 1 (Fundações)', () => {
      const mp = T.getModuleProgress(1);
      expect(mp.total).toBe(8);
    });
  });

  // ─── getQuizAverage ───
  describe('getQuizAverage', () => {
    it('should return null when no quizzes taken', () => {
      expect(T.getQuizAverage()).toBeNull();
    });

    it('should return correct average for one quiz', () => {
      T.saveQuizResult('S00', 3, 3);
      expect(T.getQuizAverage()).toBe(100);
    });

    it('should return correct average for multiple quizzes', () => {
      T.saveQuizResult('S00', 3, 3);   // 100
      T.saveQuizResult('S01', 1, 2);   // 50
      T.saveQuizResult('S02', 0, 3);   // 0
      expect(T.getQuizAverage()).toBe(50);
    });
  });
});
