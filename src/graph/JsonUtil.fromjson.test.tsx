// JsonUtil.fromjson.test.tsx

import { describe, it, expect } from 'vitest';
import { jsonToSubGraph, jsonToSubGraphs, JsonSubGraph } from './JsonUtil';
import { SubGraph } from './GraphContext';

describe('JsonUtil from JSON', () => {
    it('should convert a JSON subgraph to a SubGraph object correctly', () => {
        const jsonSubGraph: JsonSubGraph = {
            name: "testGraph",
            nodes: [
                {
                    uniq_id: '1',
                    type: 'START',
                    name: "Start Node",
                    description: "This is the start",
                    tool: '',
                    nexts: [],
                    true_next: null,
                    false_next: null,
                    ext: { pos_x: 100, pos_y: 100, width: 200, height: 200, info: null },
                },
                {
                    uniq_id: '2',
                    type: 'STEP',
                    name: "",
                    description: "",
                    tool: 'someTool',
                    nexts: ['3'],
                    true_next: '3',
                    false_next: null,
                    ext: { pos_x: 200, pos_y: 200, width: 250, height: 150, info: null },
                },
                {
                    uniq_id: '3',
                    type: 'END',
                    name: "",
                    description: "",
                    tool: "",
                    nexts: [],
                    true_next: null,
                    false_next: null,
                    ext: { pos_x: 300, pos_y: 300, width: 200, height: 200, info: null }
                }
            ],
            serial_number: 3,
        };

        const expectedSubGraph: SubGraph = {
            graphName: "testGraph",
            nodes: [
                {
                    id: '1',
                    type: 'custom',
                    position: { x: 100, y: 100 },
                    width: 200,
                    height: 200,
                    data: { type: 'START', name: "Start Node", description: "This is the start", tool: '', nexts: [], true_next: null, false_next: null,  info: null , prevs: []}
                },
                {
                    id: '2',
                    type: 'custom',
                    position: { x: 200, y: 200 },
                    width: 250,
                    height: 150,
                    data: { type: 'STEP', name: '', description: '', tool: 'someTool', nexts: ['3'], true_next: '3', false_next: null,  info: null , prevs: []}
                },
                {
                    id: '3',
                    type: 'custom',
                    position: { x: 300, y: 300 },
                    width: 200,
                    height: 200,
                    data: { type: 'END', name: '', description: '', tool: '', nexts: [], true_next: null, false_next: null, info: null, prevs: [] }
                }
            ],
            edges: [
                {
                    id: '2-3',
                    source: '2',
                    target: '3',
                    type: 'custom',
                    data: { sourceNode: '2', targetNode: '3' }
                },
                {
                    id: '2-3-true',
                    source: '2',
                    target: '3',
                    type: 'custom',
                    sourceHandle: 'true',
                    data: { sourceNode: '2', targetNode: '3' }
                },
            ],
            serial_number: 3,
        };


        const result = jsonToSubGraph(jsonSubGraph);
        console.log("jsonToSubGraph Output:", JSON.stringify(result, null, 2));
        expect(result).toEqual(expectedSubGraph);
    });


    it('should convert a JSON subgraph without positions and sizes', () => {
        const jsonSubGraph: JsonSubGraph = {
            name: "testGraph",
            nodes: [
                {
                    uniq_id: '1',
                    type: 'START',
                    name: "Start Node",
                    description: "This is the start",
                    tool: '',
                    nexts: [],
                    true_next: null,
                    false_next: null,
                    ext: { },
                },
                {
                    uniq_id: '2',
                    type: 'STEP',
                    name: "",
                    description: "",
                    tool: 'someTool',
                    nexts: ['3'],
                    true_next: '3',
                    false_next: null,
                    ext: {},
                },
            ],
            serial_number: 3,
        };

        const expectedSubGraph: SubGraph = {
            graphName: "testGraph",
            nodes: [
                {
                    id: '1',
                    type: 'custom',
                    position: { x: 0, y: 0 },
                    width: 200,
                    height: 200,
                    data: { type: 'START', name: "Start Node", description: "This is the start", tool: '', nexts: [], true_next: null, false_next: null, info: null, prevs: []}
                },
                {
                    id: '2',
                    type: 'custom',
                    position: { x: 0, y: 0 },
                    width: 200,
                    height: 200,
                    data: { type: 'STEP', name: '', description: '', tool: 'someTool', nexts: ['3'], true_next: '3', false_next: null, info: null, prevs: []}
                },
            ],
            edges: [
                {
                    id: '2-3',
                    source: '2',
                    target: '3',
                    type: 'custom',
                    data: { sourceNode: '2', targetNode: '3' }
                },
                {
                    id: '2-3-true',
                    source: '2',
                    target: '3',
                    type: 'custom',
                    sourceHandle: 'true',
                    data: { sourceNode: '2', targetNode: '3' }
                },
            ],
            serial_number: 3,
        };


        const result = jsonToSubGraph(jsonSubGraph);
        console.log("jsonToSubGraph no position Output:", JSON.stringify(result, null, 2));
        expect(result).toEqual(expectedSubGraph);
    });


    it('should convert an array of JSON subgraphs to an array of SubGraph objects correctly', () => {
        const jsonSubGraphs: JsonSubGraph[] = [
            {
                name: "graph1",
                nodes: [
                    {
                        uniq_id: '1',
                        type: 'START',
                        name: "",
                        description: "",
                        tool: "",
                        nexts: [],
                        true_next: null,
                        false_next: null,
                        ext: { pos_x: 100, pos_y: 100, width: 200, height: 200, info: null }
                    }
                ],
                serial_number: 1,
            },
            {
                name: "graph2",
                nodes: [
                    {
                        uniq_id: '2',
                        type: 'STEP',
                        name: "",
                        description: "",
                        tool: "test",
                        nexts: [],
                        true_next: null,
                        false_next: null,
                        ext: { pos_x: 200, pos_y: 200, width: 200, height: 200, info: null },
                    }
                ],
                serial_number: 2,
            },
        ];


        const expectedSubGraphs: SubGraph[] = [
            {
                graphName: "graph1",
                nodes: [
                    {
                        id: '1',
                        type: 'custom',
                        position: { x: 100, y: 100 },
                        width: 200,
                        height: 200,
                        data: { type: 'START', name: "", description: "", tool: "", nexts: [], true_next: null, false_next: null, info: null, prevs: [] }
                    }
                ],
                edges: [],
                serial_number: 1,
            },
            {
                graphName: "graph2",
                nodes: [
                    {
                        id: '2',
                        type: 'custom',
                        position: { x: 200, y: 200 },
                        width: 200,
                        height: 200,
                        data: { type: 'STEP', name: "", description: "", tool: "test", nexts: [], true_next: null, false_next: null, info: null, prevs: [] }
                    }
                ],
                edges: [],
                serial_number: 2,
            },
        ];


        const result = jsonToSubGraphs(jsonSubGraphs);
        console.log("jsonToSubGraphs Output:", JSON.stringify(result, null, 2));
        expect(result).toEqual(expectedSubGraphs);
    });
});