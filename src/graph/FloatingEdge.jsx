import { BaseEdge, getStraightPath, useInternalNode } from '@xyflow/react';

import { getEdgeParams } from '../utils.js';

function FloatingEdge({ id, source, target, markerEnd, style, label, labelStyle, labelShowBg }) {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  var { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);

  const [path, labelX, labelY] = getStraightPath({
    sourceX: sx,
    sourceY: sy,
    targetX: tx,
    targetY: ty,
  });

  return (
    <BaseEdge
      id={id}
      className="react-flow__edge-path"
      path={path}
      markerEnd={markerEnd}
      style={style}
      label={label ?? id}
      labelStyle={labelStyle ?? { color: 'var(--xy-edge-label-color-default)' }}
      labelShowBg={labelShowBg ?? true}
      labelX={labelX}
      labelY={labelY}
    />
  );
}

export default FloatingEdge;
