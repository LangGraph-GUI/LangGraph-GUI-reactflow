// GraphApp.js

import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import Canvas from './Canvas';

function App() {
  return (
    <ReactFlowProvider>
      <Canvas />
    </ReactFlowProvider>
  );
}

export default App;
