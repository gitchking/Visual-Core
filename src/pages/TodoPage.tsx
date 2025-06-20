
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Check, X, Edit2, Workflow } from 'lucide-react';
import { todoService } from '@/services/todoService';
import { initDatabase } from '@/lib/database';
import { useStore } from '@/stores/useStore';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const TodoPage = () => {
  const { user } = useAuth();
  const { todos, setTodos, addTodo, updateTodo, deleteTodo } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [newTodo, setNewTodo] = useState({ title: '', description: '', priority: 'medium' });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        await initDatabase();
        const todoData = await todoService.getAllTodos();
        setTodos(todoData as any);
      } catch (error) {
        console.error('Failed to load todos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTodos();
  }, [setTodos]);

  const handleCreateTodo = async () => {
    if (!user) {
      toast.error('Please sign in to create todos');
      return;
    }
    
    if (!newTodo.title.trim()) return;

    try {
      await todoService.createTodo(newTodo);
      addTodo(newTodo as any);
      setNewTodo({ title: '', description: '', priority: 'medium' });
      
      // Reload todos from database
      const todoData = await todoService.getAllTodos();
      setTodos(todoData as any);
      toast.success('Todo created successfully');
    } catch (error) {
      console.error('Failed to create todo:', error);
      toast.error('Failed to create todo');
    }
  };

  const handleToggleComplete = async (id: number, completed: boolean) => {
    if (!user) {
      toast.error('Please sign in to update todos');
      return;
    }
    
    try {
      await todoService.updateTodo(id, { completed: !completed });
      updateTodo(id, { completed: !completed });
      toast.success('Todo updated successfully');
    } catch (error) {
      console.error('Failed to update todo:', error);
      toast.error('Failed to update todo');
    }
  };

  const handleDeleteTodo = async (id: number) => {
    if (!user) {
      toast.error('Please sign in to delete todos');
      return;
    }
    
    try {
      await todoService.deleteTodo(id);
      deleteTodo(id);
      toast.success('Todo deleted successfully');
    } catch (error) {
      console.error('Failed to delete todo:', error);
      toast.error('Failed to delete todo');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-lg text-black">Loading todos...</div>
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
          {!user && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">Please sign in to create, edit, or delete todos.</p>
            </div>
          )}
          <div className="space-y-4">
            <Input
              placeholder="Task title..."
              value={newTodo.title}
              onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
              className="bg-white border-black"
              disabled={!user}
            />
            <Textarea
              placeholder="Task description..."
              value={newTodo.description}
              onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
              className="bg-white border-black"
              disabled={!user}
            />
            <div className="flex gap-4">
              <select
                value={newTodo.priority}
                onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value })}
                className="px-3 py-2 border-2 border-black rounded-lg bg-white text-black disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!user}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <Button 
                onClick={handleCreateTodo} 
                className="flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!user || !newTodo.title.trim()}
                title={!user ? "Please sign in to add tasks" : "Add task"}
              >
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
                      } ${!user ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      disabled={!user}
                      title={!user ? "Please sign in to update todos" : "Toggle completion"}
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
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={!user}
                    title={!user ? "Please sign in to edit todos" : "Edit todo"}
                  >
                    <Edit2 size={14} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDeleteTodo(todo.id)}
                    disabled={!user}
                    title={!user ? "Please sign in to delete todos" : "Delete todo"}
                  >
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
            <p className="text-slate-500">
              {user ? "Create your first task to get started with VisualFlow" : "Sign in to create and manage your tasks"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoPage;
