import { VeltPresence, VeltProvider } from '@veltdev/react'
import './App.css'
import ReactFlowComponent from './components/ReactFlowComponent'
import VeltCollaboration from './velt-components/VeltCollaboration'

function App() {

  return (
    <>
      <VeltProvider apiKey={'krUVK3LgYeifgViaY3Oa'} config={{
        version: '4.5.0-beta.158',
        develop: true,
      } as any}>
        <div className="app-container">
          <header className="app-header">
            <h1 className="app-title">Velt ReactFlow CRDT App</h1>
            <div className="login-section">
              <VeltPresence />
              <VeltCollaboration />
            </div>
          </header>
          <main className="app-content">
            <ReactFlowComponent />
          </main>
        </div>
      </VeltProvider>
    </>
  )
}

export default App
