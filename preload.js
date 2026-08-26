const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  loadData: () => ipcRenderer.invoke('load-data'),
  saveData: (data) => ipcRenderer.invoke('save-data', data),
  print: () => ipcRenderer.invoke('print-app'),
  savePdf: (options) => ipcRenderer.invoke('save-pdf', options),
  checkDependencies: () => ipcRenderer.invoke('check-dependencies'),
  installOcr: () => ipcRenderer.invoke('install-ocr'),
  installDependency: (dep) => ipcRenderer.invoke('install-dependency', dep),
  selectPdfFile: () => ipcRenderer.invoke('select-pdf-file'),
  runAutoIndex: (args) => ipcRenderer.invoke('run-auto-index', args),
  retryCuration: (args) => ipcRenderer.invoke('retry-gemini-curation', args),
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
  checkLocalModelStatus: (modelKey) => ipcRenderer.invoke('check-local-model-status', modelKey),
  downloadLocalModel: (modelKey) => ipcRenderer.invoke('download-local-model', modelKey),
  parsePdfIndex: (args) => ipcRenderer.invoke('parse-pdf-index', args),
  combineSameItems: (args) => ipcRenderer.invoke('combine-same-items', args),
  onPdfImportProgress: (callback) => {
    ipcRenderer.on('pdf-import-progress', (event, progress) => callback(progress));
  },
  onModelDownloadProgress: (callback) => {
    ipcRenderer.on('model-download-progress', (event, data) => callback(data));
  },
  onAutoIndexProgress: (callback) => {
    ipcRenderer.on('auto-index-progress', (event, progress) => callback(progress));
  },
  retryFailedChunks: (args) => ipcRenderer.invoke('retry-failed-chunks', args),
  onApiDebugLog: (callback) => {
    ipcRenderer.on('api-debug-log', (event, log) => callback(log));
  },
  checkForUpdates: (testMode) => ipcRenderer.invoke('check-for-updates', testMode),
  performUpdate: (testMode) => ipcRenderer.invoke('perform-update', testMode),
  removeListener: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
});
