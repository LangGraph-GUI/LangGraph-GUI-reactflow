// Graph/CustomNode.tsx

import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Handle, Position, NodeResizeControl } from '@xyflow/react';
import ResizeIcon from './ResizeIcon';
import { ReactNodeProps, ReactFlowNodeEXT } from './NodeData';

const handleStyle = {
    borderRadius: '50%',
    background: '#555',
};

const CustomNode: React.FC<ReactNodeProps> = ({ id, width, height, data, onNodeDataChange }) => {
    const [localData, setLocalData] = useState<ReactFlowNodeEXT>(data);
    const dataRef = useRef(data);

    useEffect(() => {
        if (data !== dataRef.current) {
            setLocalData(data)
            dataRef.current = data
        }
    }, [data])

    const handleChange = useCallback((evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = evt.target;
        setLocalData(prev => ({ ...prev, [name]: value }))
    }, []);

    const handleBlur = useCallback(() => {
        if (localData !== data) {
            onNodeDataChange?.(id, localData);
        }
    }, [id, localData, data, onNodeDataChange]);


    const generateFieldId = (fieldName: string) => `${id}-${fieldName}`;

    return (
        <div
            className={`border border-gray-500 p-2 rounded-xl bg-white overflow-visible relative flex flex-col text-black`}
            style={{ width: width, height: height }}
        >
            <Handle
                type="target"
                position={Position.Left}
                className="absolute left-[-5px] top-1/2 -translate-y-1/2"
                style={handleStyle}
            />
            <Handle
                type="source"
                position={Position.Right}
                id="a"
                className="absolute right-[-5px] top-1/2 -translate-y-1/2"
                style={handleStyle}
            />
            <Handle
                type="source"
                position={Position.Top}
                id="true"
                className="absolute top-[-5px] left-1/2 -translate-x-1/2 bg-green-500"
                style={handleStyle}
            />
            <Handle
                type="source"
                position={Position.Bottom}
                id="false"
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
                        value={localData.type}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="nodrag w-full bg-white border border-gray-300 rounded focus:outline-none"
                        autoComplete="off"
                    >
                        <option value="START">START</option>
                        <option value="STEP">STEP</option>
                        <option value="TOOL">TOOL</option>
                        <option value="CONDITION">CONDITION</option>
                        <option value="INFO">INFO</option>
                        <option value="SUBGRAPH">SUBGRAPH</option>
                    </select>
                </div>
                {localData.type !== 'START' && (
                    <>
                        {['STEP', 'CONDITION', 'INFO', 'SUBGRAPH'].includes(localData.type) && (
                            <div>
                                <label htmlFor={generateFieldId("name")} className="block text-xs">
                                    Name:
                                </label>
                                <input
                                    id={generateFieldId("name")}
                                    name="name"
                                    value={localData.name || ""}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="nodrag w-full bg-white border border-gray-300 rounded focus:outline-none"
                                    autoComplete="off"
                                />
                            </div>
                        )}
                        {localData.type === 'STEP' && (
                            <div>
                                <label htmlFor={generateFieldId("tool")} className="block text-xs">
                                    Tool:
                                </label>
                                <input
                                    id={generateFieldId("tool")}
                                    name="tool"
                                    value={localData.tool || ""}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="nodrag w-full bg-white border border-gray-300 rounded focus:outline-none"
                                    autoComplete="off"
                                />
                            </div>
                        )}
                        {['STEP', 'TOOL', 'CONDITION', 'INFO'].includes(localData.type) && (
                            <div className="flex-grow relative">
                                <label htmlFor={generateFieldId("description")} className="block text-xs">
                                    Description:
                                </label>
                                <textarea
                                    id={generateFieldId("description")}
                                    name="description"
                                    value={localData.description || ""}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="nodrag w-full h-[calc(100%_-_20px)] absolute top-[20px] left-0 resize-none bg-white border border-gray-300 rounded focus:outline-none"
                                    autoComplete="off"
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
            <NodeResizeControl
                className="absolute right-1 bottom-1"
                minWidth={200}
                minHeight={200}
            >
                <ResizeIcon />
            </NodeResizeControl>
        </div>
    );
};

export default React.memo(CustomNode);