
import { getDatabase, saveDatabase } from '@/lib/database';

export const threadService = {
  async getAllThreads() {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM threads ORDER BY created_at DESC');
    const threads = [];
    while (stmt.step()) {
      threads.push(stmt.getAsObject());
    }
    stmt.free();
    return threads;
  },

  async createThread(thread: { title: string; content: string; tags?: string; websiteUrl?: string }) {
    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT INTO threads (title, content, tags, website_url, user_id)
      VALUES (?, ?, ?, ?, 1)
    `);
    stmt.run([thread.title, thread.content, thread.tags || '', thread.websiteUrl || '']);
    stmt.free();
    saveDatabase();
  },

  async upvoteThread(id: number) {
    const db = getDatabase();
    const stmt = db.prepare('UPDATE threads SET upvotes = upvotes + 1 WHERE id = ?');
    stmt.run([id]);
    stmt.free();
    saveDatabase();
  }
};
