// Graph/JsonUtil.tsx

import { ReactToJsonNode, ReactNodeProps, ReactFlowNodeEXT, JsonToReactNode, JsonNodeData } from './NodeData';
import { SubGraph } from './GraphContext';
import { Node, Edge } from '@xyflow/react';

// Type guard to check if an object is a ReactFlowNodeEXT
function isReactFlowNodeEXT(data: any): data is ReactFlowNodeEXT {
    return (
        typeof data === 'object' &&
        data !== null &&
        typeof (data as ReactFlowNodeEXT).type === 'string'
    );
}

export const subGraphToJson = (subGraph: SubGraph) => {
    const jsonNodes = subGraph.nodes.map(node => {
        let nodeData: ReactFlowNodeEXT;
        if (isReactFlowNodeEXT(node.data)) {
            nodeData = node.data;
        } else {
            // Handle the case where node.data is not a ReactFlowNodeEXT
            console.error("Invalid node data:", node.data);
            nodeData = { type: "STEP" };  // Providing default values to avoid potential errors
        }
        const reactNodeProps: ReactNodeProps = {
            id: node.id,
            width: node.width || 200,
            height: node.height || 200,
            position: node.position,
            data: nodeData,
        };
        return ReactToJsonNode(reactNodeProps);
    });

    return {
        name: subGraph.graphName,
        nodes: jsonNodes,
        serial_number: subGraph.serial_number
    }
};

export const allSubGraphsToJson = (subGraphs: SubGraph[]) => {
    return subGraphs.map(subGraphToJson);
};


export interface JsonSubGraph {
    name: string;
    nodes: JsonNodeData[];
    serial_number: number;
}


export const jsonToSubGraph = (json: JsonSubGraph): SubGraph => {
    const nodes: Node[] = json.nodes.map(nodeJson => {
        const reactNodeProps = JsonToReactNode(nodeJson, { x: nodeJson.ext?.pos_x || 0, y: nodeJson.ext?.pos_y || 0 });
        const { data, ...rest } = reactNodeProps;
        return {
            type: 'custom',
            ...rest,
            data: data as unknown as Record<string, unknown>,
        };
    });

    const edges: Edge[] = [];

    nodes.forEach(node => {
        const nodeData = node.data as any;


        if (nodeData.nexts && Array.isArray(nodeData.nexts)) {
            nodeData.nexts.forEach((nextId:string) => {
                const newEdge: Edge = {
                    id: `${node.id}-${nextId}`,
                    source: node.id,
                    target: nextId,
                    type: 'custom',
                    data: {
                        sourceNode: node.id,
                        targetNode: nextId
                    }
                };
                edges.push(newEdge);
            });
        }

        if (nodeData.true_next) {
            const newEdge: Edge = {
                id: `${node.id}-${nodeData.true_next}-true`,
                source: node.id,
                target: nodeData.true_next,
                sourceHandle: 'true',
                type: 'custom',
                data: {
                    sourceNode: node.id,
                    targetNode: nodeData.true_next
                }
            };
            edges.push(newEdge);
        }
        if (nodeData.false_next) {
            const newEdge: Edge = {
                id: `${node.id}-${nodeData.false_next}-false`,
                source: node.id,
                target: nodeData.false_next,
                sourceHandle: 'false',
                type: 'custom',
                data: {
                    sourceNode: node.id,
                    targetNode: nodeData.false_next
                }
            };
            edges.push(newEdge);
        }
    });


    return {
        graphName: json.name,
        nodes,
        edges,
        serial_number: json.serial_number,
    };
};

export const jsonToSubGraphs = (jsonArray: JsonSubGraph[]): SubGraph[] => {
    return jsonArray.map(jsonToSubGraph);
};