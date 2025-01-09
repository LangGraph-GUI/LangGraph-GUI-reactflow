// Panel.js
import React from 'react';
import { saveJson, loadJson } from './JsonUtils';
import RunWindow from './RunWindow';
import FileTransmit from './FileTransmit';
import ConfigWindow from '../ConfigWindow';
import { useGraphManager } from './GraphManager';


function Panel({ showConfig, setShowConfig, showRun, setShowRun}) {
    const {
        nodes,
        setNodes,
        edges,
        setEdges,
        nodeIdCounter,
        setNodeIdCounter,
      } = useGraphManager();

  const handleNew = () => {
    setNodes([]);
    setEdges([]);
    setNodeIdCounter(1);
  };

  const handleSave = async () => {
    await saveJson(nodes, nodeIdCounter);
  };

  const handleLoad = async () => {
    handleNew();
    await loadJson(setEdges, setNodes, setNodeIdCounter);
  };

  const handleRun = () => {
    setShowRun(true);
  };

  const handleConfig = () => {
    setShowConfig(true);
  };

   const handleUploadComplete = () => {
     console.log('Upload complete.');
  };

  return (
        <nav className="p-2 border-b border-gray-300 mb-2 bg-white z-20">
          <button className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 rounded" onClick={handleNew}>New Graph</button>
          <button className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 rounded" onClick={handleSave}>Save Graph</button>
          <button className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 rounded" onClick={handleLoad}>Load Graph</button>
          <button className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 rounded" onClick={handleRun}>Run Graph</button>
          <button className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 rounded" onClick={handleConfig}>Config</button>
           <FileTransmit onUploadComplete={handleUploadComplete} />
           {showConfig && <ConfigWindow onClose={() => setShowConfig(false)} />}
        {showRun && <RunWindow onClose={() => setShowRun(false)} />}
       </nav>
  );
}

export default Panel;