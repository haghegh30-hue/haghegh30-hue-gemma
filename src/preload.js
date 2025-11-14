const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  openSettings: () => ipcRenderer.send('open-settings'),
  saveSettings: (settings) => ipcRenderer.send('save-settings', settings),
  getSettings: () => ipcRenderer.invoke('get-settings'),
  sendPrompt: (prompt) => ipcRenderer.send('send-prompt', prompt),
  onResponse: (callback) => ipcRenderer.on('response', (event, response) => callback(response)),
  searchFiles: (query) => ipcRenderer.invoke('search-files', query),
});
