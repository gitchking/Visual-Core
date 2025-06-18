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
      default: return 'border-black bg-white';
    }
  };

  return (
    <div className={`min-w-[300px] p-4 rounded-2xl border-4 border-black shadow-brutal bg-white ${todo.completed ? 'opacity-60' : ''} relative`}>
      {/* Top handle - can receive multiple connections */}
      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ 
          background: '#000', 
          border: '2px solid #000',
          borderRadius: '50%',
          width: '12px',
          height: '12px',
          top: '-6px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10
        }}
        isConnectable={true}
        id="top"
      />
      
      {/* Left handle - can receive multiple connections */}
      <Handle 
        type="target" 
        position={Position.Left} 
        style={{ 
          background: '#000', 
          border: '2px solid #000',
          borderRadius: '50%',
          width: '12px',
          height: '12px',
          left: '-6px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10
        }}
        isConnectable={true}
        id="left"
      />
      
      {/* Right handle - can send multiple connections */}
      <Handle 
        type="source" 
        position={Position.Right} 
        style={{ 
          background: '#000', 
          border: '2px solid #000',
          borderRadius: '50%',
          width: '12px',
          height: '12px',
          right: '-6px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10
        }}
        isConnectable={true}
        id="right"
      />
      
      {/* Content area */}
      <div className="relative z-0">
      {isEditing ? (
        <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            className="font-semibold border-2 border-black rounded-lg"
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task description"
            rows={3}
            className="border-2 border-black rounded-lg"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-3 py-2 border-2 border-black rounded-lg bg-white"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm" className="flex-1 neo-brutal bg-green-500 hover:bg-green-600 text-white">
              <Check size={14} className="mr-1" />
              Save
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm" className="flex-1 neo-brutal">
              <X size={14} className="mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h3 className={`font-bold text-lg ${todo.completed ? 'line-through text-gray-500' : 'text-black'}`}>
              {todo.title}
            </h3>
            <div className="flex gap-1">
              <Button
                onClick={toggleComplete}
                variant="outline"
                size="sm"
                className={`p-2 neo-brutal ${todo.completed ? 'bg-green-100 text-green-600 border-green-500' : 'border-black'}`}
              >
                <Check size={14} />
              </Button>
              <Button
                onClick={handleEdit}
                variant="outline"
                size="sm"
                className="p-2 neo-brutal border-black"
              >
                <Edit2 size={14} />
              </Button>
              <Button
                onClick={handleDelete}
                variant="outline"
                size="sm"
                className="p-2 neo-brutal border-black text-red-600 hover:bg-red-50"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
          
          {todo.description && (
            <p className={`text-gray-700 text-sm ${todo.completed ? 'line-through' : ''}`}>
              {todo.description}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <span className={`px-3 py-1 text-xs rounded-full font-bold border-2 ${
              todo.priority === 'high' ? 'bg-red-100 text-red-700 border-red-500' :
              todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 border-yellow-500' :
              'bg-green-100 text-green-700 border-green-500'
            }`}>
              {todo.priority} priority
            </span>
            <span className={`text-xs font-bold ${
              todo.completed ? 'text-green-600' : 'text-gray-600'
            }`}>
              {todo.completed ? 'Completed' : 'Pending'}
            </span>
          </div>
        </div>
      )}
      </div>
      
      {/* Bottom handle - can send multiple connections */}
      <Handle 
        type="source" 
        position={Position.Bottom} 
        style={{ 
          background: '#000', 
          border: '2px solid #000',
          borderRadius: '50%',
          width: '12px',
          height: '12px',
          bottom: '-6px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10
        }}
        isConnectable={true}
        id="bottom"
      />
    </div>
  );
};

export default TodoNode;
