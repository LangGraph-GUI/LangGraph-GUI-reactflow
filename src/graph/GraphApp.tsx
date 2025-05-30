// Graph/GraphApp.tsx

import React, { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { ReactFlow, MiniMap, Controls, Background, useReactFlow, ReactFlowProps, NodeChange, EdgeChange,  } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useGraph } from './GraphContext';
import GraphPanel from './GraphPanel';
import './GraphApp.css';
import CustomNode from './CustomNode';
import CustomEdge from './CustomEdge';
import { useGraphActions } from './GraphActions';
import { Edge as ReactFlowEdge } from '@xyflow/react';


const GraphApp: React.FC = () => {
    const { currentGraphName, updateNodeData, handleNodesChange, handleEdgesChange, getCurrentGraph} = useGraph();
    const [contextMenu, setContextMenu] = useState<{mouseX: number, mouseY: number, nodeId: string | null, edgeId:string | null, type: 'panel' | 'node' | 'edge'} | null>(null);
    const [canvasHeight, setCanvasHeight] = useState<number>(window.innerHeight);
    const menuBarRef = useRef<HTMLDivElement>(null);  //ref for menu bar
    const { screenToFlowPosition } = useReactFlow();

    const { handleAddNode, handleDeleteNode, handleDeleteEdge, handlePanelContextMenu, handleAddEdge } = useGraphActions();


    // Always get the current graph, use initial graph data when current graph is not loaded
    const currentGraph = useMemo(()=> getCurrentGraph(), [getCurrentGraph]);


    const handleCloseContextMenu = useCallback(() => {
        setContextMenu(null);
    }, []);


    const handleNodeDataChange = useCallback((nodeId: string, newData: any) => {
        updateNodeData(currentGraphName, nodeId, newData)
    }, [updateNodeData, currentGraphName]);

    const handleEdgeClick = useCallback((event: React.MouseEvent, edge: ReactFlowEdge) => {
        event.preventDefault();
        event.stopPropagation();
        console.log("handleEdgeClick", edge)
    }, [])


    const reactFlowProps = useMemo<ReactFlowProps>(() => ({
        onContextMenu: (event: React.MouseEvent)=> handlePanelContextMenu(event, setContextMenu),
        onClick: handleCloseContextMenu,
        onNodesChange: (changes: NodeChange[]) => handleNodesChange(currentGraphName, changes),
        onEdgesChange: (changes: EdgeChange[]) => handleEdgesChange(currentGraphName, changes),
        onEdgeClick: handleEdgeClick,
        onConnect: handleAddEdge,
        edgeTypes: {
            custom: (props) => {
                const {sourceNode, targetNode} = props.data || {}
                return <CustomEdge {...props} sourceNode={sourceNode} targetNode={targetNode} />
            },
        },
    }),[handlePanelContextMenu,handleCloseContextMenu, handleNodesChange, handleEdgesChange, handleEdgeClick, handleAddEdge, currentGraphName, setContextMenu])

    useEffect(() => {
        const handleResize = () => {
            if (menuBarRef.current) {
                const menuBarHeight = menuBarRef.current.offsetHeight;
                setCanvasHeight(window.innerHeight - menuBarHeight - 10);
            } else {
                setCanvasHeight(window.innerHeight-10);
            }
        };
    
        window.addEventListener('resize', handleResize);
        handleResize();
    
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const nodeTypes = useMemo(() => ({
        custom: (props: any) => <CustomNode {...props} onNodeDataChange={handleNodeDataChange}  />,
    }), [handleNodeDataChange]);



    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            {/*Assuming you have a div with ref for menuBar*/}
            <div ref={menuBarRef}>
                <GraphPanel />
            </div> 
            
            <div style={{ height: `${canvasHeight}px` }} className="w-full">
                <ReactFlow 
                    nodes={currentGraph.nodes} 
                    edges={currentGraph.edges}
                    {...reactFlowProps}
                    nodeTypes={nodeTypes}
                    connectionLineStyle={{ stroke: '#ddd', strokeWidth: 2 }}
                    
                >
                    <MiniMap />
                    <Background />
                    <Controls />
                </ReactFlow>
                {contextMenu && contextMenu.type === 'panel' && (
                    <div
                        className="absolute bg-white border border-gray-300 z-1000 p-2"
                        style={{
                            top: contextMenu.mouseY,
                            left: contextMenu.mouseX,
                        }}
                    >
                        <button onClick={()=> handleAddNode({contextMenu, setContextMenu, screenToFlowPosition})} className="block bg-green-500 hover:bg-green-700 text-white font-bold px-2 rounded">Add Node</button>
                        <button onClick={handleCloseContextMenu} className="block bg-gray-500 hover:bg-gray-700 text-white font-bold px-2 rounded">Cancel</button>
                    </div>
                )}
                {contextMenu && contextMenu.type === 'node' &&(
                    <div
                        className="absolute bg-white border border-gray-300 z-1000 p-2"
                        style={{
                            top: contextMenu.mouseY,
                            left: contextMenu.mouseX,
                        }}
                    >
                        {/* <button onClick={handleAddEdge} className="block bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 rounded">Add Edge</button> */}
                        <button onClick={()=> handleDeleteNode(contextMenu, setContextMenu)} className="block bg-red-500 hover:bg-red-700 text-white font-bold px-2 rounded">Delete Node</button>
                        <button onClick={handleCloseContextMenu} className="block bg-gray-500 hover:bg-gray-700 text-white font-bold px-2 rounded">Cancel</button>
                    </div>
                )}
                {contextMenu && contextMenu.type === 'edge' &&(
                    <div
                        className="absolute bg-white border border-gray-300 z-1000 p-2"
                        style={{
                            top: contextMenu.mouseY,
                            left: contextMenu.mouseX,
                        }}
                    >
                        <button onClick={()=> handleDeleteEdge(contextMenu, setContextMenu)} className="block bg-red-500 hover:bg-red-700 text-white font-bold px-2 rounded">Delete Edge</button>
                        <button onClick={handleCloseContextMenu} className="block bg-gray-500 hover:bg-gray-700 text-white font-bold px-2 rounded">Cancel</button>
                    </div>
                )}
            </div>   
        </div>
    );
};

export default GraphApp;