
import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Check, X, Edit2, Trash2 } from 'lucide-react';

interface TodoNodeProps {
  data: {
    todo: {
      id: number;
      title: string;
      description: string;
      completed: boolean;
      priority: string;
    };
    onUpdate: (id: number, updates: any) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
  };
}

const TodoNode: React.FC<TodoNodeProps> = ({ data }) => {
  const { todo, onUpdate, onDelete } = data;
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);
  const [priority, setPriority] = useState(todo.priority);

  const handleSave = async () => {
    await onUpdate(todo.id, {
      title,
      description,
      priority,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(todo.title);
    setDescription(todo.description);
    setPriority(todo.priority);
    setIsEditing(false);
  };

  const toggleComplete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent node from being dragged when clicking
    await onUpdate(todo.id, {
      completed: !todo.completed,
    });
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent node from being dragged when clicking
    await onDelete(todo.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent node from being dragged when clicking
    setIsEditing(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-300 bg-white';
    }
  };

  return (
    <div className={`min-w-[300px] p-4 rounded-lg border-2 shadow-lg ${getPriorityColor(todo.priority)} ${todo.completed ? 'opacity-60' : ''}`}>
      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ background: '#555' }}
        isConnectable={true}
      />
      
      {isEditing ? (
        <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            className="font-semibold"
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task description"
            rows={3}
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm" className="flex-1">
              <Check size={14} className="mr-1" />
              Save
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm" className="flex-1">
              <X size={14} className="mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h3 className={`font-semibold text-lg ${todo.completed ? 'line-through text-gray-500' : ''}`}>
              {todo.title}
            </h3>
            <div className="flex gap-1">
              <Button
                onClick={toggleComplete}
                variant="outline"
                size="sm"
                className={`p-2 ${todo.completed ? 'bg-green-100 text-green-600' : ''}`}
              >
                <Check size={14} />
              </Button>
              <Button
                onClick={handleEdit}
                variant="outline"
                size="sm"
                className="p-2"
              >
                <Edit2 size={14} />
              </Button>
              <Button
                onClick={handleDelete}
                variant="outline"
                size="sm"
                className="p-2 text-red-600 hover:bg-red-50"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
          
          {todo.description && (
            <p className={`text-gray-600 text-sm ${todo.completed ? 'line-through' : ''}`}>
              {todo.description}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <span className={`px-2 py-1 text-xs rounded-full ${
              todo.priority === 'high' ? 'bg-red-100 text-red-600' :
              todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
              'bg-green-100 text-green-600'
            }`}>
              {todo.priority} priority
            </span>
            <span className={`text-xs ${
              todo.completed ? 'text-green-600 font-medium' : 'text-gray-500'
            }`}>
              {todo.completed ? 'Completed' : 'Pending'}
            </span>
          </div>
        </div>
      )}
      
      <Handle 
        type="source" 
        position={Position.Bottom} 
        style={{ background: '#555' }}
        isConnectable={true}
      />
    </div>
  );
};

export default TodoNode;
