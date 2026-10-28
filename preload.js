const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  loadData: () => ipcRenderer.invoke('load-data'),
  saveData: (data, options) => ipcRenderer.invoke('save-data', data, options),
  getBackupsList: (courseId) => ipcRenderer.invoke('get-backups-list', courseId),
  getBackupDetails: (filename, courseId) => ipcRenderer.invoke('get-backup-details', filename, courseId),
  revertToBackup: (args) => ipcRenderer.invoke('revert-to-backup', args),
  print: () => ipcRenderer.invoke('print-app'),
  savePdf: (options) => ipcRenderer.invoke('save-pdf', options),
  checkDependencies: () => ipcRenderer.invoke('check-dependencies'),
  installDependency: (dep) => ipcRenderer.invoke('install-dependency', dep),
  selectPdfFile: () => ipcRenderer.invoke('select-pdf-file'),
  runAutoIndex: (args) => ipcRenderer.invoke('run-auto-index', args),
  retryCuration: (args) => ipcRenderer.invoke('retry-gemini-curation', args),
  onDepInstallStatus: (callback) => {
    ipcRenderer.on('dep-install-status', (event, data) => callback(data));
  },
  onDepInstallLog: (callback) => {
    ipcRenderer.on('dep-install-log', (event, log) => callback(log));
  },
  parsePdfIndex: (args) => ipcRenderer.invoke('parse-pdf-index', args),
  getCombineCandidateStats: (args) => ipcRenderer.invoke('get-combine-candidate-stats', args),
  combineSameItems: (args) => ipcRenderer.invoke('combine-same-items', args),
  onPdfImportProgress: (callback) => {
    ipcRenderer.on('pdf-import-progress', (event, progress) => callback(progress));
  },
  onAutoIndexProgress: (callback) => {
    ipcRenderer.on('auto-index-progress', (event, progress) => callback(progress));
  },
  retryFailedChunks: (args) => ipcRenderer.invoke('retry-failed-chunks', args),
  fetchGeminiModels: (apiKey) => ipcRenderer.invoke('fetch-gemini-models', apiKey),
  onApiDebugLog: (callback) => {
    ipcRenderer.on('api-debug-log', (event, log) => callback(log));
  },
  checkForUpdates: (testMode) => ipcRenderer.invoke('check-for-updates', testMode),
  performUpdate: (testMode) => ipcRenderer.invoke('perform-update', testMode),
  onMenuAction: (callback) => {
    ipcRenderer.on('menu-action', (event, action, ...args) => callback(action, ...args));
  },
  onSetTheme: (callback) => {
    ipcRenderer.on('set-theme', (event, themeKey) => callback(themeKey));
  },
  sendThemeChanged: (themeKey) => {
    ipcRenderer.send('theme-changed', themeKey);
  },
  removeListener: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
});
