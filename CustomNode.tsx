// Graph/CustomNode.tsx

import React, { useCallback } from 'react';
import { Handle, Position, NodeResizeControl } from '@xyflow/react';
import ResizeIcon from './ResizeIcon';

interface CustomNodeProps {
    id: string;
    width: number;
    height: number;
    data: {
        type: string;
        name?: string;
        tool?: string;
        description?: string;
        ext?: string;
    };
    isConnectable?: boolean;
    onNodeDataChange?: (id: string, newData: any) => void;
}


const handleStyle = {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#555',
};


const CustomNode: React.FC<CustomNodeProps> = ({ id, width, height, data, isConnectable = true, onNodeDataChange }) => {


    const handleChange = useCallback((evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = evt.target;
        onNodeDataChange?.(id, { ...data, [name]: value });
    }, [id, data, onNodeDataChange]);


    const generateFieldId = (fieldName: string) => `${id}-${fieldName}`;

    return (
        <div
            className={`border border-gray-500 p-2 rounded-xl bg-white overflow-visible relative flex flex-col text-black`}
            style={{ width: width, height: height }}
        >
            <NodeResizeControl
                className="absolute right-1 bottom-1"
                minWidth={200}
                minHeight={200}
            >
                <ResizeIcon />
            </NodeResizeControl>            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
                className="absolute left-[-5px] top-1/2 -translate-y-1/2"
                style={handleStyle}
            />
            <Handle
                type="source"
                position={Position.Right}
                id="a"
                isConnectable={isConnectable}
                className="absolute right-[-5px] top-1/2 -translate-y-1/2"
                style={handleStyle}
            />
            <Handle
                type="source"
                position={Position.Top}
                id="true"
                isConnectable={isConnectable}
                className="absolute top-[-5px] left-1/2 -translate-x-1/2 bg-green-500"
                style={handleStyle}
            />
            <Handle
                type="source"
                position={Position.Bottom}
                id="false"
                isConnectable={isConnectable}
                className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 bg-red-500"
                style={handleStyle}
            />
            <div className="flex flex-col h-full flex-grow">
                <div>
                    <label htmlFor={generateFieldId("type")} className="block text-xs">
                        Type:
                    </label>
                    <select
                        id={generateFieldId("type")}
                        name="type"
                        defaultValue={data.type}
                        onChange={handleChange}
                        className="nodrag w-full bg-white border border-gray-300 rounded focus:outline-none"
                         autoComplete="off" // Disable autocomplete for select fields by default since their values are predetermined
                    >
                        <option value="START">START</option>
                        <option value="STEP">STEP</option>
                        <option value="TOOL">TOOL</option>
                        <option value="CONDITION">CONDITION</option>
                        <option value="INFO">INFO</option>
                        <option value="SUBGRAPH">SUBGRAPH</option>
                    </select>
                </div>
                {data.type !== 'START' && (
                    <>
                        {['STEP', 'CONDITION', 'INFO', 'SUBGRAPH'].includes(data.type) && (
                            <div>
                                <label htmlFor={generateFieldId("name")} className="block text-xs">
                                    Name:
                                </label>
                                <input
                                    id={generateFieldId("name")}
                                    name="name"
                                    defaultValue={data.name}
                                    onChange={handleChange}
                                    className="nodrag w-full bg-white border border-gray-300 rounded focus:outline-none"
                                    autoComplete="off"
                                />
                            </div>
                        )}
                        {data.type === 'STEP' && (
                            <div>
                                <label htmlFor={generateFieldId("tool")} className="block text-xs">
                                    Tool:
                                </label>
                                <input
                                    id={generateFieldId("tool")}
                                    name="tool"
                                    defaultValue={data.tool}
                                    onChange={handleChange}
                                    className="nodrag w-full bg-white border border-gray-300 rounded focus:outline-none"
                                    autoComplete="off"
                                />
                            </div>
                        )}
                        {['STEP', 'TOOL', 'CONDITION', 'INFO'].includes(data.type) && (
                            <div className="flex-grow">
                                <label htmlFor={generateFieldId("description")} className="block text-xs">
                                    Description:
                                </label>
                                <textarea
                                    id={generateFieldId("description")}
                                    name="description"
                                    defaultValue={data.description}
                                    onChange={handleChange}
                                    className="nodrag w-full h-full resize-none bg-white border border-gray-300 rounded focus:outline-none"
                                     autoComplete="off"
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};


export default React.memo(CustomNode);