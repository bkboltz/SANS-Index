const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  loadData: () => ipcRenderer.invoke('load-data'),
  saveData: (data) => ipcRenderer.invoke('save-data', data),
  print: () => ipcRenderer.invoke('print-app'),
  checkDependencies: () => ipcRenderer.invoke('check-dependencies'),
  installOcr: () => ipcRenderer.invoke('install-ocr'),
  installDependency: (dep) => ipcRenderer.invoke('install-dependency', dep),
  selectPdfFile: () => ipcRenderer.invoke('select-pdf-file'),
  runAutoIndex: (args) => ipcRenderer.invoke('run-auto-index', args),
  onOcrInstallStatus: (callback) => {
    ipcRenderer.on('ocr-install-status', (event, status) => callback(status));
  },
  onOcrInstallLog: (callback) => {
    ipcRenderer.on('ocr-install-log', (event, log) => callback(log));
  },
  onDepInstallStatus: (callback) => {
    ipcRenderer.on('dep-install-status', (event, data) => callback(data));
  },
  onDepInstallLog: (callback) => {
    ipcRenderer.on('dep-install-log', (event, log) => callback(log));
  },
  onAutoIndexProgress: (callback) => {
    ipcRenderer.on('auto-index-progress', (event, progress) => callback(progress));
  },
  removeListener: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
});
