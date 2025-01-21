// NodeData.ts

export interface ReactFlowNodeEXT {
    type: string;
    name?: string | undefined;
    description?: string | undefined;
    tool?: string | undefined;
    prevs?: string[];
    nexts?: string[];
    true_next?: string | null | undefined;
    false_next?: string | null | undefined;
    info?: string | undefined;
}

export interface ReactNodeProps {
    id: string;
    width: number;
    height: number;
    position: { x: number, y: number }
    data: ReactFlowNodeEXT;
    onNodeDataChange?: (id: string, newData: ReactFlowNodeEXT) => void;
}

export interface JsonNodeData {
    uniq_id?: string;
    name?: string | undefined;
    description?: string | undefined;
    nexts?: string[] | undefined;
    type?: string;
    tool?: string | undefined;
    true_next?: string | null | undefined;
    false_next?: string | null | undefined;
    ext?: {
        pos_x: number;
        pos_y: number;
        width: number;
        height: number;
        info?: string | undefined; // info can be string or undefined
    };
}

export const JsonToReactNode = (jsonData: JsonNodeData, position?: { x: number, y: number }): ReactNodeProps => {
    const { uniq_id, ext, ...rest } = jsonData; // Extract uniq_id and ext

    const reactNodeData: ReactFlowNodeEXT = {
        type: rest.type || "STEP",
        name: rest.name,
        description: rest.description,
        tool: rest.tool,
        nexts: rest.nexts || [],
        true_next: rest.true_next,
        false_next: rest.false_next,
        info: ext?.info,
        prevs: [],
    };

    return {
        id: uniq_id || String(Math.random()), // If uniq_id doesn't exist, create random one
        width: ext?.width || 200,
        height: ext?.height || 200,
        position: position || { x: 0, y: 0 },
        data: reactNodeData,
    };
};

export const ReactToJsonNode = (reactNode: ReactNodeProps): JsonNodeData => {
    const { id, data, width, height, position } = reactNode;
    const { type, name, description, tool, nexts, true_next, false_next, info } = data;

    const ext: JsonNodeData['ext'] = {
        pos_x: position.x,
        pos_y: position.y,
        width,
        height,
        info // directly assign the info, which is string | undefined
    };

    return {
        uniq_id: id,
        type,
        name,
        description,
        tool,
        nexts,
        true_next,
        false_next,
        ext
    };
};