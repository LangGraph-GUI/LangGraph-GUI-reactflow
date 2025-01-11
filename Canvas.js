// Canvas.js

import React, { useState, useCallback, useEffect, useRef } from 'react';
import ReactFlow, { MiniMap, Controls, Background, useReactFlow } from 'reactflow';
import 'reactflow/dist/style.css';
import Node, { deleteNode } from './Node';
import { createEdge, deleteEdge } from './Edge';
import { createConditionEdge, deleteConditionEdge } from './ConditionEdge';
import { useGraphManager } from './GraphManager';
import Panel from './Panel';

const nodeTypes = { textUpdater: Node };

function Canvas() {
  const {
    nodes,
    setNodes,
    onNodesChange,
    edges,
    setEdges,
    onEdgesChange,
    addNode,
  } = useGraphManager();

  const [contextMenu, setContextMenu] = useState(null);
  const { screenToFlowPosition } = useReactFlow();
  const menuBarRef = useRef(null);
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight);
  const [showConfig, setShowConfig] = useState(false);
  const [showRun, setShowRun] = useState(false);


  useEffect(() => {
    const handleResize = () => {
      if (menuBarRef.current) {
        const menuBarHeight = menuBarRef.current.offsetHeight;
        setCanvasHeight(window.innerHeight - menuBarHeight - 10);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAddNode = useCallback(() => {
    if (contextMenu) {
      const newPosition = screenToFlowPosition({ x: contextMenu.mouseX, y: contextMenu.mouseY });
      addNode(newPosition);
      setContextMenu(null);
    }
  }, [contextMenu, addNode, screenToFlowPosition]);

  const handleDeleteNode = useCallback(() => {
    if (contextMenu && contextMenu.nodeId) {
      deleteNode(nodes, setNodes, edges, setEdges, contextMenu.nodeId);
    }
    setContextMenu(null);
  }, [contextMenu, setNodes, setEdges, nodes, edges]);

  const handleDeleteEdge = useCallback(() => {
    if (contextMenu && contextMenu.edgeId) {
      const edge = edges.find((e) => e.id === contextMenu.edgeId);
      if (edge) {
        if (edge.sourceHandle === 'true' || edge.sourceHandle === 'false') {
          deleteConditionEdge(edges, setEdges, contextMenu.edgeId, nodes, setNodes);
        } else {
          deleteEdge(edges, setEdges, contextMenu.edgeId, nodes, setNodes);
        }
      }
    }
    setContextMenu(null);
  }, [contextMenu, setEdges, edges, nodes, setNodes]);

  const handleNodeContextMenu = useCallback((event, node) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX,
      mouseY: event.clientY,
      nodeId: node.id,
      isNode: true,
      isEdge: false,
    });
  }, []);

  const handlePanelContextMenu = useCallback((event) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX,
      mouseY: event.clientY,
      isNode: false,
      isEdge: false,
    });
  }, []);

  const handleEdgeContextMenu = useCallback((event, edge) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX,
      mouseY: event.clientY,
      edgeId: edge.id,
      isNode: false,
      isEdge: true,
    });
  }, []);

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const onConnect = useCallback((params) => {
    const sourceNode = nodes.find(node => node.id === params.source);

    if (params.sourceHandle === 'true') {
      if (sourceNode.data.true_next !== null) {
        alert('True port already has a connection.');
        return;
      }
      createConditionEdge(edges, setEdges, params, nodes, setNodes);
    } else if (params.sourceHandle === 'false') {
      if (sourceNode.data.false_next !== null) {
        alert('False port already has a connection.');
        return;
      }
      createConditionEdge(edges, setEdges, params, nodes, setNodes);
    } else {
      createEdge(edges, setEdges, params, nodes, setNodes);
    }
  }, [setEdges, edges, nodes, setNodes]);

  return (
    <div className="h-screen w-full relative">
      <div className="absolute z-10 w-full">
        <Panel 
            showConfig={showConfig} 
            setShowConfig={setShowConfig}
            showRun={showRun}
            setShowRun={setShowRun}
        />
      </div>

      <div style={{ height: `${canvasHeight}px` }} className="w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeContextMenu={handleNodeContextMenu}
          onPanelContextMenu={handlePanelContextMenu}
          onEdgeContextMenu={handleEdgeContextMenu}
          onClick={handleCloseContextMenu}
          onConnect={onConnect}
          connectionLineStyle={{ stroke: '#ddd', strokeWidth: 2 }}
          connectOnClick={false}
          nodeTypes={nodeTypes}
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
      {contextMenu && (
        <div
          className="absolute bg-white border border-gray-300 z-1000 p-2"
          style={{
            top: contextMenu.mouseY,
            left: contextMenu.mouseX,
          }}
        >
          {contextMenu.isNode ? (
            <button onClick={handleDeleteNode} className="block bg-red-500 hover:bg-red-700 text-white font-bold px-2 rounded">Delete Node</button>
          ) : contextMenu.isEdge ? (
            <button onClick={handleDeleteEdge} className="block bg-red-500 hover:bg-red-700 text-white font-bold px-2 rounded">Delete Edge</button>
          ) : (
            <button onClick={handleAddNode} className="block bg-green-500 hover:bg-green-700 text-white font-bold px-2 rounded">Add Node</button>
          )}
          <button onClick={handleCloseContextMenu} className="block bg-gray-500 hover:bg-gray-700 text-white font-bold px-2 rounded">Cancel</button>
        </div>
      )}
    </div>
  );
}

export default Canvas;