import {
  Background,
  ReactFlow,
  useNodesState,
  useEdgesState,
  MiniMap,
  Controls,
  MarkerType,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import CustomNode from './CustomNode';
import FloatingEdge from './FloatingEdge';
import CustomConnectionLine from './CustomConnectionLine';

const initialNodes = [
  {
    id: 'Entity',
    type: 'custom',
    position: { x: 300, y: 0 },
  },
  {
    id: 'Activity',
    type: 'custom',
    position: { x: 300, y: 300 },
  },
  {
    id: 'Agent',
    type: 'custom',
    position: { x: 0, y: 150 },
  }
];

const initialEdges = [
  {
    id: 'e1',
    source: 'Entity',
    target: 'Activity',
    label: 'wasGeneratedBy'
  },
  {
    id: 'e2',
    source: 'Activity',
    target: 'Agent',
    label: 'wasAssociatedWith'
  },
  {
    id: 'e3',
    source: 'Entity',
    target: 'Agent',
    label: 'wasAttributedTo'
  }
];

const connectionLineStyle = {
  stroke: '#b1b1b7',
};

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  floating: FloatingEdge,
};

const defaultEdgeOptions = {
  type: 'floating',
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#b1b1b7',
  },
};

const EasyConnectExample = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);


  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      defaultEdgeOptions={defaultEdgeOptions}
      connectionLineComponent={CustomConnectionLine}
      connectionLineStyle={connectionLineStyle}
    >
      <Background />
      <MiniMap />
      <Controls />
    </ReactFlow>
  );
};

export default EasyConnectExample;
