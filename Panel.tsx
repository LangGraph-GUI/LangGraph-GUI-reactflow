// Graph/Panel.tsx

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { addSubGraph, updateSubGraph, removeSubGraph, setCurrentGraphName } from './subGraphs.store';
import { Node, Edge } from '@xyflow/react';


const Panel: React.FC = () => {
    const subGraphs = useSelector((state: RootState) => state.subGraphs.subGraphs);
    const currentGraphName = useSelector((state: RootState) => state.subGraphs.currentGraphName);
    const dispatch = useDispatch();


    const handleAddGraph = () => {
        const newGraphName = prompt("Enter a new graph name:");
        if (newGraphName) {
            dispatch(addSubGraph(newGraphName));
        }
    };

    const handleUpdateGraph = () => {
        const newNodes: Node[] = []
        const newEdges: Edge[] = []
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


    return (
        <div>
            <button onClick={handleAddGraph}>Add Graph</button>
            <button onClick={handleUpdateGraph}>Update Graph</button>
            <button onClick={handleRemoveGraph}>Remove Graph</button>
            <div>
                {subGraphs.map((graph) => (
                    <button key={graph.graphName} onClick={() => handleSelectGraph(graph.graphName)}>{graph.graphName}</button>
                ))}
            </div>
        </div>
    );
};

export default Panel;