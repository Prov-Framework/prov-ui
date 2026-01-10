import { BaseEdge, useInternalNode } from '@xyflow/react';

import { getEdgeParams } from './utils.js';

function FloatingEdge({ id, source, target, markerEnd, style, label, labelStyle, labelShowBg }) {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  var { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);

  ty = (sy < ty ? ty-=15 : ty+=15);

  const [path, labelX, labelY] = getSpecialPath({
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

const getSpecialPath = ({ sourceX, sourceY, targetX, targetY }) => {
  const centerX = (sourceX + targetX) / 2;
  const centerY = (sourceY + targetY) / 2;

  const offset = (sourceY - targetY)/4;

  return [`M ${sourceX + offset} ${sourceY} Q ${centerX + offset} ${centerY} ${targetX + offset} ${targetY}`, centerX + offset , centerY];
};

export default FloatingEdge;
