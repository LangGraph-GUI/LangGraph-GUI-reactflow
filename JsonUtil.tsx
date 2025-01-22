// Graph/JsonUtil.tsx

import { ReactToJsonNode, ReactNodeProps, ReactFlowNodeEXT } from './NodeData';
import { SubGraph } from './GraphContext';

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