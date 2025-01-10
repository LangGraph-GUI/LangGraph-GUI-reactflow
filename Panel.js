// Panel.js

import React, { useState, useEffect } from 'react';
import { convertFlowToJson, convertJsonToFlow } from './JsonUtils';
import { saveJsonToFile, loadJsonFromFile } from './saveIO';
import RunWindow from './RunWindow';
import FileTransmit from './FileTransmit';
import ConfigWindow from '../ConfigWindow';
import { useGraphManager } from './GraphManager';
import { useSelector, useDispatch } from 'react-redux';
import { addSubGraph, updateSubGraph, removeSubGraph, initSubGraphs } from '../redux/slices/subGraphSlice';
import Modal from './Modal'; // Import the Modal component

function Panel({ showConfig, setShowConfig, showRun, setShowRun }) {
    const {
        nodes,
        setNodes,
        edges,
        setEdges,
        serialNumber,
        setSerialNumber,
    } = useGraphManager();
    const dispatch = useDispatch();
    const subGraphs = useSelector((state) => state.subGraphs.subGraphs);

    const [currentSubGraph, setCurrentSubGraph] = useState("root");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null); // 'add' or 'rename'
     const [modalInput, setModalInput] = useState("");

    useEffect(() => {
        // Update redux store when nodes/edges change in the current subgraph
        dispatch(updateSubGraph({ graphName: currentSubGraph, nodes: nodes, serial_number: serialNumber }));
    }, [nodes, edges, serialNumber, currentSubGraph, dispatch]);


    const handleNew = () => {
        initSubGraphs();
        dispatch(updateSubGraph({ graphName: "root", nodes: [], serial_number: 1 }));
        setCurrentSubGraph("root");
        setNodes([]);
        setEdges([]);
        setSerialNumber(0);
    };

    const handleLoadSubGraph = (graphName) => {
        // Save current graph before switching
        dispatch(updateSubGraph({ graphName: currentSubGraph, nodes: nodes, serial_number: serialNumber }));
        // Load a subGraph from redux to GraphManagerContext
        const selectedSubGraph = subGraphs.find((graph) => graph.graphName === graphName);
        if (selectedSubGraph) {
            const processedData = convertJsonToFlow(selectedSubGraph);
            if (processedData) {
                setNodes(processedData.nodes);
                setEdges(processedData.edges);
                setSerialNumber(processedData.serialNumber);
            }

            setCurrentSubGraph(graphName);
        }
    };

    const openModal = (type) => {
        setIsModalOpen(true);
        setModalType(type);
        setModalInput("");
    };


    const handleConfirmModal = () => {
      if(modalType === 'add'){
         const uniqueName = modalInput.trim() === "" ? `newGraph${Date.now()}` : modalInput;
        dispatch(addSubGraph({ graphName: uniqueName, nodes: [], serial_number: 1 }));
      } else if (modalType === 'rename'){
         if (currentSubGraph !== "root" && modalInput.trim() !== "") {
            const currentGraph = subGraphs.find((graph) => graph.graphName === currentSubGraph);
            if (currentGraph) {
                dispatch(removeSubGraph(currentSubGraph));
                dispatch(addSubGraph({ ...currentGraph, graphName: modalInput }));
                setCurrentSubGraph(modalInput);
            }
        }
      }

        setIsModalOpen(false);
        setModalType(null);
         setModalInput("");
    };
      

    const handleRemoveSubGraph = () => {
        if (currentSubGraph !== "root") {
            dispatch(removeSubGraph(currentSubGraph));
            handleNew(); // Reset to root node
        }
    };

    const handleSaveAll = async () => {
        // Save current graph before saving all
        dispatch(updateSubGraph({ graphName: currentSubGraph, nodes: nodes, serial_number: serialNumber }));
        try {
            const flowData = convertFlowToJson(subGraphs);
            saveJsonToFile(flowData);
        } catch (error) {
            console.error('Error saving JSON:', error);
            alert('Failed to save flow.');
        }
    };

    const handleLoad = async () => {
        try {
            const newSubGraphs = await loadJsonFromFile();
            if (Array.isArray(newSubGraphs)) {
                handleNew();
                newSubGraphs.forEach((subGraph) => {
                    dispatch(updateSubGraph(subGraph));
                });
            } else {
                alert('incorrect file form')
            }
        } catch (error) {
            console.error('Error loading JSON:', error);
            alert('Failed to load flow.');
        }
    };

    const handleRun = () => {
        setShowRun(true);
    };

    const handleConfig = () => {
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
                onClick={() => openModal('add')}
            >
                Add Subgraph
            </button>
            {currentSubGraph !== "root" && (
                <>
                   <button
                        className="ml-2 bg-yellow-500 hover:bg-yellow-700 text-white font-bold px-2 rounded"
                        onClick={() => openModal('rename')}
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
            
            {/* Generic Modal */}
            {isModalOpen && (
                <Modal
                    title={modalType === 'add' ? "Add New Subgraph" : "Rename Subgraph"}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleConfirmModal}
                    inputValue = {modalInput}
                    setInputValue = {setModalInput}
                >
                     <input
                        type="text"
                        className="p-1 border border-gray-300 rounded"
                        placeholder={modalType === 'add' ? "Subgraph Name" : "New Name"}
                        value={modalInput}
                        onChange={(e) => setModalInput(e.target.value)}
                    />
                </Modal>
            )}

        </nav>
    );
}


export default Panel;