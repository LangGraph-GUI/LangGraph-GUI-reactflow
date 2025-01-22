// JsonUtil.test.tsx

import { describe, it, expect, vi } from 'vitest';
import { subGraphToJson, allSubGraphsToJson } from './JsonUtil';
import { SubGraph } from './GraphContext';
import { Node } from '@xyflow/react';

describe('JsonUtil', () => {
    it('should convert a subGraph to JSON correctly', () => {
        const mockSubGraph: SubGraph = {
            graphName: "testGraph",
            nodes: [
                {
                    id: '1',
                    type: 'custom',
                    position: { x: 100, y: 100 },
                    width: 200,
                    height: 200,
                    data: { type: "START", name: "Start Node", description: "This is the start" } ,
                } as Node,
                {
                    id: '2',
                    type: 'custom',
                    position: { x: 200, y: 200 },
                    width: 250,
                    height: 150,
                    data: { type: "STEP", tool: "someTool", nexts:['3'], true_next: '3'} ,
                } as Node,
                  {
                      id: '3',
                      type: 'custom',
                      position: {x: 300, y: 300},
                      data:{ type: "END"} ,
                  } as Node,
            ],
            edges: [],
            serial_number: 3,
        };
        
        const expectedJson = {
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
                    nexts: [ '3' ],
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

        const result = subGraphToJson(mockSubGraph);
        console.log("subGraphToJson Output:", JSON.stringify(result, null, 2));
        expect(result).toEqual(expectedJson);
    });


    it('should handle missing properties and default type for node.data', () => {
        const mockSubGraph: SubGraph = {
            graphName: "testGraph",
            nodes: [
               {
                   id: '1',
                   type: 'custom',
                   position: { x: 100, y: 100 },
                   data: { } as any, //missing type
               } as Node,
                 {
                     id: '2',
                     type: 'custom',
                     position: { x: 200, y: 200 },
                     data: {type:"STEP", tool:"test"} ,
                 } as Node
            ],
            edges: [],
            serial_number: 1,
        };


        const expectedJson = {
            name: "testGraph",
            nodes:[
                {
                    uniq_id: '1',
                    type: 'STEP',
                    name: "",
                    description: "",
                    tool: "",
                    nexts: [],
                    true_next: null,
                    false_next: null,
                    ext: { pos_x: 100, pos_y: 100, width: 200, height: 200, info: null }
                },
                {
                    uniq_id: '2',
                    type: 'STEP',
                    name: "",
                    description: "",
                    tool: "test",
                    nexts: [],
                    true_next: null,
                    false_next: null,
                    ext: { pos_x: 200, pos_y: 200, width: 200, height: 200, info: null }
                }
            ],
            serial_number: 1
        }
        
        // Mock console.error to check if it's called for invalid node data
        const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});
        
        const result = subGraphToJson(mockSubGraph);
        console.log("subGraphToJson Output (missing properties):", JSON.stringify(result, null, 2));
        expect(result).toEqual(expectedJson);
        expect(consoleErrorMock).toHaveBeenCalled();
        consoleErrorMock.mockRestore();
    });

    it('should convert all subgraphs to JSON correctly', () => {
        const mockSubGraphs: SubGraph[] = [
            {
                graphName: "graph1",
                nodes: [
                   {
                       id: '1',
                       type: 'custom',
                       position: { x: 100, y: 100 },
                       data: { type: "START"} ,
                   } as Node
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
                        data: { type: "STEP", tool:"test"} ,
                    } as Node
                ],
                edges: [],
                serial_number: 2,
            },
        ];
        const expectedJson = [
            {
                name: "graph1",
                nodes:[
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
                    },
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
                        ext: { pos_x: 200, pos_y: 200, width: 200, height: 200, info: null }
                    },
                ],
                serial_number: 2,
            },
        ];
        const result = allSubGraphsToJson(mockSubGraphs);
        console.log("allSubGraphsToJson Output:", JSON.stringify(result, null, 2));
        expect(result).toEqual(expectedJson);
    });
});