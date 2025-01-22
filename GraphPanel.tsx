// Graph/GraphPanel.tsx

import React, { useState, useRef, useEffect } from 'react';
import { useGraph } from './GraphContext';
import './GraphPanel.css';

const GraphPanel: React.FC = () => {
    const { subGraphs, currentGraphName, addSubGraph, removeSubGraph, setCurrentGraphName, updateSubGraph } = useGraph();
    const [isGraphMenuOpen, setIsGraphMenuOpen] = useState(false);
    const [isSubGraphMenuOpen, setIsSubGraphMenuOpen] = useState(false);
    const graphMenuRef = useRef<HTMLDivElement>(null);
    const subGraphMenuRef = useRef<HTMLDivElement>(null);

    const handleAddGraph = () => {
        const newGraphName = prompt("Enter a new graph name:");
        if (newGraphName) {
            addSubGraph(newGraphName);
        }
        closeMenus();
    };

    const handleRenameGraph = () => {
        const newGraphName = prompt("Enter a new graph name:");
        if (newGraphName && currentGraphName !== "root") {
            const currentGraph = subGraphs.find(graph => graph.graphName === currentGraphName)
            if(currentGraph){
                updateSubGraph(currentGraphName, {...currentGraph, graphName: newGraphName})
            }
        }
        closeMenus();
    }

    const handleRemoveGraph = () => {
        const graphName = prompt("Enter the graph name to delete:");
        if (graphName && graphName !== "root") {
            removeSubGraph(graphName);
        } else if (graphName === "root") {
            alert("cannot delete root");
        }
        closeMenus();
    };

    const handleSelectGraph = (graphName: string) => {
        setCurrentGraphName(graphName);
        closeMenus();
    };
    // Placeholder functions for Graph menu
    const handleNewGraph = () => {
        console.log("New Graph clicked");
        closeMenus();

    };
    const handleLoadGraph = () => {
        console.log("Load Graph clicked");
        closeMenus();
    };

    const handleSaveGraph = () => {
        console.log("Save Graph clicked");
        closeMenus();
    };
    // Placeholder functions for SubGraph menu
    const handleLoadSubGraph = () => {
        console.log("Load Subgraph clicked");
        closeMenus();
    };
    const handleSaveSubGraph = () => {
        console.log("Save Subgraph clicked");
          
    };

    const toggleGraphMenu = () => {
        setIsGraphMenuOpen(!isGraphMenuOpen);
        setIsSubGraphMenuOpen(false);
    };

    const toggleSubGraphMenu = () => {
        setIsSubGraphMenuOpen(!isSubGraphMenuOpen);
        setIsGraphMenuOpen(false);
    };
    const closeMenus = () => {
        setIsGraphMenuOpen(false);
        setIsSubGraphMenuOpen(false);
    }
    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (graphMenuRef.current && !graphMenuRef.current.contains(event.target as Node)
                && subGraphMenuRef.current && !subGraphMenuRef.current.contains(event.target as Node)
            ) {
                closeMenus();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [graphMenuRef,subGraphMenuRef]);


    return (
        <nav className="p-2 z-20 flex items-center">

            <div className="relative mr-2" ref={graphMenuRef}>
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-2 rounded inline-flex items-center"
                    onClick={toggleGraphMenu}>
                    Graph
                    <svg className="fill-current h-4 w-4 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </button>
                {isGraphMenuOpen && (
                    <div className="absolute left-0 mt-1 dropdown-menu z-10">
                        <button className="block px-4 py-2 w-full text-left" onClick={handleNewGraph}>New Graph</button>
                        <button className="block px-4 py-2 w-full text-left" onClick={handleLoadGraph}>Load Graph</button>
                        <button className="block px-4 py-2 w-full text-left" onClick={handleSaveGraph}>Save Graph</button>
                    </div>
                )}
            </div>


            <div className="mr-2">
           SubGraph:
                <select
                    className="ml-2 py-0 border rounded dropdown-menu"
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
            </div>
            <div className="relative" ref={subGraphMenuRef}>
                <button
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-2 rounded inline-flex items-center"
                    onClick={toggleSubGraphMenu}
                >
                     ...
                    <svg className="fill-current h-4 w-4 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </button>
                {isSubGraphMenuOpen && (
                    <div className="absolute left-0 mt-1 dropdown-menu z-10">
                        <button className="block px-4 py-2 w-full text-left" onClick={handleAddGraph}>Add Subgraph</button>
                        <button className="block px-4 py-2 w-full text-left" onClick={handleLoadSubGraph}>Load Subgraph</button>
                        <button className="block px-4 py-2 w-full text-left" onClick={handleSaveSubGraph}>Save Subgraph</button>
                        {currentGraphName !== "root" && (
                            <>
                                <button className="block px-4 py-2 w-full text-left" onClick={handleRenameGraph}>Rename Subgraph</button>
                                <button className="block px-4 py-2 w-full text-left" onClick={handleRemoveGraph}>Remove Subgraph</button>
                            </>
                        )}
                    </div>
                )}
            </div>

        </nav>
    );
};

export default GraphPanel;