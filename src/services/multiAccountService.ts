import { STORAGE_KEYS } from '../constants/storageKeys';
import { User } from '../types/models';
import { readJson, writeJson } from '../utils/storage';

const MULTI_SESSIONS_KEY = 'venue_multi_sessions';

export interface AuthSession {
  token: string;
  user: User;
}

export const multiAccountService = {
  getSessions(): AuthSession[] {
    return readJson<AuthSession[]>(MULTI_SESSIONS_KEY, []);
  },

  saveSession(session: AuthSession): void {
    const sessions = this.getSessions();
    const existingIndex = sessions.findIndex(s => String(s.user.id) === String(session.user.id));
    
    if (existingIndex > -1) {
      sessions[existingIndex] = session;
    } else {
      sessions.push(session);
    }
    
    writeJson(MULTI_SESSIONS_KEY, sessions);
  },

  removeSession(userId: string): void {
    const sessions = this.getSessions().filter(s => String(s.user.id) !== String(userId));
    writeJson(MULTI_SESSIONS_KEY, sessions);
  },

  switchToSession(userId: string): boolean {
    const sessions = this.getSessions();
    const session = sessions.find(s => String(s.user.id) === String(userId));
    
    if (session) {
      // Park current session if it exists
      this.addCurrentToMulti();
      writeJson(STORAGE_KEYS.auth, session);
      return true;
    }
    return false;
  },

  addCurrentToMulti(): void {
    const current = readJson<AuthSession | null>(STORAGE_KEYS.auth, null);
    if (current && current.user && current.token) {
      this.saveSession(current);
    }
  },

  clearAllSessions(): void {
    window.localStorage.removeItem(MULTI_SESSIONS_KEY);
    window.localStorage.removeItem(STORAGE_KEYS.auth);
  }
};
