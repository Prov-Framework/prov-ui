import React, { useCallback, useLayoutEffect } from 'react';
import {
  Background,
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  useReactFlow,
  MiniMap,
  Controls,
  MarkerType,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import CustomNode from './CustomNode';
import FloatingEdge from './FloatingEdge';
import CustomConnectionLine from './CustomConnectionLine';
import ELK from 'elkjs/lib/elk.bundled.js';

const elk = new ELK();

const elkOptions = {
  'elk.algorithm': 'layered',
  'elk.layered.spacing.nodeNodeBetweenLayers': '100',
  'elk.partitioning.activate': 'true'
};

const getLayoutedElements = (nodes, edges, options = {}) => {
  const isHorizontal = options?.['elk.direction'] === 'RIGHT';
  const graph = {
    id: 'root',
    layoutOptions: options,
    children: nodes.map((node) => ({
      ...node,
      // Adjust the target and source handle positions based on the layout
      // direction.
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
 
      // Hardcode a width and height for elk to use when layouting.
      width: 150,
      height: 100,

      debug: (console.log(`Layouting node ${node.id}, layerId is ${node.layerId}`), null),

      // Layer ordering - use the node's `layerId` property (if present)
      layoutOptions: {
        'partitioning.partition': node.layerId, // Assign a unique partition ID
      }
    })),
    edges: edges,
  };
 
  return elk
    .layout(graph)
    .then((layoutedGraph) => ({
      nodes: layoutedGraph.children.map((node) => ({
        ...node,
        // React Flow expects a position property on the node instead of `x`
        // and `y` fields.
        position: { x: node.x, y: node.y },
      })),
 
      edges: layoutedGraph.edges,
    }))
    .catch(console.error);
};

const initialNodes = [
  {
    id: 'Entity',
    type: 'custom',
    position: { x: 0, y: 0 },
    layerId: 1
  },
  {
    id: 'Activity',
    type: 'custom',
    position: { x: 0, y: 0 },
    layerId: 2
  },
  {
    id: 'Agent',
    type: 'custom',
    position: { x: 0, y: 0 },
    layerId: 3
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

  const { fitView } = useReactFlow();
 
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);
  const onLayout = useCallback(
    ({ direction, useInitialNodes = false }) => {
      const opts = { 'elk.direction': direction, ...elkOptions };
      const ns = useInitialNodes ? initialNodes : nodes;
      const es = useInitialNodes ? initialEdges : edges;
 
      getLayoutedElements(ns, es, opts).then(
        ({ nodes: layoutedNodes, edges: layoutedEdges }) => {
          setNodes(layoutedNodes);
          setEdges(layoutedEdges);
          fitView();
        },
      );
    },
    [nodes, edges],
  );

  useLayoutEffect(() => {
    onLayout({ direction: 'LEFT', useInitialNodes: true });
  }, []);

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

export default () => (
  <ReactFlowProvider>
    <EasyConnectExample />
  </ReactFlowProvider>
);
