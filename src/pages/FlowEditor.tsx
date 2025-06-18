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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

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
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  // Delete todo and refresh nodes
  const handleTodoDelete = async (todoId: number) => {
    try {
      await todoService.deleteTodo(todoId);
      await loadTodos(); // Reload to sync changes
    } catch (error) {
      console.error('Failed to delete todo:', error);
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
    } catch (error) {
      console.error('Failed to create todo:', error);
    }
  };

  const refreshTodos = () => {
    loadTodos();
  };

  const saveFlow = async () => {
    try {
      await flowService.saveFlow({
        name: flowName,
        flow_data: { nodes, edges }
      });
      console.log('Flow saved successfully');
    } catch (error) {
      console.error('Failed to save flow:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-lg">Loading todos...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-background border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Input
            value={flowName}
            onChange={(e) => setFlowName(e.target.value)}
            className="w-64"
          />
          <Button onClick={addNewTodo} variant="outline" size="sm" className="bg-pink-accent hover:bg-pink-accent/90 text-white border-pink-accent">
            <Plus size={16} className="mr-2" />
            Add Todo
          </Button>
          <Button onClick={refreshTodos} variant="outline" size="sm" className="bg-blue-accent hover:bg-blue-accent/90 text-white border-blue-accent">
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setIsShareDialogOpen(true)} 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <Share size={16} />
            Share
          </Button>
          <Button onClick={saveFlow} className="flex items-center gap-2 bg-yellow-accent hover:bg-yellow-accent/90 text-black">
            <Save size={16} />
            Save Flow
          </Button>
        </div>
      </div>

      {/* Flow Editor */}
      <div className="flex-1">
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
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
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
