// Graph/JsonUtil.tsx

import { GraphContextType, SubGraph } from './GraphContext';
import { JsonNodeData, ReactNodeProps, ReactToJsonNode } from './NodeData';

interface JsonSubGraph {
    graphName: string;
    nodes: JsonNodeData[];
    serial_number: number;
}

export const graphContextToJson = (graphContext: GraphContextType): string => {
    const jsonSubGraphs: JsonSubGraph[] = graphContext.subGraphs.map((subGraph: SubGraph) => {
        const jsonNodes: JsonNodeData[] = subGraph.nodes.map((node: any) => {
            return ReactToJsonNode(node as ReactNodeProps)
        });

        return {
            graphName: subGraph.graphName,
            nodes: jsonNodes,
            serial_number: subGraph.serial_number,
        };
    });

    return JSON.stringify(jsonSubGraphs, null, 2);
};