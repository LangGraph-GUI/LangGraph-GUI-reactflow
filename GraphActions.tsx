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

    const handleAddNode = useCallback(({ contextMenu, setContextMenu, screenToFlowPosition }: AddNodeProps) => {
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
    }, [currentGraph, updateSubGraph, currentGraphName]);


    const handleDeleteNode = useCallback((contextMenu: ContextMenuProps | null, setContextMenu: React.Dispatch<React.SetStateAction<ContextMenuProps | null>>) => {
        if (contextMenu && contextMenu.nodeId) {
            const nodeToDeleteId = contextMenu.nodeId;
            let updatedNodes = currentGraph().nodes.filter((node) => node.id !== nodeToDeleteId)
            const updatedEdges = currentGraph().edges.filter((edge) => edge.source !== nodeToDeleteId && edge.target !== nodeToDeleteId);


            // Update prevs and nexts on deletion
            updatedNodes = updatedNodes.map((node) => {
                const updatedNode = { ...node };

                //remove all next ref
                if (Array.isArray(updatedNode.data.nexts) && updatedNode.data.nexts.includes(nodeToDeleteId)) {
                    (updatedNode.data.nexts as string[]) = updatedNode.data.nexts.filter(next => next !== nodeToDeleteId)
                }
                if (updatedNode.data.true_next === nodeToDeleteId) {
                    updatedNode.data.true_next = null
                }
                if (updatedNode.data.false_next === nodeToDeleteId) {
                    updatedNode.data.false_next = null;
                }

                //remove all prev ref
                if (Array.isArray(updatedNode.data.prevs) && updatedNode.data.prevs.includes(nodeToDeleteId)) {
                    (updatedNode.data.prevs as string[]) = updatedNode.data.prevs.filter(prev => prev !== nodeToDeleteId);
                }

                return updatedNode
            })

            updateSubGraph(currentGraphName, {
                ...currentGraph(),
                nodes: updatedNodes,
                edges: updatedEdges
            });
            setContextMenu(null);
        }
    }, [updateSubGraph, currentGraph, currentGraphName]);


    const handleDeleteEdge = useCallback((contextMenu: ContextMenuProps | null, setContextMenu: React.Dispatch<React.SetStateAction<ContextMenuProps | null>>) => {
        if (contextMenu && contextMenu.edgeId) {
            const edgeToDeleteId = contextMenu.edgeId;
            const edgeToDelete = currentGraph().edges.find((edge) => edge.id === edgeToDeleteId);

            if (!edgeToDelete) return;

            const updatedEdges = currentGraph().edges.filter((edge) => edge.id !== edgeToDeleteId);
            const updatedNodes = currentGraph().nodes.map(node => {
                const updatedNode = { ...node };

                if (updatedNode.id === edgeToDelete.source) {
                    if (Array.isArray(updatedNode.data.nexts) && updatedNode.data.nexts.includes(edgeToDelete.target)){
                        (updatedNode.data.nexts as string[]) = updatedNode.data.nexts.filter(next => next !== edgeToDelete.target)
                    }
                    if (updatedNode.data.true_next === edgeToDelete.target){
                        updatedNode.data.true_next = null
                    }
                    if (updatedNode.data.false_next === edgeToDelete.target){
                        updatedNode.data.false_next = null;
                    }

                } else if (updatedNode.id === edgeToDelete.target) {
                    if (Array.isArray(updatedNode.data.prevs) && updatedNode.data.prevs.includes(edgeToDelete.source)){
                        (updatedNode.data.prevs as string[]) = updatedNode.data.prevs.filter(prev => prev !== edgeToDelete.source)
                    }

                }

                return updatedNode
            })

            updateSubGraph(currentGraphName, {
                ...currentGraph(),
                edges: updatedEdges,
                nodes: updatedNodes
            });
            setContextMenu(null);
        }
    }, [currentGraph, currentGraphName, updateSubGraph])

    const handleAddEdge = useCallback((connection: Connection) => {
        const sourceNode = currentGraph().nodes.find(node => node.id === connection.source)
        const targetNode = currentGraph().nodes.find(node => node.id === connection.target)
        if(!sourceNode || !targetNode) return;

        const newEdge: Edge = {
            id: `${connection.source}-${connection.target}-${connection.sourceHandle || ""}`,
            source: connection.source,
            target: connection.target,
            sourceHandle: connection.sourceHandle,
            type: "custom",
            data:{
                sourceNode: connection.source,
                targetNode: connection.target
            }
        }
       
        const updatedNodes = currentGraph().nodes.map(node =>{
            const updatedNode = { ...node }
            if (updatedNode.id === connection.source){
                if(!updatedNode.data.nexts) {
                    updatedNode.data.nexts = []
                }
                
                if (! (updatedNode.data.nexts as string[]).includes(connection.target)){
                    (updatedNode.data.nexts as string[]).push(connection.target);
                }
                if (connection.sourceHandle === 'true'){
                    updatedNode.data.true_next = connection.target
                }
                if (connection.sourceHandle === 'false'){
                    updatedNode.data.false_next = connection.target
                }

            } else if(updatedNode.id === connection.target){
                if(!updatedNode.data.prevs) {
                    updatedNode.data.prevs = []
                }
                if (! (updatedNode.data.prevs as string[]).includes(connection.source)){
                    (updatedNode.data.prevs as string[]).push(connection.source)
                }

            }

            return updatedNode;
        })


        const updatedEdges = [...currentGraph().edges, newEdge];
        updateSubGraph(currentGraphName, {
            ...currentGraph(),
            edges: updatedEdges,
            nodes: updatedNodes
        });

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

    return { handleAddNode, handleDeleteNode, handleDeleteEdge, handlePanelContextMenu, handleAddEdge }
}