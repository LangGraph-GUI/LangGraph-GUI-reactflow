// Graph/CustomEdge.tsx

import React from 'react';
import { EdgeProps, getBezierPath, Position } from '@xyflow/react';

interface CustomEdgeProps extends Omit<EdgeProps, 'markerEnd'> {
    sourcePosition: Position;
    sourceNode: string;
    targetNode: string;
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
    sourceNode,
    targetNode
}) => {

    const edgePathArray = getBezierPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition
    });


    const edgePath = Array.isArray(edgePathArray) ? edgePathArray[0] : "";

    let strokeColor = 'gray';

    if (sourcePosition === Position.Top) {
        strokeColor = 'green';
    } else if (sourcePosition === Position.Bottom) {
        strokeColor = 'red';
    }

    const edgeStyle = {
        ...style,
        strokeWidth: 4,
        stroke: strokeColor,
    };

    const markerEndId = `arrowhead-${id}`;
    const markerFillColor = strokeColor;



    return (
        <>
            <defs>
                <marker
                    id={markerEndId}
                    viewBox="0 -5 10 10"
                    refX="10"
                    refY="0"
                    markerWidth="3"
                    markerHeight="3"
                    orient="auto"
                    fill={markerFillColor}
                >
                    <path d="M0,-5L10,0L0,5Z" />
                </marker>
            </defs>
            <path
                id={id}
                style={edgeStyle}
                className="react-flow__edge-path"
                d={edgePath}
                markerEnd={`url(#${markerEndId})`}
                strokeLinecap="round"
                data-source-node={sourceNode}
                data-target-node={targetNode}
            />
        </>
    );
};

export default React.memo(CustomEdge);
