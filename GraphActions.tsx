// Graph/GraphActions.tsx

import { useCallback } from 'react';
import { useGraph } from './GraphContext';
import { Edge, Connection } from '@xyflow/react';


interface ContextMenuProps {
    mouseX: number;
    mouseY: number;
    nodeId: string | null;
    edgeId: string | null;
    type: 'panel' | 'node' | 'edge';
}

interface AddNodeProps {
    contextMenu: ContextMenuProps | null;
    setContextMenu: React.Dispatch<React.SetStateAction<ContextMenuProps | null>>;
    screenToFlowPosition: ((pos: { x: number; y: number }) => { x: number; y: number }) | null;
}

export const useGraphActions = () => {
    const { currentGraphName, updateSubGraph, getCurrentGraph } = useGraph();
    const currentGraph = useCallback(() => getCurrentGraph(), [getCurrentGraph]);
    
    const handleAddNode = useCallback(({contextMenu, setContextMenu, screenToFlowPosition} : AddNodeProps) => {
        if (contextMenu && contextMenu.type === 'panel' && screenToFlowPosition) {
            const newPosition = screenToFlowPosition({ x: contextMenu.mouseX, y: contextMenu.mouseY });
            const newNodeId = String(currentGraph().serial_number + 1);
            const newNode = {
                id: newNodeId,
                type: 'custom',
                position: newPosition,
                width: 150,
                height: 200,
                data: { type: "STEP" },
            };
            const updatedNodes = [...currentGraph().nodes, newNode]
            updateSubGraph(currentGraphName, {
                ...currentGraph(),
                nodes: updatedNodes,
                serial_number: currentGraph().serial_number + 1,
            }
            );
            setContextMenu(null);
        }
    }, [ currentGraph, updateSubGraph, currentGraphName]);
    
    
    const handleDeleteNode = useCallback((contextMenu: ContextMenuProps | null, setContextMenu: React.Dispatch<React.SetStateAction<ContextMenuProps | null>>) => {
        if (contextMenu && contextMenu.nodeId) {
            const nodeToDelete = contextMenu.nodeId;
            const updatedNodes = currentGraph().nodes.filter((node) => node.id !== nodeToDelete);
            const updatedEdges = currentGraph().edges.filter((edge) => edge.source !== nodeToDelete && edge.target !== nodeToDelete);

            updateSubGraph(currentGraphName, {
                ...currentGraph(),
                nodes: updatedNodes,
                edges: updatedEdges
            });
            setContextMenu(null);
        }
    }, [ updateSubGraph, currentGraph, currentGraphName]);


    const handleDeleteEdge = useCallback((contextMenu: ContextMenuProps | null, setContextMenu: React.Dispatch<React.SetStateAction<ContextMenuProps | null>>)=>{
        if(contextMenu && contextMenu.edgeId){
            const edgeToDelete = contextMenu.edgeId;
            const updatedEdges = currentGraph().edges.filter((edge) => edge.id !== edgeToDelete);

            updateSubGraph(currentGraphName,{
                ...currentGraph(),
                edges: updatedEdges
            });
            setContextMenu(null);
        }
    }, [currentGraph, currentGraphName, updateSubGraph])

    const handleAddEdge = useCallback((connection: Connection) => {
        const newEdge : Edge = {
            id: `${connection.source}-${connection.target}-${connection.sourceHandle || ""}`,
            source: connection.source,
            target: connection.target,
            sourceHandle: connection.sourceHandle,
            type: "custom"
        }
        const updatedEdges = [...currentGraph().edges, newEdge];

        updateSubGraph(currentGraphName,{
            ...currentGraph(),
            edges: updatedEdges
        });
        
    },[currentGraph, currentGraphName, updateSubGraph])
    
    const handlePanelContextMenu = useCallback((event: React.MouseEvent, setContextMenu: React.Dispatch<React.SetStateAction<ContextMenuProps | null>>) => {
        event.preventDefault();
        const target = event.target as HTMLElement;
        const nodeElement = target.closest('.react-flow__node') as HTMLElement;
        const edgeElement = target.closest('.react-flow__edge') as HTMLElement;

        if (nodeElement) {
            const nodeId = nodeElement.getAttribute("data-id")
            setContextMenu({
                mouseX: event.clientX,
                mouseY: event.clientY,
                nodeId: nodeId,
                edgeId: null,
                type: 'node'
            });
        } else if (edgeElement) {
            const edgeId = edgeElement.getAttribute('data-id');
            setContextMenu({
                mouseX: event.clientX,
                mouseY: event.clientY,
                nodeId: null,
                edgeId: edgeId,
                type: 'edge'
            })
        }
        else {
            setContextMenu({
                mouseX: event.clientX,
                mouseY: event.clientY,
                nodeId: null,
                edgeId: null,
                type: 'panel'
            });
        }

    }, []);

    return { handleAddNode, handleDeleteNode, handleDeleteEdge, handlePanelContextMenu, handleAddEdge }
}