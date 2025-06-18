
import React, { useState, useCallback } from 'react';
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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Plus } from 'lucide-react';
import { flowService } from '@/services/flowService';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Start Task' },
    position: { x: 250, y: 25 },
  },
];

const initialEdges: Edge[] = [];

const FlowEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [flowName, setFlowName] = useState('New Flow');

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const addNewNode = () => {
    const newNode: Node = {
      id: `${nodes.length + 1}`,
      type: 'default',
      data: { label: `Task ${nodes.length + 1}` },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    };
    setNodes((nds) => nds.concat(newNode));
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

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Input
            value={flowName}
            onChange={(e) => setFlowName(e.target.value)}
            className="w-64"
          />
          <Button onClick={addNewNode} variant="outline" size="sm">
            <Plus size={16} className="mr-2" />
            Add Node
          </Button>
        </div>
        <Button onClick={saveFlow} className="flex items-center gap-2">
          <Save size={16} />
          Save Flow
        </Button>
      </div>

      {/* Flow Editor */}
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          attributionPosition="top-right"
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
};

export default FlowEditor;
