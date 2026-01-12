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
import 'bootstrap/dist/css/bootstrap.min.css';

import { EntityNode, AgentNode, ActivityNode } from './CustomNode';
import FloatingEdge from './FloatingEdge';
import CustomConnectionLine from './CustomConnectionLine';
import ELK from 'elkjs/lib/elk.bundled.js';
import LeftPanel from './LeftPanel';

const elk = new ELK();

const elkOptions = {
  'elk.algorithm': 'layered',
  'elk.direction': 'LEFT',
  'elk.layered.spacing.nodeNodeBetweenLayers': '100',
  'elk.spacing.nodeNode': '100',
  'elk.partitioning.activate': 'true'
};

const getLayoutedElements = (nodes, edges, options = {}) => {
  const graph = {
    id: 'root',
    layoutOptions: options,
    children: nodes.map((node) => ({
      ...node,
      // Hardcode a width and height for elk to use when layouting.
      width: 200,
      height: 100,

      layoutOptions: {
        // Use string partition ids so ELK treats them consistently.
        'partitioning.partition': 'layer' + (node.layerId ?? node.id),
      }
    })),
    edges: edges,
  };
 
  return elk
    .layout(graph)
    .then((layoutedGraph) => {
      // Debug: show the raw ELK output for inspection
      console.log('ELK layout output:', layoutedGraph.children);

      // Map ELK output to React Flow nodes
      const layoutedNodes = layoutedGraph.children.map((node) => ({
        ...node,
        position: { x: node.x, y: node.y },
      }));

      // Determine gap from options: prefer `elk.spacing.nodeNode`, fall back
      // to layered spacing option, and default to 20px.
      const gapOption = options['elk.spacing.nodeNode'] ?? options['elk.layered.spacing.nodeNodeBetweenLayers'] ?? '20';
      const gap = Number.parseInt(String(gapOption), 10) || 20;

      // Group nodes by original partition id (use nodes param to get original layerId)
      const idToLayer = Object.fromEntries(nodes.map((n) => [n.id, n.layerId ?? n.id]));
      const partitions = {};

      layoutedNodes.forEach((n) => {
        const layer = idToLayer[n.id] ?? n.id;
        const key = 'layer' + layer;
        if (!partitions[key]) partitions[key] = [];
        partitions[key].push(n);
      });

      // Align x to average per partition and apply vertical spacing derived from gap
      Object.values(partitions).forEach((group) => {
        const avgX = group.reduce((s, item) => s + item.position.x, 0) / group.length;
        group.forEach((item) => {
          item.position.x = avgX;
        });

        // Preserve ELK ordering by y, then spread nodes around the group's average y
        group.sort((a, b) => a.position.y - b.position.y);
        const avgY = group.reduce((s, item) => s + item.position.y, 0) / group.length;
        const maxHeight = Math.max(...group.map((n) => (n.height ?? 50)));
        const step = maxHeight + gap;
        const offsetCenter = (group.length - 1) / 2;

        group.forEach((item, i) => {
          item.position.y = avgY + (i - offsetCenter) * step;
        });
      });

      return {
        nodes: layoutedNodes,
        edges: layoutedGraph.edges,
      };
    })
    .catch(console.error);
};

const initialNodes = [
  {
    id: 'Entity 2',
    type: 'Entity',
    position: { x: 0, y: 0 },
    layerId: 3
  },
  {
    id: 'Entity 1',
    type: 'Entity',
    position: { x: 0, y: 0 },
    layerId: 2
  },
  {
    id: 'Activity 2',
    type: 'Activity',
    position: { x: 0, y: 0 },
    layerId: 3
  },
  {
    id: 'Activity 1',
    type: 'Activity',
    position: { x: 0, y: 0 },
    layerId: 2
  },
  {
    id: 'Person Agent',
    type: 'Agent',
    position: { x: 0, y: 0 },
    layerId: 2
  },
  {
    id: 'Organization Agent',
    type: 'Agent',
    position: { x: 0, y: 0 },
    layerId: 1
  }
];

const initialEdges = [
  {
    id: '1',
    source: 'Entity 2',
    label: 'wasDerivedFrom',
    target: 'Entity 1'
  },
  {
    id: '2',
    source: 'Entity 2',
    label: 'wasAttributedTo',
    target: 'Person Agent'
  },
  {
    id: '3',
    source: 'Entity 2',
    label: 'wasGeneratedBy',
    target: 'Activity 2'
  },
  {
    id: '4',
    source: 'Person Agent',
    label: 'actedOnBehalfOf',
    target: 'Organization Agent'
  },
  {
    id: '5',
    source: 'Activity 2',
    label: 'wasAssociatedWith',
    target: 'Person Agent'
  },
  {
    id: '6',
    source: 'Activity 2',
    label: 'wasInformedBy',
    target: 'Activity 1'
  },
  {
    id: '7',
    source: 'Activity 2',
    label: 'used',
    target: 'Entity 1'
  },
];

const connectionLineStyle = {
  stroke: '#b1b1b7',
};

const nodeTypes = {
  Entity: EntityNode,
  Activity: ActivityNode,
  Agent: AgentNode
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

const Graph = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const { fitView } = useReactFlow();
 
  const onLayout = useCallback(
    ({ }) => {
      getLayoutedElements(initialNodes, initialEdges, elkOptions).then(
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
  <div className="panelContainer">
    <LeftPanel />
    <ReactFlowProvider className="reactFlowContainer">
      <Graph />
    </ReactFlowProvider>
  </div>
);
