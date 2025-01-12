// Graph/GraphApp.tsx
import { ReactFlow, MiniMap, Controls, Background, useReactFlow, ReactFlowProps, applyNodeChanges, NodeChange } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { updateSubGraph, updateNodeData } from './subGraphs.store';
import { useMemo, useCallback, useEffect, useState, useRef } from 'react';
import GraphControl from './GraphControl';
import './GraphApp.css'
import CustomNode from './CustomNode';


const initialGraphData = {
    graphName: "root",
    nodes: [],
    edges: [],
    serial_number: 0,
};


const GraphApp: React.FC = () => {
    const subGraphs = useSelector((state: RootState) => state.subGraphs.subGraphs);
    const currentGraphName = useSelector((state: RootState) => state.subGraphs.currentGraphName);
    const dispatch = useDispatch();
    const { screenToFlowPosition } = useReactFlow();
    const [contextMenu, setContextMenu] = useState<{mouseX: number, mouseY: number, nodeId: string | null, type: 'panel' | 'node'} | null>(null);
    const [canvasHeight, setCanvasHeight] = useState<number>(window.innerHeight);
    const menuBarRef = useRef<HTMLDivElement>(null);  //ref for menu bar
    

    const getGraph = useCallback((graphName: string) => {
        return subGraphs.find((graph) => graph.graphName === graphName);
    }, [subGraphs]);


    useEffect(() => {
        const rootGraph = getGraph("root");
        if (!rootGraph) {
            dispatch(updateSubGraph({ graphName: "root", updatedGraph: initialGraphData }));
        }
    }, [dispatch, getGraph]);

    // Always get the current graph, use initial graph data when current graph is not loaded
    const currentGraph = getGraph(currentGraphName) || initialGraphData;

    const handleAddNode = useCallback(() => {
        if (contextMenu && contextMenu.type === 'panel') {
            const newPosition = screenToFlowPosition({ x: contextMenu.mouseX, y: contextMenu.mouseY });
           const newNodeId = String(currentGraph.serial_number + 1);
            const newNode = {
                id: newNodeId,
                type: 'custom',
                position: newPosition,
                data: { label: 'New Node', value: '0' },
            };
            const updatedNodes = [...currentGraph.nodes, newNode]
            dispatch(updateSubGraph({
                graphName: currentGraphName,
                updatedGraph: {
                    ...currentGraph,
                    nodes: updatedNodes,
                    serial_number: currentGraph.serial_number + 1,
                }
            }));
            setContextMenu(null);
        }
    }, [contextMenu, screenToFlowPosition, currentGraph, dispatch, currentGraphName]);


    const handleDeleteNode = useCallback(() => {
        if (contextMenu && contextMenu.nodeId) {
            const nodeToDelete = contextMenu.nodeId;
            const updatedNodes = currentGraph.nodes.filter((node) => node.id !== nodeToDelete);
            const updatedEdges = currentGraph.edges.filter((edge) => edge.source !== nodeToDelete && edge.target !== nodeToDelete);

            dispatch(updateSubGraph({
                graphName: currentGraphName,
                updatedGraph: {
                    ...currentGraph,
                    nodes: updatedNodes,
                    edges: updatedEdges
                }
            }));
            setContextMenu(null);
        }
    }, [contextMenu, dispatch, currentGraph, currentGraphName]);

    const handlePanelContextMenu = useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        const target = event.target as HTMLElement;
        const nodeElement = target.closest('.react-flow__node') as HTMLElement;

        if(nodeElement){
            const nodeId = nodeElement.getAttribute("data-id")
            setContextMenu({
                mouseX: event.clientX,
                mouseY: event.clientY,
                nodeId: nodeId,
                type: 'node'
            });
        }else{
            setContextMenu({
                mouseX: event.clientX,
                mouseY: event.clientY,
                nodeId: null,
                type: 'panel'
            });
        }

    }, []);
    
    const handleCloseContextMenu = useCallback(() => {
        setContextMenu(null);
    }, []);

    const handleNodesChange = useCallback((changes: NodeChange[]) => {
        const updatedNodes = applyNodeChanges(changes, currentGraph.nodes);

        dispatch(
            updateSubGraph({
                graphName: currentGraphName,
                updatedGraph: {
                    ...currentGraph,
                    nodes: updatedNodes,
                },
            })
        );
    }, [currentGraph, dispatch, currentGraphName]);

    const handleNodeDataChange = useCallback((nodeId: string, newData: any) => {
        dispatch(updateNodeData({ graphName: currentGraphName, nodeId, newData }));
    }, [dispatch, currentGraphName]);


    const reactFlowProps = useMemo<ReactFlowProps>(() => ({
        onContextMenu: handlePanelContextMenu,
        onClick: handleCloseContextMenu,
        onNodesChange: handleNodesChange,
    }),[handlePanelContextMenu,handleCloseContextMenu, handleNodesChange])

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
        custom: (props: any) => <CustomNode {...props} onNodeDataChange={handleNodeDataChange} />,
    }), [handleNodeDataChange]);



    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            {/*Assuming you have a div with ref for menuBar*/}
            <div ref={menuBarRef}>
                <GraphControl />
            </div> 
            
            <div style={{ height: `${canvasHeight}px` }} className="w-full">
                <ReactFlow 
                    nodes={currentGraph.nodes} 
                    edges={currentGraph.edges}
                    {...reactFlowProps}
                    nodeTypes={nodeTypes}
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
                        <button onClick={handleAddNode} className="block bg-green-500 hover:bg-green-700 text-white font-bold px-2 rounded">Add Node</button>
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
                        <button onClick={handleDeleteNode} className="block bg-red-500 hover:bg-red-700 text-white font-bold px-2 rounded">Delete Node</button>
                        <button onClick={handleCloseContextMenu} className="block bg-gray-500 hover:bg-gray-700 text-white font-bold px-2 rounded">Cancel</button>
                    </div>
                )}
            </div>   
        </div>
    );
};

export default GraphApp;