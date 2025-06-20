
import React, { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  ConnectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Plus, RefreshCw, Share } from 'lucide-react';
import { flowService } from '@/services/flowService';
import { todoService } from '@/services/todoService';
import { initDatabase } from '@/lib/database';
import { useStore } from '@/stores/useStore';
import TodoNode from '@/components/flow/TodoNode';
import ShareDialog from '@/components/flow/ShareDialog';
import { toast } from 'sonner';

const nodeTypes = {
  todo: TodoNode,
};

const FlowEditor = () => {
  const { todos, setTodos } = useStore();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [flowName, setFlowName] = useState('Todo Flow');
  const [isLoading, setIsLoading] = useState(true);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Convert todos to flow nodes
  const todosToNodes = (todoList: any[]): Node[] => {
    return todoList.map((todo, index) => ({
      id: `todo-${todo.id}`,
      type: 'todo',
      position: { x: 250 + (index % 3) * 300, y: 100 + Math.floor(index / 3) * 150 },
      data: {
        todo,
        onUpdate: handleTodoUpdate,
        onDelete: handleTodoDelete,
      },
    }));
  };

  // Load todos and convert to nodes
  const loadTodos = async () => {
    try {
      await initDatabase();
      const todoData = await todoService.getAllTodos();
      setTodos(todoData as any);
      const todoNodes = todosToNodes(todoData as any);
      setNodes(todoNodes);
    } catch (error) {
      console.error('Failed to load todos:', error);
      toast.error('Failed to load todos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  // Auto-save functionality - triggers when nodes or edges change
  useEffect(() => {
    if (!isLoading && nodes.length > 0) {
      const timeoutId = setTimeout(async () => {
        await saveFlow(true); // Silent auto-save
      }, 2000); // Auto-save after 2 seconds of inactivity
      
      return () => clearTimeout(timeoutId);
    }
  }, [nodes, edges, flowName, isLoading]);

  // Update todo without changing node position
  const handleTodoUpdate = async (todoId: number, updates: any) => {
    try {
      await todoService.updateTodo(todoId, updates);
      
      // Update the local state immediately without reloading
      const updatedTodos = todos.map((todo: any) => 
        todo.id === todoId ? { ...todo, ...updates } : todo
      );
      setTodos(updatedTodos);
      
      // Update nodes while preserving positions
      setNodes((currentNodes) => 
        currentNodes.map((node) => 
          node.id === `todo-${todoId}` 
            ? {
                ...node,
                data: {
                  ...node.data,
                  todo: { ...node.data.todo, ...updates }
                }
              }
            : node
        )
      );
      
      toast.success('Todo updated successfully');
    } catch (error) {
      console.error('Failed to update todo:', error);
      toast.error('Failed to update todo');
    }
  };

  // Delete todo and refresh nodes
  const handleTodoDelete = async (todoId: number) => {
    try {
      await todoService.deleteTodo(todoId);
      await loadTodos(); // Reload to sync changes
      toast.success('Todo deleted successfully');
    } catch (error) {
      console.error('Failed to delete todo:', error);
      toast.error('Failed to delete todo');
    }
  };

  const onConnect = useCallback(
    (params: Connection) => {
      // Ensure connection has both source and target
      if (params.source && params.target) {
        setEdges((eds) => addEdge({
          ...params,
          id: `edge-${params.source}-${params.target}`,
          type: 'smoothstep',
          animated: true,
        }, eds));
      }
    },
    [setEdges],
  );

  const addNewTodo = async () => {
    try {
      const newTodo = {
        title: `New Task ${todos.length + 1}`,
        description: 'Click to edit this task',
        priority: 'medium'
      };
      await todoService.createTodo(newTodo);
      await loadTodos(); // Reload to show new todo
      toast.success('New todo created');
    } catch (error) {
      console.error('Failed to create todo:', error);
      toast.error('Failed to create todo');
    }
  };

  const refreshTodos = () => {
    loadTodos();
    toast.success('Todos refreshed');
  };

  const saveFlow = async (silent = false) => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      await flowService.saveFlow({
        name: flowName,
        flow_data: { nodes, edges }
      });
      setLastSaved(new Date());
      if (!silent) {
        toast.success('Flow saved successfully');
      }
    } catch (error) {
      console.error('Failed to save flow:', error);
      if (!silent) {
        toast.error('Failed to save flow');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-lg neo-card p-8">Loading todos...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="bg-white border-b-2 border-black p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="flex flex-col gap-1">
            <Input
              value={flowName}
              onChange={(e) => setFlowName(e.target.value)}
              className="w-full sm:w-64 neo-brutal text-sm sm:text-base"
            />
            {lastSaved && (
              <span className="text-xs text-gray-600">
                Auto-saved at {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Button 
              onClick={addNewTodo} 
              className="neo-brutal-pink bg-pink-accent hover:bg-pink-accent text-white font-bold text-xs sm:text-sm px-3 sm:px-4 py-2"
            >
              <Plus size={14} className="mr-1 sm:mr-2" />
              Add Todo
            </Button>
            <Button 
              onClick={refreshTodos} 
              className="neo-brutal-blue bg-blue-accent hover:bg-blue-accent text-white font-bold text-xs sm:text-sm px-3 sm:px-4 py-2"
            >
              <RefreshCw size={14} className="mr-1 sm:mr-2" />
              Refresh
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button 
            onClick={() => setIsShareDialogOpen(true)} 
            className="neo-brutal bg-white hover:bg-gray-100 text-black font-bold text-xs sm:text-sm px-3 sm:px-4 py-2 flex-1 sm:flex-none"
          >
            <Share size={14} className="mr-1 sm:mr-2" />
            Share
          </Button>
          <Button 
            onClick={() => saveFlow()} 
            disabled={isSaving}
            className="neo-brutal-purple bg-purple-accent hover:bg-purple-accent text-white font-bold text-xs sm:text-sm px-3 sm:px-4 py-2 flex-1 sm:flex-none"
          >
            <Save size={14} className="mr-1 sm:mr-2" />
            {isSaving ? 'Saving...' : 'Save Now'}
          </Button>
        </div>
      </div>

      {/* Flow Editor */}
      <div className="flex-1 bg-white">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="top-right"
          connectionMode={ConnectionMode.Loose}
          snapToGrid={true}
          snapGrid={[15, 15]}
          style={{ backgroundColor: '#ffffff' }}
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="#000000" />
        </ReactFlow>
      </div>

      <ShareDialog 
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        flowName={flowName}
        flowData={{ nodes, edges }}
      />
    </div>
  );
};

export default FlowEditor;
