
import { getDatabase, saveDatabase } from '@/lib/database';

export const todoService = {
  async getAllTodos() {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM todos ORDER BY created_at DESC');
    const todos = [];
    while (stmt.step()) {
      todos.push(stmt.getAsObject());
    }
    stmt.free();
    return todos;
  },

  async createTodo(todo: { title: string; description: string; priority: string }) {
    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT INTO todos (title, description, priority, user_id)
      VALUES (?, ?, ?, 1)
    `);
    stmt.run([todo.title, todo.description, todo.priority]);
    stmt.free();
    saveDatabase();
  },

  async updateTodo(id: number, updates: { title?: string; description?: string; completed?: boolean; priority?: string }) {
    const db = getDatabase();
    const setParts = [];
    const values = [];
    
    if (updates.title !== undefined) {
      setParts.push('title = ?');
      values.push(updates.title);
    }
    if (updates.description !== undefined) {
      setParts.push('description = ?');
      values.push(updates.description);
    }
    if (updates.completed !== undefined) {
      setParts.push('completed = ?');
      values.push(updates.completed ? 1 : 0);
    }
    if (updates.priority !== undefined) {
      setParts.push('priority = ?');
      values.push(updates.priority);
    }

    values.push(id);
    
    const stmt = db.prepare(`UPDATE todos SET ${setParts.join(', ')} WHERE id = ?`);
    stmt.run(values);
    stmt.free();
    saveDatabase();
  },

  async deleteTodo(id: number) {
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM todos WHERE id = ?');
    stmt.run([id]);
    stmt.free();
    saveDatabase();
  }
};
