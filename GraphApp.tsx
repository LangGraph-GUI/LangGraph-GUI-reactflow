// Graph/GraphApp.tsx

import { ReactFlow, MiniMap, Controls, Background, useReactFlow } from '@xyflow/react';
import { ReactFlowProps } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { updateSubGraph } from './subGraphs.store';
import { useMemo, useCallback, useEffect, useState, useRef } from 'react';
import Panel from './Panel';
import './GraphApp.css'

const initialGraphData = {
    graphName: "root",
    nodes: [
        { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
        { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
    ],
    edges: [{ id: 'e1-2', source: '1', target: '2' }],
    serial_number: 0,
};


const GraphApp: React.FC = () => {
    const subGraphs = useSelector((state: RootState) => state.subGraphs.subGraphs);
    const currentGraphName = useSelector((state: RootState) => state.subGraphs.currentGraphName);
    const dispatch = useDispatch();
    const { screenToFlowPosition } = useReactFlow();
    const [contextMenu, setContextMenu] = useState<{mouseX: number, mouseY: number} | null>(null);
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
        if (contextMenu) {
            const newPosition = screenToFlowPosition({ x: contextMenu.mouseX, y: contextMenu.mouseY });
            const newNode = {
                id: String(Date.now()), // Generate a unique ID, consider using UUID
                position: newPosition,
                data: { label: 'New Node' },
            };
            const updatedNodes = [...currentGraph.nodes, newNode]
            dispatch(updateSubGraph({
                graphName: currentGraphName,
                updatedGraph: {
                    ...currentGraph,
                    nodes: updatedNodes
                }
            }));
            setContextMenu(null);
        }
    }, [contextMenu, screenToFlowPosition, currentGraph, dispatch, currentGraphName]);


    const handlePaneContextMenu = useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        setContextMenu({
            mouseX: event.clientX,
            mouseY: event.clientY
        });
    }, []);
    
    const handleCloseContextMenu = () => {
        setContextMenu(null);
    };


    const reactFlowProps = useMemo<ReactFlowProps>(() => ({
        onContextMenu: handlePaneContextMenu,
        onClick: handleCloseContextMenu,
    }),[handlePaneContextMenu,handleCloseContextMenu])

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
    


    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            {/*Assuming you have a div with ref for menuBar*/}
            <div ref={menuBarRef}>
                <Panel />
            </div> 
            
            <div style={{ height: `${canvasHeight}px` }} className="w-full">
                <ReactFlow 
                    nodes={currentGraph.nodes} 
                    edges={currentGraph.edges}
                    {...reactFlowProps}
                >
                    <MiniMap />
                    <Background />
                    <Controls />
                </ReactFlow>
                {contextMenu && (
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
            </div>   
        </div>
    );
};

export default GraphApp;