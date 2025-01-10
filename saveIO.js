// saveIO.js

export const saveJsonToFile = (flowData) => {
    try {
        const blob = new Blob([JSON.stringify(flowData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'flow.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert('Flow saved!');
    } catch (error) {
        console.error('Error saving JSON:', error);
        alert('Failed to save flow.');
    }
};


export const loadJsonFromFile = () => {
    return new Promise((resolve, reject) => {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.json';
      fileInput.style.display = 'none';
      document.body.appendChild(fileInput);
  
      fileInput.addEventListener('change', async (event) => {
        try {
          const file = event.target.files[0];
          if (!file) {
            reject(new Error('No file selected.'));
            return;
          }
          const reader = new FileReader();
          reader.onload = async (e) => {
            try {
              const contents = e.target.result;
              const parsedData = JSON.parse(contents)
              resolve(parsedData);
            } catch (error) {
              reject(new Error('Error parsing JSON.'));
            }
          };
          reader.onerror = () => reject(new Error('Error reading file.'));
          reader.readAsText(file);
        } catch (error) {
          reject(new Error('Error loading JSON:', error));
        } finally {
            document.body.removeChild(fileInput);
        }
      });
      fileInput.click();
    });
};