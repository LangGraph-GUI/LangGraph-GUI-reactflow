// Graph/GraphApp.tsx

import React, { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { ReactFlow, MiniMap, Controls, Background, useReactFlow, ReactFlowProps, NodeChange, Edge, EdgeChange, Connection } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useGraph } from './GraphContext';
import GraphPanel from './GraphPanel';
import './GraphApp.css';
import CustomNode from './CustomNode';
import CustomEdge from './CustomEdge';
import { useGraphActions } from './GraphActions';


const GraphApp: React.FC = () => {
    const { subGraphs, currentGraphName, updateSubGraph, updateNodeData, handleNodesChange, handleEdgesChange} = useGraph();
    const [contextMenu, setContextMenu] = useState<{mouseX: number, mouseY: number, nodeId: string | null, edgeId:string | null, type: 'panel' | 'node' | 'edge'} | null>(null);
    const [canvasHeight, setCanvasHeight] = useState<number>(window.innerHeight);
    const menuBarRef = useRef<HTMLDivElement>(null);  //ref for menu bar
    const { screenToFlowPosition } = useReactFlow();

    const { handleAddNode, handleDeleteNode, handleDeleteEdge, handlePanelContextMenu } = useGraphActions();

    const getGraph = useCallback((graphName: string) => {
        return subGraphs.find((graph) => graph.graphName === graphName);
    }, [subGraphs]);

  
    // Always get the current graph, use initial graph data when current graph is not loaded
    const currentGraph = useMemo(()=> getGraph(currentGraphName) || {
        graphName: "root",
        nodes: [],
        edges: [],
        serial_number: 0,
    }, [currentGraphName, getGraph]);


    const handleCloseContextMenu = useCallback(() => {
        setContextMenu(null);
    }, []);


    const handleNodeDataChange = useCallback((nodeId: string, newData: any) => {
        updateNodeData(currentGraphName, nodeId, newData)
    }, [updateNodeData, currentGraphName]);

    const handleEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
        event.preventDefault();
        event.stopPropagation();
        console.log("handleEdgeClick", edge)
    }, [])

    const handleConnect = useCallback((connection: Connection) => {
        const newEdge : Edge = {
            id: `${connection.source}-${connection.target}-${connection.sourceHandle || ""}`,
            source: connection.source,
            target: connection.target,
            sourceHandle: connection.sourceHandle,
            type: "custom"
        }
        const updatedEdges = [...currentGraph.edges, newEdge];

        updateSubGraph(currentGraphName,{
            ...currentGraph,
            edges: updatedEdges
        });
        
    },[currentGraph, currentGraphName, updateSubGraph])


    const reactFlowProps = useMemo<ReactFlowProps>(() => ({
        onContextMenu: (event: React.MouseEvent)=> handlePanelContextMenu(event, setContextMenu),
        onClick: handleCloseContextMenu,
        onNodesChange: (changes: NodeChange[]) => handleNodesChange(currentGraphName, changes),
        onEdgesChange: (changes: EdgeChange[]) => handleEdgesChange(currentGraphName, changes),
        onEdgeClick: handleEdgeClick,
        // onNodeClick: handleNodeClick,
        onConnect: handleConnect,
        // onNodeDragStart: handleCloseContextMenu,
        // onNodeHandleClick: handleNodeHandleClick,
        edgeTypes: {
            custom: CustomEdge,
        },
    }),[handlePanelContextMenu,handleCloseContextMenu, handleNodesChange, handleEdgesChange, handleEdgeClick, handleConnect, currentGraphName, setContextMenu])

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