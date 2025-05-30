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
    info?: string | null;
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
    uniq_id: string;
    name: string;
    description: string;
    nexts: string[];
    type?: string;
    tool: string;
    true_next: string | null;
    false_next: string | null;
    ext: {
        pos_x?: number;
        pos_y?: number;
        width?: number;
        height?: number;
        info?: string | null;
    };
}


export const JsonToReactNode = (jsonData: JsonNodeData, position?: { x: number, y: number }): ReactNodeProps => {
    const { uniq_id, ext, ...rest } = jsonData;

    const reactNodeData: ReactFlowNodeEXT = {
        type: rest.type || "STEP",
        name: rest.name,
        description: rest.description,
        tool: rest.tool,
        nexts: rest.nexts || [],
        true_next: rest.true_next,
        false_next: rest.false_next,
        info: ext?.info ?? null,
        prevs: [],
    };

    return {
        id: uniq_id,
        width: ext?.width ?? 200,
        height: ext?.height ?? 200,
        position: position || 
        { 
            x: ext?.pos_x || 0, 
            y: ext?.pos_y || 0 
        },
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
        info: info === undefined ? null : info  // Set info to null if undefined
    };

    return {
        uniq_id: id,
        type,
        name: name || "",
        description: description || "",
        tool: tool || "",
        nexts: nexts || [],
        true_next: true_next == undefined ? null : true_next,
        false_next: false_next == undefined ? null : false_next,
        ext
    };
};