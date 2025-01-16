// NodeData.ts

export interface JsonNodeDataProps {
    uniq_id?: string;
    name?: string;
    description?: string;
    nexts?: string[];
    type?: string;
    tool?: string;
    true_next?: string | null;
    false_next?: string | null;
}

export interface ReactFlowNodeData {
    type: string;
    name?: string;
    description?: string;
    tool?: string;
    nexts?: string[];
    true_next?: string | null;
    false_next?: string | null;
    ext?: string;
}

export interface ReactNodeProps {
    id: string;
    width: number;
    height: number;
    data: ReactFlowNodeData;
    isConnectable?: boolean;
    onNodeDataChange?: (id: string, newData: ReactFlowNodeData) => void;
}