// GraphContext.addnode.test.tsx

import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { useGraph, GraphProvider } from './GraphContext';
import { describe, it, expect } from 'vitest';

const TestComponent: React.FC = () => {
    const graphContext = useGraph();
    
    const addTestNodes = () => {
        const testGraph = {
            graphName: "test",
            nodes: [
                {
                    id: "1",
                    type: "custom",
                    position: { x: 100, y: 100 },
                    data: { type: "START" }
                },
                {
                    id: "2",
                    type: "custom",
                    position: { x: 200, y: 250 },
                    data: { 
                        type: "INFO",
                        description: "test for flow"
                    }
                },
                {
                    id: "3",
                    type: "custom",
                    position: { x: 300, y: 330 },
                    data: { 
                        type: "STEP",
                        description: "try use a tool",
                        tool: "save_file"
                    }
                }
            ],
            edges: [],
            serial_number: 4
        };
        graphContext.updateSubGraph("test", testGraph);
    };
    
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

describe('GraphContext', () => {
    it('should manage subgraphs correctly', async () => {
        render(
            <GraphProvider>
                <TestComponent />
            </GraphProvider>
        );

        const testComponent = screen.getByTestId("test-component");
        expect(testComponent).toBeInTheDocument();

        const addRootButton = screen.getByTestId("add-root-button");
        const addSubGraphButton = screen.getByTestId("add-subgraph-button");
        const addNodesButton = screen.getByTestId("add-nodes-button");
         
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
    });
});