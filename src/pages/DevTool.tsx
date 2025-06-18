
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getDatabase, initDatabase } from '@/lib/database';
import { Database, Users, MessageSquare, Download } from 'lucide-react';

const DevTool = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [dbData, setDbData] = useState<any>(null);

  const handleLogin = () => {
    if (password === 'Daman@2005') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid password');
    }
  };

  const loadDatabaseData = async () => {
    try {
      await initDatabase();
      const db = getDatabase();
      
      const data: any = {};
      
      // Get todos
      const todosStmt = db.prepare('SELECT * FROM todos');
      data.todos = [];
      while (todosStmt.step()) {
        data.todos.push(todosStmt.getAsObject());
      }
      todosStmt.free();

      // Get threads
      const threadsStmt = db.prepare('SELECT * FROM threads');
      data.threads = [];
      while (threadsStmt.step()) {
        data.threads.push(threadsStmt.getAsObject());
      }
      threadsStmt.free();

      // Get flows
      const flowsStmt = db.prepare('SELECT * FROM flows');
      data.flows = [];
      while (flowsStmt.step()) {
        data.flows.push(flowsStmt.getAsObject());
      }
      flowsStmt.free();

      setDbData(data);
    } catch (error) {
      console.error('Failed to load database data:', error);
    }
  };

  const exportDatabase = () => {
    const db = getDatabase();
    const data = db.export();
    const blob = new Blob([data], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'visualflow-database.db';
    a.click();
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadDatabaseData();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h1 className="text-2xl font-bold mb-6 text-center">DevTool Access</h1>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <Button onClick={handleLogin} className="w-full">
              Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
            <Database className="text-blue-600" />
            DevTool Dashboard
          </h1>
          <div className="flex gap-4">
            <Button onClick={loadDatabaseData} variant="outline">
              Refresh Data
            </Button>
            <Button onClick={exportDatabase} variant="outline">
              <Download size={16} className="mr-2" />
              Export Database
            </Button>
          </div>
        </div>

        {dbData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Todos */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Users className="text-green-600" />
                Todos ({dbData.todos?.length || 0})
              </h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {dbData.todos?.map((todo: any) => (
                  <div key={todo.id} className="p-2 border rounded">
                    <div className="font-medium">{todo.title}</div>
                    <div className="text-sm text-gray-600">
                      Status: {todo.completed ? 'Completed' : 'Pending'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Threads */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="text-purple-600" />
                Threads ({dbData.threads?.length || 0})
              </h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {dbData.threads?.map((thread: any) => (
                  <div key={thread.id} className="p-2 border rounded">
                    <div className="font-medium">{thread.title}</div>
                    <div className="text-sm text-gray-600">
                      Upvotes: {thread.upvotes}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Flows */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Database className="text-orange-600" />
                Flows ({dbData.flows?.length || 0})
              </h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {dbData.flows?.map((flow: any) => (
                  <div key={flow.id} className="p-2 border rounded">
                    <div className="font-medium">{flow.name}</div>
                    <div className="text-sm text-gray-600">
                      Created: {new Date(flow.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DevTool;
