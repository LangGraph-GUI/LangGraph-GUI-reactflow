// Graph/GraphActions.tsx

import { useCallback } from 'react';
import { useGraph } from './GraphContext';

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
    const { subGraphs, currentGraphName, updateSubGraph } = useGraph();

    const getGraph = useCallback((graphName: string) => {
        return subGraphs.find((graph) => graph.graphName === graphName);
    }, [subGraphs]);

    const currentGraph = useCallback(() => getGraph(currentGraphName) || {
        graphName: "root",
        nodes: [],
        edges: [],
        serial_number: 0,
    }, [currentGraphName, getGraph]);
    
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

    return { handleAddNode, handleDeleteNode, handleDeleteEdge, handlePanelContextMenu }
}