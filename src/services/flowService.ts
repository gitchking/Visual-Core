
import { getDatabase, saveDatabase } from '@/lib/database';

export const flowService = {
  async getAllFlows() {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM flows ORDER BY created_at DESC');
    const flows = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      flows.push({
        ...row,
        flow_data: JSON.parse(row.flow_data as string)
      });
    }
    stmt.free();
    return flows;
  },

  async saveFlow(flow: { name: string; flow_data: any }) {
    const db = getDatabase();
    
    // Check if a flow with this name already exists
    const existingStmt = db.prepare('SELECT id FROM flows WHERE name = ?');
    existingStmt.bind([flow.name]);
    
    if (existingStmt.step()) {
      // Update existing flow
      const existingFlow = existingStmt.getAsObject();
      existingStmt.free();
      
      const updateStmt = db.prepare(`
        UPDATE flows SET flow_data = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      updateStmt.run([JSON.stringify(flow.flow_data), existingFlow.id]);
      updateStmt.free();
    } else {
      // Create new flow
      existingStmt.free();
      
      const insertStmt = db.prepare(`
        INSERT INTO flows (name, flow_data, user_id)
        VALUES (?, ?, 1)
      `);
      insertStmt.run([flow.name, JSON.stringify(flow.flow_data)]);
      insertStmt.free();
    }
    
    saveDatabase();
  },

  async updateFlow(id: number, updates: { name?: string; flow_data?: any }) {
    const db = getDatabase();
    const setParts = [];
    const values = [];
    
    if (updates.name !== undefined) {
      setParts.push('name = ?');
      values.push(updates.name);
    }
    if (updates.flow_data !== undefined) {
      setParts.push('flow_data = ?');
      values.push(JSON.stringify(updates.flow_data));
    }

    setParts.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    
    const stmt = db.prepare(`UPDATE flows SET ${setParts.join(', ')} WHERE id = ?`);
    stmt.run(values);
    stmt.free();
    saveDatabase();
  }
};
