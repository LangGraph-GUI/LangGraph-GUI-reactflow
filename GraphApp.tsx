// Graph/GraphApp.tsx

import { ReactFlow, useReactFlow, ReactFlowProps } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { addSubGraph, updateSubGraph, removeSubGraph, setCurrentGraphName } from './subGraphSlice.store';
import { Node, Edge } from '@xyflow/react';
import { useMemo, useCallback, useEffect, useState } from 'react';

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
  

    const handleAddGraph = () => {
        const newGraphName = prompt("Enter a new graph name:");
        if (newGraphName) {
            dispatch(addSubGraph(newGraphName));
        }
    };

    const handleUpdateGraph = () => {
        const newNodes: Node[] = [
            { id: '3', position: { x: 200, y: 0 }, data: { label: '3' } },
            { id: '4', position: { x: 200, y: 100 }, data: { label: '4' } },
        ]
        const newEdges: Edge[] = [{ id: 'e3-4', source: '3', target: '4' }]
        dispatch(updateSubGraph({
            graphName: currentGraphName,
            updatedGraph: {
                graphName: currentGraphName,
                nodes: newNodes,
                edges: newEdges,
                serial_number: 1
            }
        }));
    };

    const handleRemoveGraph = () => {
        const graphName = prompt("Enter the graph name to delete:");
        if (graphName) {
            dispatch(removeSubGraph(graphName));
        }
    };


    const handleSelectGraph = (graphName: string) => {
        dispatch(setCurrentGraphName(graphName));
    };

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


    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <button onClick={handleAddGraph}>Add Graph</button>
            <button onClick={handleUpdateGraph}>Update Graph</button>
            <button onClick={handleRemoveGraph}>Remove Graph</button>
            <div>
                {subGraphs.map((graph) => (
                    <button key={graph.graphName} onClick={() => handleSelectGraph(graph.graphName)}>{graph.graphName}</button>
                ))}
            </div>
            <ReactFlow 
                nodes={currentGraph.nodes} 
                edges={currentGraph.edges}
                {...reactFlowProps}
            />
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
    );
};

export default GraphApp;