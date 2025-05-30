// NodeData.fromjson.test.tsx
import { describe, it, expect } from 'vitest';
import { JsonToReactNode, JsonNodeData } from './NodeData';

describe('JsonToReactNode', () => {
    it('should convert JSON node data to React node props correctly', () => {
        const jsonNodeData: JsonNodeData = {
            uniq_id: '123',
            name: 'Test Node',
            description: 'This is a test node',
            tool: 'testTool',
            nexts: ['456'],
            true_next: '789',
            false_next: null,
            type: 'STEP',
            ext: {
                pos_x: 100,
                pos_y: 200,
                width: 250,
                height: 150,
                info: 'Additional info'
            }
        };
        
        const expectedReactNodeProps = {
            id: '123',
            width: 250,
            height: 150,
            position: { x: 100, y: 200 },
            data: {
                type: 'STEP',
                name: 'Test Node',
                description: 'This is a test node',
                tool: 'testTool',
                nexts: ['456'],
                true_next: '789',
                false_next: null,
                info: 'Additional info',
                prevs: [],
            }
        };

        const reactNodeProps = JsonToReactNode(jsonNodeData);
        expect(reactNodeProps).toEqual(expectedReactNodeProps);
    });

    it('should handle missing optional fields in JSON data', () => {
        const jsonNodeData: JsonNodeData = {
            uniq_id: '456',
            name: 'Another Node',
            description: '',
            tool: 'anotherTool',
            nexts: [],
            true_next: null,
            false_next: null,
            ext: {}
        };

        const expectedReactNodeProps = {
            id: '456',
            width: 200,
            height: 200,
            position: { x: 0, y: 0 },
            data: {
                type: 'STEP',
                name: 'Another Node',
                description: '',
                tool: 'anotherTool',
                nexts: [],
                true_next: null,
                false_next: null,
                info: null,
                prevs: [],
            }
        };

        const reactNodeProps = JsonToReactNode(jsonNodeData);
        expect(reactNodeProps).toEqual(expectedReactNodeProps);
    });

    it('should use a default type if not provided', () => {
        const jsonNodeData: JsonNodeData = {
            uniq_id: '789',
            name: 'Type Missing Node',
            description: 'This node has no type',
            tool: 'defaultTool',
            nexts: [],
            true_next: null,
            false_next: null,
            ext: {
                pos_x: 50,
                pos_y: 75,
                width: 100,
                height: 100,
                info: null
            }
        };

        const expectedReactNodeProps = {
            id: '789',
            width: 100,
            height: 100,
            position: { x: 50, y: 75 },
            data: {
                type: 'STEP',
                name: 'Type Missing Node',
                description: 'This node has no type',
                tool: 'defaultTool',
                nexts: [],
                true_next: null,
                false_next: null,
                info: null,
                prevs: [],
            }
        };

        const reactNodeProps = JsonToReactNode(jsonNodeData);
        expect(reactNodeProps).toEqual(expectedReactNodeProps);
    });
    
    it('should handle info as null correctly', () => {
        const jsonNodeData: JsonNodeData = {
            uniq_id: '999',
            name: 'Info Null Node',
            description: 'This node has null info',
            tool: 'testTool',
            nexts: [],
            true_next: null,
            false_next: null,
            ext: {
                pos_x: 100,
                pos_y: 200,
                width: 200,
                height: 100,
                info: null,
            },
        };

        const expectedReactNodeProps = {
            id: '999',
            width: 200,
            height: 100,
            position: { x: 100, y: 200 },
            data: {
                type: 'STEP',
                name: 'Info Null Node',
                description: 'This node has null info',
                tool: 'testTool',
                nexts: [],
                true_next: null,
                false_next: null,
                info: null,
                prevs: [],
            },
        };

        const reactNodeProps = JsonToReactNode(jsonNodeData);
        expect(reactNodeProps).toEqual(expectedReactNodeProps);
    });
    it('should handle undefined info correctly', () => {
        const jsonNodeData: JsonNodeData = {
            uniq_id: '999',
            name: 'Info Undefined Node',
            description: 'This node has undefined info',
            tool: 'testTool',
            nexts: [],
            true_next: null,
            false_next: null,
            ext: {
                pos_x: 100,
                pos_y: 200,
                width: 200,
                height: 100,
            },
        };

        const expectedReactNodeProps = {
            id: '999',
            width: 200,
            height: 100,
            position: { x: 100, y: 200 },
            data: {
                type: 'STEP',
                name: 'Info Undefined Node',
                description: 'This node has undefined info',
                tool: 'testTool',
                nexts: [],
                true_next: null,
                false_next: null,
                info: null,
                prevs: [],
            },
        };

        const reactNodeProps = JsonToReactNode(jsonNodeData);
        expect(reactNodeProps).toEqual(expectedReactNodeProps);
    });
});