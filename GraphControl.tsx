// Graph/GraphControl.tsx

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { addSubGraph, removeSubGraph, setCurrentGraphName, renameSubGraph } from './subGraphs.store';


const GraphControl: React.FC = () => {
    const subGraphs = useSelector((state: RootState) => state.subGraphs.subGraphs);
    const currentGraphName = useSelector((state: RootState) => state.subGraphs.currentGraphName);
    const dispatch = useDispatch();


    const handleAddGraph = () => {
        const newGraphName = prompt("Enter a new graph name:");
        if (newGraphName) {
            dispatch(addSubGraph(newGraphName));
        }
    };

    const handleRenameGraph = () => {
        const newGraphName = prompt("Enter a new graph name:");
        if (newGraphName){
            dispatch(renameSubGraph({
                oldName: currentGraphName,
                newName: newGraphName
            }))
        }
    }


    const handleRemoveGraph = () => {
        const graphName = prompt("Enter the graph name to delete:");
        if (graphName && graphName !== "root") {
            dispatch(removeSubGraph(graphName));
        } else if (graphName === "root") {
            alert("cannot delete root");
        }
    };

    const handleSelectGraph = (graphName: string) => {
        dispatch(setCurrentGraphName(graphName));
    };


    return (
        <nav className="p-2 z-20">
            SubGraph:
            <select
                className="ml-2 py-0 border rounded"
                value={currentGraphName}
                onChange={(e) => handleSelectGraph(e.target.value)}
                style={{
                    fontWeight: 'bold', // make selected option bold
                }}
            >
                {subGraphs.map((graph) => (
                    <option
                        key={graph.graphName}
                        value={graph.graphName}
                        style={{
                            fontWeight: graph.graphName === currentGraphName ? 'bold' : 'normal',
                        }}
                    >
                        {graph.graphName}
                    </option>
                ))}
            </select>
            <button className="ml-2 bg-green-500 hover:bg-green-700 text-white font-bold px-2 py-0 rounded" onClick={handleAddGraph}>Add</button>
            {currentGraphName !== "root" && (
                <span>
                    <button className="ml-2 bg-yellow-500 hover:bg-yellow-700 text-white px-2 py-0 rounded" onClick={handleRenameGraph}>Rename</button>
                    <button className="ml-2 bg-red-500 hover:bg-red-700 text-white px-2 py-0 rounded" onClick={handleRemoveGraph}>Remove</button>
                </span>
            )}
        </nav>
    );
};

export default GraphControl;