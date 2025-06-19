import React, { useState, useCallback, useEffect, useRef } from 'react';
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
  BaseEdge,
  EdgeProps,
  getBezierPath,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Plus, RefreshCw, Share, Undo2, Redo2 } from 'lucide-react';
import { flowService } from '@/services/flowService';
import { todoService } from '@/services/todoService';
import { initDatabase } from '@/lib/database';
import { useStore } from '@/stores/useStore';
import TodoNode from '@/components/flow/TodoNode';
import ShareDialog from '@/components/flow/ShareDialog';

// Custom edge component for a curvy black line
const CurvyBlackEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: '#000',
          strokeWidth: 3,
          strokeDasharray: 'none',
        }}
      />
    </>
  );
};

const nodeTypes = {
  todo: TodoNode,
};

const edgeTypes = {
  curvy: CurvyBlackEdge,
};

// History management for undo/redo
interface HistoryNode {
  id: string;
  type: string;
  data: Record<string, unknown>;
}

interface ConnectionAction {
  type: 'add' | 'remove';
  edge: Edge;
}

interface HistoryState {
  nodes: HistoryNode[];
  edges: Edge[];
  lastConnectionAction?: ConnectionAction;
}

const FlowEditor = () => {
  const { todos, setTodos } = useStore();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [flowName, setFlowName] = useState('Todo Flow');
  const [isLoading, setIsLoading] = useState(true);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [currentFlowId, setCurrentFlowId] = useState<number | null>(null);
  
  // Undo/Redo functionality
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoRedoAction = useRef(false);

  // Auto-save functionality
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-save function
  const autoSave = useCallback(async () => {
    if (nodes.length > 0 || edges.length > 0) {
      try {
        if (currentFlowId) {
          // Update existing flow
          await flowService.updateFlow(currentFlowId, {
            name: flowName,
            flow_data: { nodes, edges }
          });
        } else {
          // Create new flow
          const result = await flowService.saveFlow({
            name: flowName,
            flow_data: { nodes, edges }
          });
          // Get the flow ID from the result (we'll need to modify the service to return the ID)
          const savedFlow = await flowService.getMostRecentFlow();
          if (savedFlow) {
            setCurrentFlowId(savedFlow.id);
          }
        }
        console.log('Flow auto-saved successfully');
      } catch (error) {
        console.error('Failed to auto-save flow:', error);
      }
    }
  }, [nodes, edges, flowName, currentFlowId]);

  // Debounced auto-save
  const debouncedAutoSave = useCallback(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    autoSaveTimeoutRef.current = setTimeout(autoSave, 2000); // Auto-save after 2 seconds of inactivity
  }, [autoSave]);

  // Save current state to history - only content, not positions
  const saveToHistory = useCallback((newNodes: Node[], newEdges: Edge[], connectionAction?: ConnectionAction) => {
    if (isUndoRedoAction.current) {
      isUndoRedoAction.current = false;
      return;
    }

    // Create history state with only content data (no positions)
    const contentOnlyNodes = newNodes.map(node => ({
      id: node.id,
      type: node.type,
      data: node.data,
      // Exclude position from history
    }));

    const newState = { 
      nodes: contentOnlyNodes, 
      edges: newEdges,
      lastConnectionAction: connectionAction
    };
    
    console.log('Saving to history:', newState, 'current index:', historyIndex);
    
    setHistory(prev => {
      // Remove any future history if we're not at the end
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newState);
      // Keep unlimited history - remove the 50 state limit
      console.log('New history length:', newHistory.length);
      return newHistory;
    });
    setHistoryIndex(prev => {
      const newIndex = prev + 1;
      console.log('New history index:', newIndex);
      return newIndex;
    });
  }, [historyIndex]);

  // Undo function - handles individual connection actions
  const undo = useCallback(() => {
    console.log('Undo function called, historyIndex:', historyIndex, 'history length:', history.length);
    
    if (historyIndex > 0) {
      isUndoRedoAction.current = true;
      const newIndex = historyIndex - 1;
      const currentState = history[historyIndex];
      const previousState = history[newIndex];
      
      console.log('Current state:', currentState);
      console.log('Previous state:', previousState);
      
      if (currentState.lastConnectionAction?.type === 'add') {
        // Undo connection addition - remove the specific edge
        const edgeToRemove = currentState.lastConnectionAction.edge;
        console.log('Undoing connection addition:', edgeToRemove);
        setEdges(eds => eds.filter(edge => edge.id !== edgeToRemove.id));
      } else if (currentState.lastConnectionAction?.type === 'remove') {
        // Undo connection removal - add back the specific edge
        const edgeToRestore = currentState.lastConnectionAction.edge;
        console.log('Undoing connection removal:', edgeToRestore);
        setEdges(eds => [...eds, edgeToRestore]);
      } else {
        // Regular content undo
        console.log('Undoing content changes');
        const restoredNodes = previousState.nodes.map(historyNode => {
          const currentNode = nodes.find(n => n.id === historyNode.id);
          return {
            ...historyNode,
            position: currentNode?.position || { x: 0, y: 0 },
            sourcePosition: currentNode?.sourcePosition,
            targetPosition: currentNode?.targetPosition,
          } as Node;
        });
        
        setNodes(restoredNodes);
        setEdges(previousState.edges);
      }
      
      setHistoryIndex(newIndex);
      console.log('History index updated to:', newIndex);
    } else {
      console.log('Cannot undo - history index is 0 or less');
    }
  }, [historyIndex, history, setNodes, setEdges, nodes]);

  // Redo function - handles individual connection actions
  const redo = useCallback(() => {
    console.log('Redo function called, historyIndex:', historyIndex, 'history length:', history.length);
    
    if (historyIndex < history.length - 1) {
      isUndoRedoAction.current = true;
      const newIndex = historyIndex + 1;
      const nextState = history[newIndex];
      
      console.log('Next state:', nextState);
      
      if (nextState.lastConnectionAction?.type === 'add') {
        // Redo connection addition - add the specific edge
        const edgeToAdd = nextState.lastConnectionAction.edge;
        console.log('Redoing connection addition:', edgeToAdd);
        setEdges(eds => [...eds, edgeToAdd]);
      } else if (nextState.lastConnectionAction?.type === 'remove') {
        // Redo connection removal - remove the specific edge
        const edgeToRemove = nextState.lastConnectionAction.edge;
        console.log('Redoing connection removal:', edgeToRemove);
        setEdges(eds => eds.filter(edge => edge.id !== edgeToRemove.id));
      } else {
        // Regular content redo
        console.log('Redoing content changes');
        const restoredNodes = nextState.nodes.map(historyNode => {
          const currentNode = nodes.find(n => n.id === historyNode.id);
          return {
            ...historyNode,
            position: currentNode?.position || { x: 0, y: 0 },
            sourcePosition: currentNode?.sourcePosition,
            targetPosition: currentNode?.targetPosition,
          } as Node;
        });
        
        setNodes(restoredNodes);
        setEdges(nextState.edges);
      }
      
      setHistoryIndex(newIndex);
      console.log('History index updated to:', newIndex);
    } else {
      console.log('Cannot redo - already at latest state');
    }
  }, [historyIndex, history, setNodes, setEdges, nodes]);

  // Enhanced node change handler with history - only for content changes
  const handleNodesChange = useCallback((changes: any) => {
    onNodesChange(changes);
    
    // Only save to history for content changes, not position changes
    const hasContentChanges = changes.some((change: any) => 
      change.type === 'replace' || 
      (change.type === 'select' && change.selected !== undefined)
    );
    
    if (hasContentChanges) {
      setTimeout(() => {
        if (!isUndoRedoAction.current) {
          saveToHistory(nodes, edges);
          debouncedAutoSave();
        }
      }, 100);
    }
  }, [onNodesChange, nodes, edges, saveToHistory, debouncedAutoSave]);

  // Enhanced edge change handler with history
  const handleEdgesChange = useCallback((changes: any) => {
    onEdgesChange(changes);
    
    // Track individual connection removals
    const removalChanges = changes.filter((change: any) => change.type === 'remove');
    
    if (removalChanges.length > 0) {
      // Save each removal as individual action
      removalChanges.forEach((change: any) => {
        const connectionAction: ConnectionAction = {
          type: 'remove',
          edge: change.item
        };
        
        setTimeout(() => {
          if (!isUndoRedoAction.current) {
            saveToHistory(nodes, edges, connectionAction);
            debouncedAutoSave();
          }
        }, 100);
      });
    } else {
      // Regular edge changes (not removals)
      setTimeout(() => {
        if (!isUndoRedoAction.current) {
          saveToHistory(nodes, edges);
          debouncedAutoSave();
        }
      }, 100);
    }
  }, [onEdgesChange, nodes, edges, saveToHistory, debouncedAutoSave]);

  // Load saved flow data
  const loadSavedFlow = async () => {
    try {
      const savedFlow = await flowService.getMostRecentFlow();
      if (savedFlow && savedFlow.flow_data) {
        setFlowName(savedFlow.name);
        setCurrentFlowId(savedFlow.id);
        
        // Load saved nodes and edges
        const savedNodes = savedFlow.flow_data.nodes || [];
        const savedEdges = savedFlow.flow_data.edges || [];
        
        // Convert saved nodes to include todo data
        const nodesWithTodoData = await Promise.all(
          savedNodes.map(async (node: any) => {
            if (node.type === 'todo') {
              // Extract todo ID from node ID
              const todoId = parseInt(node.id.replace('todo-', ''));
              const todo = await todoService.getTodoById(todoId);
              if (todo) {
                return {
                  ...node,
                  data: {
                    todo,
                    onUpdate: handleTodoUpdate,
                    onDelete: handleTodoDelete,
                  }
                };
              }
            }
            return node;
          })
        );
        
        setNodes(nodesWithTodoData);
        setEdges(savedEdges);
        
        // Initialize history with loaded state
        const initialHistoryState: HistoryState = {
          nodes: nodesWithTodoData.map(node => ({
            id: node.id,
            type: node.type,
            data: node.data,
          })),
          edges: savedEdges
        };
        
        setHistory([initialHistoryState]);
        setHistoryIndex(0);
        
        console.log('Loaded saved flow:', savedFlow.name);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to load saved flow:', error);
      return false;
    }
  };

  // Load todos and convert to nodes
  const loadTodos = async () => {
    try {
      await initDatabase();
      
      // Try to load saved flow first
      const flowLoaded = await loadSavedFlow();
      
      if (!flowLoaded) {
        // If no saved flow, load todos and create default nodes
        const todoData = await todoService.getAllTodos();
        setTodos(todoData as any);
        const todoNodes = todosToNodes(todoData as any);
        setNodes(todoNodes);
        
        // Initialize history with current state
        const initialHistoryState: HistoryState = {
          nodes: todoNodes.map(node => ({
            id: node.id,
            type: node.type,
            data: node.data,
          })),
          edges: []
        };
        
        setHistory([initialHistoryState]);
        setHistoryIndex(0);
        console.log('History initialized with todos:', initialHistoryState);
      }
    } catch (error) {
      console.error('Failed to load todos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Convert todos to flow nodes with position preservation
  const todosToNodes = (todoList: any[]): Node[] => {
    return todoList.map((todo, index) => {
      // Check if this node already exists to preserve its position
      const existingNode = nodes.find(node => node.id === `todo-${todo.id}`);
      const position = existingNode ? existingNode.position : { 
        x: 250 + (index % 3) * 300, 
        y: 100 + Math.floor(index / 3) * 150 
      };
      
      return {
        id: `todo-${todo.id}`,
        type: 'todo',
        position,
        data: {
          todo,
          onUpdate: handleTodoUpdate,
          onDelete: handleTodoDelete,
        },
      };
    });
  };

  useEffect(() => {
    loadTodos();
  }, []);

  // Cleanup auto-save timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
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
        // Prevent self-connections
        if (params.source === params.target) {
          return;
        }
        
        // Allow multiple connections - only prevent exact duplicates
        const existingEdge = edges.find(
          edge => 
            edge.source === params.source && 
            edge.target === params.target &&
            edge.sourceHandle === params.sourceHandle &&
            edge.targetHandle === params.targetHandle
        );
        
        if (existingEdge) {
          return; // Only prevent exact duplicates
        }
        
        const newEdge = {
          ...params,
          id: `edge-${params.source}-${params.sourceHandle || 'default'}-${params.target}-${params.targetHandle || 'default'}-${Date.now()}`,
          type: 'curvy', // use the custom edge type
          animated: false,
        };
        
        // Track this as an individual connection action
        const connectionAction: ConnectionAction = {
          type: 'add',
          edge: newEdge
        };
        
        setEdges((eds) => {
          const newEdges = addEdge(newEdge, eds);
          // Save to history with connection action
          setTimeout(() => {
            if (!isUndoRedoAction.current) {
              saveToHistory(nodes, newEdges, connectionAction);
              debouncedAutoSave();
            }
          }, 100);
          return newEdges;
        });
      }
    },
    [setEdges, edges, nodes, saveToHistory, debouncedAutoSave],
  );

  const addNewTodo = async () => {
    try {
      const newTodo = {
        title: `New Task ${todos.length + 1}`,
        description: 'Click to edit this task',
        priority: 'medium'
      };
      await todoService.createTodo(newTodo);
      // Get the new todo data
      const todoData = await todoService.getAllTodos();
      setTodos(todoData as any);
      // Find the new todo
      const latestTodo = todoData[0];
      // Add new node with default position, keep existing nodes as is
      setNodes((currentNodes) => [
        ...currentNodes,
        {
          id: `todo-${latestTodo.id}`,
          type: 'todo',
          position: { x: 250, y: 100 }, // default position for new node
          data: {
            todo: latestTodo,
            onUpdate: handleTodoUpdate,
            onDelete: handleTodoDelete,
          },
        },
      ]);
    } catch (error) {
      console.error('Failed to create todo:', error);
    }
  };

  const refreshTodos = async () => {
    try {
      const todoData = await todoService.getAllTodos();
      setTodos(todoData as any);
      setNodes((currentNodes) =>
        currentNodes.map((node) => {
          if (node.type === 'todo') {
            const todoId = parseInt(node.id.replace('todo-', ''));
            const updatedTodo = todoData.find((t: any) => t.id === todoId);
            if (updatedTodo) {
              return {
                ...node,
                data: {
                  ...node.data,
                  todo: updatedTodo,
                },
              };
            }
          }
          return node;
        })
      );
    } catch (error) {
      console.error('Failed to refresh todos:', error);
    }
  };

  const saveFlow = async () => {
    try {
      if (currentFlowId) {
        // Update existing flow
        await flowService.updateFlow(currentFlowId, {
          name: flowName,
          flow_data: { nodes, edges }
        });
      } else {
        // Create new flow
        await flowService.saveFlow({
          name: flowName,
          flow_data: { nodes, edges }
        });
        // Get the flow ID from the result
        const savedFlow = await flowService.getMostRecentFlow();
        if (savedFlow) {
          setCurrentFlowId(savedFlow.id);
        }
      }
      console.log('Flow saved successfully');
    } catch (error) {
      console.error('Failed to save flow:', error);
    }
  };

  // Auto-save when flow name changes
  useEffect(() => {
    if (!isLoading) {
      debouncedAutoSave();
    }
  }, [flowName, debouncedAutoSave, isLoading]);

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
          <Input
            value={flowName}
            onChange={(e) => setFlowName(e.target.value)}
            className="w-full sm:w-64 neo-brutal text-sm sm:text-base"
          />
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
            <Button 
              onClick={() => {
                console.log('Undo clicked, historyIndex:', historyIndex, 'history length:', history.length);
                undo();
              }}
              disabled={historyIndex <= 0}
              className="neo-brutal bg-white hover:bg-gray-100 text-black font-bold text-xs sm:text-sm px-3 sm:px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Undo2 size={14} className="mr-1 sm:mr-2" />
              Undo {historyIndex > 0 ? `(${historyIndex})` : ''}
            </Button>
            <Button 
              onClick={() => {
                console.log('Redo clicked, historyIndex:', historyIndex, 'history length:', history.length);
                redo();
              }}
              disabled={historyIndex >= history.length - 1}
              className="neo-brutal bg-white hover:bg-gray-100 text-black font-bold text-xs sm:text-sm px-3 sm:px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Redo2 size={14} className="mr-1 sm:mr-2" />
              Redo {historyIndex < history.length - 1 ? `(${history.length - historyIndex - 1})` : ''}
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
            onClick={saveFlow} 
            className="neo-brutal-purple bg-purple-accent hover:bg-purple-accent text-white font-bold text-xs sm:text-sm px-3 sm:px-4 py-2 flex-1 sm:flex-none"
          >
            <Save size={14} className="mr-1 sm:mr-2" />
            Save Flow
          </Button>
        </div>
      </div>

      {/* Flow Editor */}
      <div className="flex-1 bg-white">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          attributionPosition="top-right"
          connectionMode={ConnectionMode.Loose}
          snapToGrid={true}
          snapGrid={[15, 15]}
          style={{ backgroundColor: '#ffffff' }}
          deleteKeyCode="Delete"
          multiSelectionKeyCode="Shift"
          panOnDrag={true}
          panOnScroll={false}
          zoomOnScroll={true}
          zoomOnPinch={true}
          zoomOnDoubleClick={false}
          preventScrolling={true}
          nodesDraggable={true}
          nodesConnectable={true}
          elementsSelectable={true}
          selectNodesOnDrag={false}
          connectionRadius={30}
          connectionLineStyle={{ stroke: '#000', strokeWidth: 2 }}
          defaultEdgeOptions={{ type: 'curvy' }}
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
