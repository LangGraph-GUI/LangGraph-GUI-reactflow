// Graph/CustomEdge.tsx

import React from 'react';
import { EdgeProps, getBezierPath, getSmoothStepPath } from '@xyflow/react';

interface CustomEdgeProps extends EdgeProps {
  type?: 'bezier' | 'smoothstep';
}

const CustomEdge: React.FC<CustomEdgeProps> = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style,
    markerEnd,
    type = 'bezier', // Default to bezier
}) => {

    const edgePathArray = type === 'smoothstep' 
        ? getSmoothStepPath({
            sourceX,
            sourceY,
            targetX,
            targetY,
            sourcePosition,
            targetPosition,
            borderRadius:5,
        })
        : getBezierPath({
            sourceX,
            sourceY,
            targetX,
            targetY,
            sourcePosition,
            targetPosition
        });

    const edgePath = Array.isArray(edgePathArray) ? edgePathArray[0] : "";

    const edgeStyle = {
        ...style,
        strokeWidth: 4, // Adjust this value for line thickness
    }
  
    return (
        <path
            id={id}
            style={edgeStyle}
            className="react-flow__edge-path"
            d={edgePath}
            markerEnd={markerEnd}
            strokeLinecap="round"
        />
    );
};

export default React.memo(CustomEdge);