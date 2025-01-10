// GraphManager.js
import React, { createContext, useContext, useState } from 'react';
import { useNodesState, useEdgesState} from 'reactflow';

const GraphManagerContext = createContext(null);

export const useGraphManager = () => {
  return useContext(GraphManagerContext);
};

export const GraphManagerProvider = ({ children }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);  
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [serialNumber, setSerialNumber] = useState(0);

  const value = {
    nodes,
    setNodes,
    onNodesChange,
    edges,
    setEdges,
    onEdgesChange,
    serialNumber,
    setSerialNumber,
  };

  return (
    <GraphManagerContext.Provider value={value}>
      {children}
    </GraphManagerContext.Provider>
  );
};