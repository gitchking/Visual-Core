
import { getDatabase, saveDatabase } from '@/lib/database';

export const threadService = {
  async getAllThreads() {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM threads ORDER BY created_at DESC');
    const threads = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      threads.push({
        ...row,
        tags: row.tags ? JSON.parse(row.tags as string) : []
      });
    }
    stmt.free();
    return threads;
  },

  async createThread(thread: { title: string; content: string; tags: string[] }) {
    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT INTO threads (title, content, tags, user_id)
      VALUES (?, ?, ?, 1)
    `);
    stmt.run([thread.title, thread.content, JSON.stringify(thread.tags)]);
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
