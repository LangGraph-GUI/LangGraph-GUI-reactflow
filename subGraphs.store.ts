// Graph/subGraphSlice.store.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Node, Edge } from '@xyflow/react';

interface SubGraph {
    graphName: string;
    nodes: Node[];
    edges: Edge[];
    serial_number: number;
}

interface SubGraphState {
    subGraphs: SubGraph[];
    currentGraphName: string;
}

const initialState: SubGraphState = {
    subGraphs: [],
    currentGraphName: "root",
};

const subGraphSlice = createSlice({
    name: 'subGraphs',
    initialState,
    reducers: {
        addSubGraph: (state, action: PayloadAction<string>) => {
            state.subGraphs.push({
                graphName: action.payload,
                nodes: [],
                edges: [],
                serial_number: 0,
            });
            if (!state.currentGraphName) state.currentGraphName = action.payload;
        },
        renameSubGraph: (
            state,
            action: PayloadAction<{ oldName: string; newName: string }>
        ) => {
            const {oldName, newName} = action.payload;
            const graphIndex = state.subGraphs.findIndex((graph) => graph.graphName === oldName);
            if (graphIndex !== -1) {
                state.subGraphs[graphIndex] = {
                    ...state.subGraphs[graphIndex],
                    graphName: newName,
                };
                if (state.currentGraphName === oldName){
                    state.currentGraphName = newName
                }
            }
        },
         
        updateSubGraph: (
            state,
            action: PayloadAction<{ graphName: string; updatedGraph: SubGraph }>
        ) => {
            const { graphName, updatedGraph } = action.payload;
            const graphIndex = state.subGraphs.findIndex((graph) => graph.graphName === graphName);

            if (graphIndex === -1) {
                // Graph doesn't exist, add it
                state.subGraphs.push(updatedGraph);
            } else {
                // Graph exists, update it
                state.subGraphs[graphIndex] = {
                    ...updatedGraph,
                }
            }
        },
        removeSubGraph: (state, action: PayloadAction<string>) => {
            const graphName = action.payload;
            state.subGraphs = state.subGraphs.filter((graph) => graph.graphName !== graphName);
            if (state.currentGraphName === graphName) {
                state.currentGraphName = "root";
            }
        },
        setCurrentGraphName: (state, action: PayloadAction<string>) => {
            state.currentGraphName = action.payload;
        },
        updateNodeData: (state, action: PayloadAction<{ graphName: string, nodeId: string, newData: any }>) => {
            const { graphName, nodeId, newData } = action.payload;
            const graphIndex = state.subGraphs.findIndex(graph => graph.graphName === graphName);
            if (graphIndex === -1) return;

            const nodeIndex = state.subGraphs[graphIndex].nodes.findIndex(node => node.id === nodeId);
            if(nodeIndex === -1) return;

            state.subGraphs[graphIndex].nodes[nodeIndex] = {
                ...state.subGraphs[graphIndex].nodes[nodeIndex],
                data: { ...state.subGraphs[graphIndex].nodes[nodeIndex].data, ...newData} ,
            };

        }
    },
});

export const { 
    addSubGraph, 
    updateSubGraph, 
    removeSubGraph, 
    setCurrentGraphName, 
    renameSubGraph, 
    updateNodeData 
} = subGraphSlice.actions;
export default subGraphSlice.reducer;