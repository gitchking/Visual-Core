import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Check, X, Edit2, Workflow } from 'lucide-react';
import { todoService } from '@/services/todoService';
import { initDatabase } from '@/lib/database';
import { useStore } from '@/stores/useStore';

const TodoPage = () => {
  const { todos, setTodos, addTodo, updateTodo, deleteTodo } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTodo, setNewTodo] = useState({ title: '', description: '', priority: 'medium' });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        setError(null);
        setIsLoading(true);
        console.log('Initializing database...');
        await initDatabase();
        console.log('Loading todos...');
        const todoData = await todoService.getAllTodos();
        console.log('Todos loaded successfully:', todoData);
        setTodos(todoData as any);
      } catch (error) {
        console.error('Failed to load todos:', error);
        setError(error instanceof Error ? error.message : 'Failed to load todos');
      } finally {
        setIsLoading(false);
      }
    };

    loadTodos();
  }, [setTodos]);

  const handleCreateTodo = async () => {
    if (!newTodo.title.trim()) return;

    try {
      await todoService.createTodo(newTodo);
      addTodo(newTodo as any);
      setNewTodo({ title: '', description: '', priority: 'medium' });
      
      // Reload todos from database
      const todoData = await todoService.getAllTodos();
      setTodos(todoData as any);
    } catch (error) {
      console.error('Failed to create todo:', error);
    }
  };

  const handleToggleComplete = async (id: number, completed: boolean) => {
    try {
      await todoService.updateTodo(id, { completed: !completed });
      updateTodo(id, { completed: !completed });
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await todoService.deleteTodo(id);
      deleteTodo(id);
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-lg text-black">Loading todos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2 text-black">Todo Flow</h1>
          <p className="text-slate-600">Manage your tasks and convert them to visual flows</p>
        </div>

        {/* Add New Todo */}
        <div className="bg-white rounded-2xl p-6 neo-card mb-8">
          <h2 className="text-xl font-semibold mb-4 text-black">Add New Task</h2>
          <div className="space-y-4">
            <Input
              placeholder="Task title..."
              value={newTodo.title}
              onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
              className="bg-white border-black"
            />
            <Textarea
              placeholder="Task description..."
              value={newTodo.description}
              onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
              className="bg-white border-black"
            />
            <div className="flex gap-4">
              <select
                value={newTodo.priority}
                onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value })}
                className="px-3 py-2 border-2 border-black rounded-lg bg-white text-black"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <Button onClick={handleCreateTodo} className="flex items-center gap-2">
                <Plus size={16} />
                Add Task
              </Button>
            </div>
          </div>
        </div>

        {/* Todo List */}
        <div className="space-y-4">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={`bg-white rounded-xl p-6 neo-card border-l-4 ${
                todo.priority === 'high' ? 'border-red-500' :
                todo.priority === 'medium' ? 'border-purple-500' : 'border-green-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <button
                      onClick={() => handleToggleComplete(todo.id, todo.completed)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        todo.completed ? 'bg-green-500 border-green-500' : 'border-gray-400'
                      }`}
                    >
                      {todo.completed && <Check size={14} className="text-white" />}
                    </button>
                    <h3 className={`font-semibold text-black ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                      {todo.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      todo.priority === 'high' ? 'bg-red-100 text-red-700' :
                      todo.priority === 'medium' ? 'bg-purple-100 text-purple-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {todo.priority}
                    </span>
                  </div>
                  {todo.description && (
                    <p className={`text-slate-600 ml-9 ${todo.completed ? 'line-through' : ''}`}>
                      {todo.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit2 size={14} />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteTodo(todo.id)}>
                    <X size={14} />
                  </Button>
                  <Button variant="secondary" size="sm">
                    <Workflow size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {todos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">
              <Plus size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No tasks yet</h3>
            <p className="text-slate-500">Create your first task to get started with VisualFlow</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoPage;
