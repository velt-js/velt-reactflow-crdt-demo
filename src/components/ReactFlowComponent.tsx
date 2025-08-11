/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Background,
    ReactFlow,
    ReactFlowProvider,
    useReactFlow,
    type Edge
} from '@xyflow/react';
import { useCallback, useRef } from 'react';

import { useVeltClient, useVeltInitState } from '@veltdev/react';
import { veltReactFlowStore } from '@veltdev/reactflow-crdt';
import '@xyflow/react/dist/style.css';
import { useShallow } from 'zustand/react/shallow';

const selector = (state: any) => ({
    nodes: state.nodes,
    edges: state.edges,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
    onConnect: state.onConnect,
    setNodes: state.setNodes,
    setEdges: state.setEdges,
});

const initialNodes = [
    {
        id: '0',
        type: 'input',
        data: { label: 'Node' },
        position: { x: 0, y: 50 },
    },
];
const initialEdges: Edge[] = [];

let id = 9;
const getId = () => `${id++}`;
const nodeOrigin: [number, number] = [0.5, 0];

const AddNodeOnEdgeDrop = () => {

    const { client } = useVeltClient();

    const storeRef = useRef<any>(null);
    if (storeRef.current === null) {
        storeRef.current = veltReactFlowStore({
            editorId: 'react-flow-crdt-dev-4',
            initialEdges,
            initialNodes,
            veltClient: client,
        });
    }
    const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = storeRef.current(
        useShallow(selector),
    );

    const reactFlowWrapper = useRef(null);

    // const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    // const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const { screenToFlowPosition } = useReactFlow();
    // const onConnect = useCallback(
    //   (params) => setEdges((eds) => addEdge(params, eds)),
    //   [],
    // );

    const onConnectEnd = useCallback(
        (event: any, connectionState: any) => {
            // when a connection is dropped on the pane it's not valid
            if (!connectionState.isValid) {
                // we need to remove the wrapper bounds, in order to get the correct position
                const id = getId();
                const { clientX, clientY } =
                    'changedTouches' in event ? event.changedTouches[0] : event;
                const newNode = {
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