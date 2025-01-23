// Graph/JsonUtil.tsx

import { ReactToJsonNode, ReactNodeProps, ReactFlowNodeEXT, JsonToReactNode, JsonNodeData } from './NodeData';
import { SubGraph } from './GraphContext';
import { Node } from '@xyflow/react';

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

    return {
        graphName: json.name,
        nodes,
        edges: [], // Edges need to be handled separately if required
        serial_number: json.serial_number,
    };
};

export const jsonToSubGraphs = (jsonArray: JsonSubGraph[]): SubGraph[] => {
    return jsonArray.map(jsonToSubGraph);
};