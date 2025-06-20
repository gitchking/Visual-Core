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

  async getFlowById(id: number) {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM flows WHERE id = ?');
    stmt.run([id]);
    const row = stmt.getAsObject();
    stmt.free();
    
    if (row) {
      return {
        ...row,
        flow_data: JSON.parse(row.flow_data as string)
      };
    }
    return null;
  },

  async getMostRecentFlow() {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM flows ORDER BY created_at DESC LIMIT 1');
    stmt.run();
    const row = stmt.getAsObject();
    stmt.free();
    
    console.log('🔍 Database query result:', row);
    
    if (row) {
      const flow = {
        ...row,
        flow_data: JSON.parse(row.flow_data as string)
      };
      console.log('✅ Retrieved flow from database:', flow);
      return flow;
    }
    console.log('⏭️ No flow found in database');
    return null;
  },

  async saveFlow(flow: { name: string; flow_data: any }) {
    console.log('💾 Saving flow to database:', { name: flow.name, nodes: flow.flow_data.nodes?.length, edges: flow.flow_data.edges?.length });
    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT INTO flows (name, flow_data, user_id)
      VALUES (?, ?, 1)
    `);
    stmt.run([flow.name, JSON.stringify(flow.flow_data)]);
    stmt.free();
    saveDatabase();
    console.log('✅ Flow saved to database');
  },

  async updateFlow(id: number, updates: { name?: string; flow_data?: any }) {
    console.log('🔄 Updating flow in database:', { id, name: updates.name, nodes: updates.flow_data?.nodes?.length, edges: updates.flow_data?.edges?.length });
    const db = getDatabase();
    const setParts = [];
    const values = [];
    
    if (updates.name !== undefined) {
      setParts.push('name = ?');
      values.push(updates.name);
    }
    if (updates.flow_data !== undefined) {
      setParts.push('flow_data = ?');
      const flowDataJson = JSON.stringify(updates.flow_data);
      console.log('📄 Updated flow data JSON length:', flowDataJson.length);
      values.push(flowDataJson);
    }

    values.push(id);
    
    const stmt = db.prepare(`UPDATE flows SET ${setParts.join(', ')} WHERE id = ?`);
    stmt.run(values);
    stmt.free();
    saveDatabase();
    console.log('✅ Flow updated in database');
  }
};
