// NodeData.ts

export interface JsonNodeData {
    uniq_id?: string;
    name?: string | undefined;
    description?: string | undefined;
    nexts?: string[] | undefined;
    type?: string;
    tool?: string | undefined;
    true_next?: string | null | undefined;
    false_next?: string | null | undefined;
}

export interface ReactFlowNodeEXT {
    type: string;
    name?: string | undefined;
    description?: string | undefined;
    tool?: string | undefined;
    nexts?: string[];
    true_next?: string | null | undefined;
    false_next?: string | null | undefined;
    ext?: string[];
}

export interface ReactNodeProps {
    id: string;
    width: number;
    height: number;
    data: ReactFlowNodeEXT;
    onNodeDataChange?: (id: string, newData: ReactFlowNodeEXT) => void;
}


export const JsonToReactNode = (jsonData: JsonNodeData): ReactNodeProps => {
    const { uniq_id, ...rest } = jsonData; // Extract uniq_id if present
    const reactNodeData: ReactFlowNodeEXT = {
        type: rest.type || "STEP",
        name: rest.name,
        description: rest.description,
        tool: rest.tool,
        nexts: rest.nexts || [],
        true_next: rest.true_next,
        false_next: rest.false_next,
    };

    return {
        id: uniq_id || String(Math.random()), // If uniq_id doesn't exist, create random one
        width: 200,
        height: 200,
        data: reactNodeData,
    };
};

export const ReactToJsonNode = (reactNode: ReactNodeProps): JsonNodeData => {
    const { id, data } = reactNode;
    const { type, name, description, tool, nexts, true_next, false_next } = data;
    return {
        uniq_id: id,
        type,
        name,
        description,
        tool,
        nexts,
        true_next,
        false_next
    };
};