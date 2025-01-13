// GraphControl.js

import React, { useState, useEffect } from 'react';
import { convertJsonToFlow, convertSubGraphToJson } from './JsonUtils';
import { saveJsonToFile, loadJsonFromFile } from '../utils/jsonIO';
import RunWindow from './RunWindow';
import FileTransmit from './FileTransmit';
import ConfigWindow from '../ConfigWindow';
import { useGraphContext } from './GraphContext';
import { useSelector, useDispatch } from 'react-redux';
import { addSubGraph, updateSubGraph, removeSubGraph, initSubGraphs, setSubGraphs } from './subGraphSlice.store';

function GraphControl({ showConfig, setShowConfig, showRun, setShowRun }) {
    const {
        nodes,
        setNodes,
        setEdges,
        serialNumber,
        setSerialNumber,
        Clear,
    } = useGraphContext();
    const dispatch = useDispatch();
    const subGraphs = useSelector((state) => state.subGraphs.subGraphs);

    const [currentSubGraph, setCurrentSubGraph] = useState("root");

    // Function to Update Redux with current graph state
    const updateReduxWithCurrentGraph = () => {
        const currentSubGraphJson = convertSubGraphToJson({
            graphName: currentSubGraph,
            nodes: nodes,
            serial_number: serialNumber,
        });
        dispatch(updateSubGraph(currentSubGraphJson));
    };

    // Effect to load subGraph from Redux whenever currentSubGraph changes
    useEffect(() => {
        const loadSubGraphData = () => {
            const selectedSubGraph = subGraphs.find((graph) => graph.graphName === currentSubGraph);
            if (selectedSubGraph) {
                const processedData = convertJsonToFlow(selectedSubGraph);
                if (processedData) {
                    setNodes(processedData.nodes);
                    setEdges(processedData.edges);
                    setSerialNumber(processedData.serialNumber);
                } else {
                    Clear();
                }
            } else {
                Clear();
            }
        };
        loadSubGraphData();
    }, [currentSubGraph, subGraphs, setNodes, setEdges, setSerialNumber]);


    const handleNew = () => {
        updateReduxWithCurrentGraph();
        dispatch(initSubGraphs());
        dispatch(updateSubGraph({ graphName: "root", nodes: [], serial_number: 0 }));
        setCurrentSubGraph("root");
        Clear();
    };

    const handleLoadSubGraph = (graphName) => {
        updateReduxWithCurrentGraph();
        setCurrentSubGraph(graphName); // Switch the name, the effect will do the loading.
    };

    const handleAddSubGraph = () => {
        updateReduxWithCurrentGraph();
        const newName = window.prompt("Enter the name for the new subgraph:");
         if(newName) {
            const uniqueName = newName.trim() === "" ? `newGraph${Date.now()}` : newName;
            dispatch(addSubGraph({ graphName: uniqueName, nodes: [], serial_number: 1 }));
         }
    };

    const handleRenameSubGraph = () => {
        updateReduxWithCurrentGraph();
        if(currentSubGraph === "root") return;
        const newName = window.prompt("Enter the new name for the subgraph:", currentSubGraph);
        if (newName && newName.trim() !== "" && newName !== currentSubGraph ) {
            const currentGraph = subGraphs.find((graph) => graph.graphName === currentSubGraph);
            if (currentGraph) {
                dispatch(removeSubGraph(currentSubGraph));
                dispatch(addSubGraph({ ...currentGraph, graphName: newName }));
                setCurrentSubGraph(newName);
            }
        }

    };


    const handleRemoveSubGraph = () => {
        updateReduxWithCurrentGraph();
         if (currentSubGraph !== "root") {
             dispatch(removeSubGraph(currentSubGraph));
             handleNew(); // Reset to root node
        }
    };

    const handleSaveAll = async () => {
        updateReduxWithCurrentGraph();
        try {
            saveJsonToFile(subGraphs);
        } catch (error) {
            console.error('Error saving JSON:', error);
            alert('Failed to save flow.');
        }
    };

    const handleLoad = async () => {
        updateReduxWithCurrentGraph();
        try {
            const newSubGraphs = await loadJsonFromFile();
             if (Array.isArray(newSubGraphs)) {
                dispatch(setSubGraphs(newSubGraphs));
            } else {
                alert('incorrect file form')
            }
        } catch (error) {
            console.error('Error loading JSON:', error);
            alert('Failed to load flow.');
        }
    };

     const handleRun = () => {
        updateReduxWithCurrentGraph();
        setShowRun(true);
    };

    const handleConfig = () => {
        updateReduxWithCurrentGraph();
        setShowConfig(true);
    };


    const handleUploadComplete = () => {
        console.log('Upload complete.');
    };

    return (
        <nav className="p-2 border-b border-gray-300 mb-2 bg-white z-20">
             <button className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 rounded" onClick={handleNew}>New Graph</button>
            <button className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 rounded" onClick={handleSaveAll}>Save Graphs</button>
            <button className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 rounded" onClick={handleLoad}>Load Graph</button>
            <button className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 rounded" onClick={handleRun}>Run Graph</button>
            <button className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 rounded" onClick={handleConfig}>Config</button>
            SubGraph:
            <select
                className="ml-2 p-1 border border-gray-300 rounded"
                value={currentSubGraph}
                onChange={(e) => handleLoadSubGraph(e.target.value)}
            >
                {subGraphs.map((graph) => (
                    <option key={graph.graphName} value={graph.graphName}>
                        {graph.graphName}
                    </option>
                ))}
            </select>
            <button
                className="ml-2 bg-green-500 hover:bg-green-700 text-white font-bold px-2 rounded"
                onClick={handleAddSubGraph}
            >
                Add Subgraph
            </button>
            {currentSubGraph !== "root" && (
                <>
                   <button
                        className="ml-2 bg-yellow-500 hover:bg-yellow-700 text-white font-bold px-2 rounded"
                        onClick={handleRenameSubGraph}
                    >
                        Rename Subgraph
                    </button>
                     <button
                        className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold px-2 rounded"
                        onClick={handleRemoveSubGraph}
                    >
                        Delete Subgraph
                    </button>
                </>
            )}
            <FileTransmit onUploadComplete={handleUploadComplete} />
            {showConfig && <ConfigWindow onClose={() => setShowConfig(false)} />}
            {showRun && <RunWindow onClose={() => setShowRun(false)} />}


        </nav>
    );
}

export default GraphControl;