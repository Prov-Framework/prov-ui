import React, { useCallback } from 'react';
import {
  Background,
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const snapGrid = [20, 20];
const initialNodes = [
  {
    id: 'Entity',
    sourcePosition: 'bottom',
    targetPosition: 'bottom',
    data: { label: 'Entity' },
    position: { x: 200, y: 0 },
  },
  {
    id: 'Activity',
    sourcePosition: 'top',
    targetPosition: 'top',
    data: { label: 'Activity' },
    position: { x: 300, y: 160 },
  },
  {
    id: 'Agent',
    sourcePosition: 'right',
    targetPosition: 'right',
    data: { label: 'Agent' },
    position: { x: 0, y: 100 },
  },
];

const initialEdges = [
  {
    id: 'Entity|wasGeneratedBy|Activity',
    source: 'Entity',
    target: 'Activity',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 10,
      height: 10,
      color: 'black'
    },
    style: {
      strokeWidth: 2,
      stroke: 'black',
    },
    label: 'wasGeneratedBy'
  },
  {
    id: 'Activity|wasAssociatedWith|Agent',
    source: 'Activity',
    target: 'Agent',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 10,
      height: 10,
      color: 'black'
    },
    style: {
      strokeWidth: 2,
      stroke: 'black',
    },
    label: "wasAssociatedWith"
  },
  {
    id: 'Entity|wasAttributedTo|Agent',
    source: 'Entity',
    target: 'Agent',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 10,
      height: 10,
      color: 'black'
    },
    style: {
      strokeWidth: 2,
      stroke: 'black',
    },
    label: "wasAttributedTo"
  },
];

const HorizontalFlow = () => {
  const [nodes, _, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback(
    (params) => setEdges((els) => addEdge(params, els)),
    [],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      snapToGrid={true}
      snapGrid={snapGrid}
      fitView
      attributionPosition="bottom-left"
    >
      <Background />
      <MiniMap />
      <Controls />
    </ReactFlow>
  );
};

export default HorizontalFlow;
