// Graph/CustomNode.tsx

import React, { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';

interface CustomNodeProps {
    id: string;
    data: {
      label: string;
      value: string | number;
    };
    isConnectable?: boolean;
    onNodeDataChange?: (id: string, newData: any) => void;
}


const handleStyle = { left: 10 };

const CustomNode: React.FC<CustomNodeProps> = ({ id, data, isConnectable = true, onNodeDataChange }) => {

    const onChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = evt.target.value;
        onNodeDataChange?.(id, { ...data, value: newValue });
    }, [id, data, onNodeDataChange]);


    return (
        <div className="custom-node">
            <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      
            <div>
                <label htmlFor="text">Label:</label>
                <input
                    id="text"
                    className="nodrag"
                    value={data.value}
                    onChange={onChange}
                />
            </div>
            <Handle type="source" position={Position.Bottom} id="a" style={handleStyle} isConnectable={isConnectable} />
            <Handle
                type="source"
                position={Position.Bottom}
                id="b"
                isConnectable={isConnectable}
            />
      
        </div>
    );
};

export default CustomNode;