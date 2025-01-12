// redux/slices/subGraphSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    subGraphs: [{ 
        graphName: "root", 
        nodes: [],
        serial_number: 0,
    }],
};

const subGraphSlice = createSlice({
  name: 'subGraphs',
  initialState,
  reducers: {
    
    addSubGraph: (state, action) => {
        const { graphName, nodes, serial_number } = action.payload;

        // Check if a subgraph with the same name already exists
        const graphExists = state.subGraphs.some(graph => graph.graphName === graphName);
        if (graphExists) {
            console.error(`Subgraph with name '${graphName}' already exists. Cannot add.`);
          return; // Prevent adding if name exists
        }
        state.subGraphs.push({graphName, nodes, serial_number});
    },
    updateSubGraph: (state, action) => {
        const { graphName, nodes, serial_number } = action.payload;
         const existingGraphIndex = state.subGraphs.findIndex(graph => graph.graphName === graphName);
      
        if(existingGraphIndex !== -1){
            state.subGraphs[existingGraphIndex] = {
              graphName: graphName,
              nodes: nodes,
              serial_number: serial_number,
            }
        } else {
            // If graph doesnt exist, add it
            state.subGraphs.push({graphName: graphName, nodes: nodes, serial_number: serial_number})
        }
    },
    removeSubGraph: (state, action) => {
      state.subGraphs = state.subGraphs.filter(graph => graph.graphName !== action.payload);
    },
    initSubGraphs: () => initialState, // Add reset reducer
    setSubGraphs: (state, action) => { // New reducer to replace all subGraphs
       state.subGraphs = action.payload;
   },
  },
});

export const { addSubGraph, updateSubGraph, removeSubGraph, initSubGraphs, setSubGraphs } = subGraphSlice.actions;
export default subGraphSlice.reducer;