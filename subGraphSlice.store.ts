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
    currentGraphName: string; // Changed to string
}

const initialState: SubGraphState = {
    subGraphs: [],
    currentGraphName: "root", // Default to 'root'
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
        updateSubGraph: (
            state,
            action: PayloadAction<{ graphName: string; updatedGraph: SubGraph }>
        ) => {
            const { graphName, updatedGraph } = action.payload;
            const graphIndex = state.subGraphs.findIndex((graph) => graph.graphName === graphName);
            if (graphIndex !== -1) {
                state.subGraphs[graphIndex] = {
                    ...updatedGraph,
                };
            }
        },
        removeSubGraph: (state, action: PayloadAction<string>) => {
            const graphName = action.payload;
            state.subGraphs = state.subGraphs.filter((graph) => graph.graphName !== graphName);
            if (state.currentGraphName === graphName) {
                state.currentGraphName = "root";
            }
        },
        setCurrentGraphName: (state, action: PayloadAction<string>) => { // Changed to string
            state.currentGraphName = action.payload;
        },
    },
});

export const { addSubGraph, updateSubGraph, removeSubGraph, setCurrentGraphName } =
    subGraphSlice.actions;
export default subGraphSlice.reducer;