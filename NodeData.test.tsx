// NodeData.test.tsx

import React, { ReactNode } from 'react';
import { render, screen, act } from '@testing-library/react';
import { useGraph, GraphProvider, GraphContextType, SubGraph } from './GraphContext';
import { describe, it, expect, vi } from 'vitest';
import { Node } from '@xyflow/react';
import { ReactToJsonNode, ReactNodeProps, ReactFlowNodeEXT } from './NodeData';


interface TestComponentProps {
    onContextChange?: (context: GraphContextType) => void;
}

const TestComponent: React.FC<TestComponentProps> = ({ onContextChange }) => {
    const graphContext = useGraph();

    React.useEffect(() => {
        if (onContextChange) {
            onContextChange(graphContext);
        }
    }, [graphContext, onContextChange]);

    const addTestNodes = () => {
        const testGraph: SubGraph = {
            graphName: "test",
            nodes: [
                {
                    id: "1",
                    type: "custom",
                    position: { x: 100, y: 100 },
                    data: { type: "START" } // info is not provided here
                } as Node,
                {
                    id: "2",
                    type: "custom",
                    position: { x: 200, y: 250 },
                    data: {
                        type: "INFO",
                        description: "test for flow",
                    } // info is not provided here
                } as Node,
                {
                    id: "3",
                    type: "custom",
                    position: { x: 300, y: 330 },
                    data: {
                        type: "STEP",
                        description: "try use a tool",
                        tool: "save_file",
                    } // info is not provided here
                } as Node
            ],
            edges: [],
            serial_number: 4
        };
        graphContext.updateSubGraph("test", testGraph);
    };

    const convertFirstNodeToJson = () => {
        if (graphContext.subGraphs.length > 0) {
            const testGraph = graphContext.subGraphs.find((graph) => graph.graphName === 'test');
            if (testGraph && testGraph.nodes.length > 0) {
                const jsonNodes = testGraph.nodes.map(node => {
                    const nodeData = node.data as { type: string };
                    const reactNodeProps: ReactNodeProps = {
                        id: node.id,
                        width: 200, // Or use a constant
                        height: 200, // Or use a constant
                        position: node.position,
                        data: {
                            ...node.data,
                            type: nodeData.type,

                        } as ReactFlowNodeEXT,
                    };
                    const jsonNode = ReactToJsonNode(reactNodeProps);
                    return jsonNode;
                })
                console.log("JSON Nodes:", jsonNodes);
            }
        }
    }

    return (
        <div data-testid="test-component">
            <button onClick={() => graphContext.addSubGraph("root")} data-testid="add-root-button">
                Add Root SubGraph
            </button>
            <button onClick={() => graphContext.addSubGraph("test")} data-testid="add-subgraph-button">
                Add Test SubGraph
            </button>
            <button onClick={addTestNodes} data-testid="add-nodes-button">
                Add Test Nodes
            </button>
            <button onClick={convertFirstNodeToJson} data-testid="convert-to-json-button">
                Convert First Node To JSON
            </button>
            <div data-testid="subgraph-count">SubGraph Count: {graphContext.subGraphs.length}</div>
            <div data-testid="has-root-graph">
                Has Root Graph: {graphContext.subGraphs.some(graph => graph.graphName === 'root') ? 'true' : 'false'}
            </div>
            <div data-testid="has-test-graph">
                Has Test Graph: {graphContext.subGraphs.some(graph => graph.graphName === 'test') ? 'true' : 'false'}
            </div>
            <div data-testid="test-graph-nodes">
                Test Graph Nodes: {graphContext.subGraphs.find(graph => graph.graphName === 'test')?.nodes.length || 0}
            </div>
        </div>
    );
};

interface TestWrapperProps {
    children: ReactNode;
}

const TestWrapper: React.FC<TestWrapperProps> = ({ children }) => {
    return (
        <GraphProvider>{children}</GraphProvider>
    );
};

describe('GraphContext', () => {
    it('should manage subgraphs correctly', async () => {
        // Mock console.log to capture its calls
        const consoleLogMock = vi.spyOn(console, 'log');

        const handleContextChange = () => {
            // graphContextValue = context; remove unused variable
        };

        render(
            <TestWrapper>
                <TestComponent onContextChange={handleContextChange} />
            </TestWrapper>
        );

        const testComponent = screen.getByTestId("test-component");
        expect(testComponent).toBeInTheDocument();

        const addRootButton = screen.getByTestId("add-root-button");
        const addSubGraphButton = screen.getByTestId("add-subgraph-button");
        const addNodesButton = screen.getByTestId("add-nodes-button");
        const convertToJsonButton = screen.getByTestId("convert-to-json-button");


        // Add root and test subgraph
        await act(async () => {
            addRootButton.click();
        });
        await act(async () => {
            addSubGraphButton.click();
        });

        let subGraphCountElement = screen.getByTestId("subgraph-count");
        expect(subGraphCountElement).toHaveTextContent("SubGraph Count: 2");

        let hasRootElement = screen.getByTestId("has-root-graph");
        expect(hasRootElement).toHaveTextContent("Has Root Graph: true");

        let hasTestElement = screen.getByTestId("has-test-graph");
        expect(hasTestElement).toHaveTextContent("Has Test Graph: true");

        // Add nodes to test subgraph
        await act(async () => {
            addNodesButton.click();
        });



        const testGraphNodesElement = screen.getByTestId("test-graph-nodes");
        expect(testGraphNodesElement).toHaveTextContent("Test Graph Nodes: 3");

        // Convert first node to JSON
        await act(async () => {
            convertToJsonButton.click();
        });

        // Check if console.log was called with the correct JSON
        expect(consoleLogMock).toHaveBeenCalled();
        const consoleArgs = consoleLogMock.mock.calls[0];
        expect(consoleArgs[0]).toBe("JSON Nodes:");
        const jsonOutput = consoleArgs[1];
        expect(jsonOutput).toEqual([
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
            {
                uniq_id: '2',
                type: 'INFO',
                name: "",
                description: 'test for flow',
                tool: "",
                nexts: [],
                true_next: null,
                false_next: null,
                ext: { pos_x: 200, pos_y: 250, width: 200, height: 200, info: null }
            },
            {
                uniq_id: '3',
                type: 'STEP',
                name: "",
                description: 'try use a tool',
                tool: 'save_file',
                nexts: [],
                true_next: null,
                false_next: null,
                ext: { pos_x: 300, pos_y: 330, width: 200, height: 200, info: null }
            }
        ]);

        // Try adding root again, should not change the count
        await act(async () => {
            addRootButton.click();
        });
        subGraphCountElement = screen.getByTestId("subgraph-count");
        expect(subGraphCountElement).toHaveTextContent("SubGraph Count: 2");

        hasRootElement = screen.getByTestId("has-root-graph");
        expect(hasRootElement).toHaveTextContent("Has Root Graph: true");
        hasTestElement = screen.getByTestId("has-test-graph");
        expect(hasTestElement).toHaveTextContent("Has Test Graph: true");
        // Restore the original console.log
        consoleLogMock.mockRestore();
    });
});