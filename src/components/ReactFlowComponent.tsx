/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Background,
    Node,
    ReactFlow,
    ReactFlowProvider,
    useReactFlow,
    type Edge
} from '@xyflow/react';
import { useCallback, useRef } from 'react';

import { useVeltInitState } from '@veltdev/react';
import { useVeltReactFlowCrdtExtension } from '@veltdev/reactflow-crdt';
import '@xyflow/react/dist/style.css';

const getId = () => {
    return crypto.randomUUID();
}
const firstNodeId = getId();
const initialNodes = [
    {
        id: firstNodeId,
        type: 'input',
        data: { label: `Node ${firstNodeId}` },
        position: { x: 0, y: 50 },
    },
];
const initialEdges: Edge[] = [];

const nodeOrigin: [number, number] = [0.5, 0];

const AddNodeOnEdgeDrop = () => {

    const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useVeltReactFlowCrdtExtension({
        editorId: 'react-flow-crdt-1-1-sept-2025',
        initialEdges,
        initialNodes,
    });

    const reactFlowWrapper = useRef(null);

    const { screenToFlowPosition } = useReactFlow();

    const onConnectEnd = useCallback(
        (event: any, connectionState: any) => {
            // when a connection is dropped on the pane it's not valid
            if (!connectionState.isValid) {
                // we need to remove the wrapper bounds, in order to get the correct position
                const id = getId();
                const { clientX, clientY } =
                    'changedTouches' in event ? event.changedTouches[0] : event;
                const newNode: Node = {
                    id,
                    position: screenToFlowPosition({
                        x: clientX,
                        y: clientY,
                    }),
                    data: { label: `Node ${id}` },
                    origin: [0.5, 0.0],
                };

                // Update nodes using onNodesChange
                onNodesChange([{ type: 'add', item: newNode }]);

                // Update edges using onEdgesChange
                const newEdge = {
                    id,
                    source: connectionState.fromNode.id,
                    target: id,
                };
                onEdgesChange([{ type: 'add', item: newEdge }]);
            }
        },
        [screenToFlowPosition, onNodesChange, onEdgesChange],
    );

    return (
        <div className="react-flow-container" ref={reactFlowWrapper}>
            <ReactFlow
                style={{ backgroundColor: "#F7F9FB" }}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onConnectEnd={onConnectEnd}
                fitView
                fitViewOptions={{ padding: 2 }}
                nodeOrigin={nodeOrigin}
            >
                <Background />
            </ReactFlow>
        </div>
    );
};

function ReactFlowComponent() {

    const veltInitialized = useVeltInitState();

    if (!veltInitialized) {
        return <div>Loading...</div>;
    }

    return (
        <ReactFlowProvider>
            <AddNodeOnEdgeDrop />
        </ReactFlowProvider>
    )
}

export default ReactFlowComponent;