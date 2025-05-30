// Graph/GraphContext.tsx

import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import { Node, Edge, NodeChange, applyNodeChanges, EdgeChange, applyEdgeChanges } from '@xyflow/react';

export interface SubGraph {
    graphName: string;
    nodes: Node[];
    edges: Edge[];
    serial_number: number;
}

export interface GraphContextType {
    subGraphs: SubGraph[];
    currentGraphName: string;
    setCurrentGraphName: (graphName: string) => void;
    getCurrentGraph: () => SubGraph;
    addSubGraph: (graphName: string) => void;
    updateSubGraph: (graphName: string, updatedGraph: SubGraph) => void;
    removeSubGraph: (graphName: string) => void;
    updateNodeData: (graphName: string, nodeId: string, newData: any) => void;
    handleNodesChange: (graphName: string, changes: NodeChange[]) => void;
    handleEdgesChange: (graphName: string, changes: EdgeChange[]) => void;
}

const initialGraphData = {
    graphName: "root",
    nodes: [],
    edges: [],
    serial_number: 1,
};

const GraphContext = createContext<GraphContextType | undefined>(undefined);

export const GraphProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [subGraphs, setSubGraphs] = useState<SubGraph[]>([]);
    const [currentGraphName, setCurrentGraphNameState] = useState<string>("root");
    
    const getCurrentGraph = useCallback(():SubGraph => {
        const currentGraph = subGraphs.find(graph => graph.graphName === currentGraphName);
        return currentGraph || {
            graphName: "root",
            nodes: [],
            edges: [],
            serial_number: 1,
        };
    }, [subGraphs, currentGraphName]);

    const addSubGraph = (graphName: string) => {
        setSubGraphs(prevGraphs => {
            const graphIndex = prevGraphs.findIndex(graph => graph.graphName === graphName);
            if(graphIndex === -1){
                const newSubgraphs = [...prevGraphs, {
                    graphName,
                    nodes: [],
                    edges: [],
                    serial_number: 1,
                }]
                if(!currentGraphName) setCurrentGraphNameState(graphName);
                return newSubgraphs;
            } else {
                return prevGraphs;  // Do nothing, just return the previous state
            }
        });
    };
    
    const updateSubGraph = (graphName: string, updatedGraph: SubGraph) => {
      
        setSubGraphs(prevGraphs => {
            const graphIndex = prevGraphs.findIndex(graph => graph.graphName === graphName);
           
            if (graphIndex === -1) {
                return [...prevGraphs, updatedGraph]
            } else {
                
                const updateGraph = prevGraphs.map((graph, index) => index === graphIndex ? updatedGraph : graph)
                if(currentGraphName === graphName) {
                 
                    setCurrentGraphNameState(updatedGraph.graphName);
                }
                return updateGraph;
            }
        });
    };

    const removeSubGraph = (graphName: string) => {
        setSubGraphs(prevGraphs => prevGraphs.filter(graph => graph.graphName !== graphName));
        if (currentGraphName === graphName) {
            setCurrentGraphNameState("root")
        }
    };
   

    const setCurrentGraphName = (graphName: string) => {
        setCurrentGraphNameState(graphName);
    };


    const updateNodeData = (graphName: string, nodeId: string, newData: any) => {
        setSubGraphs(prevGraphs => {
            return prevGraphs.map(graph => {
                if(graph.graphName === graphName){
                    return {
                        ...graph,
                        nodes: graph.nodes.map(node =>{
                            if(node.id === nodeId){
                                return {
                                    ...node,
                                    data: {...node.data, ...newData}
                                }
                            }
                            return node;
                        })
                    }
                }
                return graph;
            })
        })
    }

    const handleNodesChange = useCallback((graphName: string, changes: NodeChange[]) => {
        setSubGraphs((prevGraphs) => {
            return prevGraphs.map(graph => {
                if(graph.graphName === graphName){
                    const updatedNodes = applyNodeChanges(changes, graph.nodes);
                    return { ...graph, nodes: updatedNodes };
                }
                return graph;
            })
        })
    }, []);
    
    const handleEdgesChange = useCallback((graphName: string, changes: EdgeChange[]) => {
        setSubGraphs((prevGraphs) => {
            return prevGraphs.map(graph => {
                if(graph.graphName === graphName){
                    const updatedEdges = applyEdgeChanges(changes, graph.edges);
                    return { ...graph, edges: updatedEdges };
                }
                return graph;
            })
        })
    }, []);

    //Initialize root graph if not exist
    React.useEffect(()=>{
        const rootGraphExist = subGraphs.find(graph => graph.graphName === "root")
        if(!rootGraphExist){
            setSubGraphs([{...initialGraphData}]);
        }
    }, [subGraphs])

    const value = {
        subGraphs,
        currentGraphName,
        setCurrentGraphName,
        getCurrentGraph,
        addSubGraph,
        updateSubGraph,
        removeSubGraph,
        updateNodeData,
        handleNodesChange,
        handleEdgesChange,
    };

    return (
        <GraphContext.Provider value={value}>
            {children}
        </GraphContext.Provider>
    );
};

export const useGraph = () => {
    const context = useContext(GraphContext);
    if (!context) {
        throw new Error('useGraph must be used within a GraphProvider');
    }
    return context;
};