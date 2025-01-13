// GraphContext.js

import React, { createContext, useContext, useState } from 'react';
import { useNodesState, useEdgesState} from '@xyflow/react';

const GraphContextContext = createContext(null);

export const useGraphContext = () => {
  return useContext(GraphContextContext);
};

export const GraphContextProvider = ({ children }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);  
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [serialNumber, setSerialNumber] = useState(0);

  // Add addNode here
  const addNode = (newPosition) => {
      const newNode = {
          id: serialNumber.toString(),
          type: 'textUpdater',
          data: {
            name: `Node ${serialNumber}`,
            description: '',
            type: 'STEP',
            ext: { info: '' }, // Initialize ext.info for new nodes
            nexts: [],
            true_next: null,
            false_next: null,
            width: 200,
            height: 200
          },
          position: newPosition,
          prevs: []
        };
      setNodes((nodes) => nodes.concat(newNode));
      setSerialNumber(serialNumber + 1);
  };


    // Add clear function
    const Clear = () => {
      setNodes([]);
      setEdges([]);
      setSerialNumber(0);
    };


  const value = {
    nodes,
    setNodes,
    onNodesChange,
    edges,
    setEdges,
    onEdgesChange,
    serialNumber,
    setSerialNumber,
    addNode,
    Clear,
  };

  return (
    <GraphContextContext.Provider value={value}>
      {children}
    </GraphContextContext.Provider>
  );
};