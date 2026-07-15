const { app, BrowserWindow, ipcMain, dialog, Menu, MenuItem } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
const DATA_FILE = path.join(__dirname, 'sans_index.json');
const BACKUPS_DIR = path.join(__dirname, 'backups');

const WINDOW_STATE_FILE = path.join(__dirname, 'window_state.json');

function loadWindowState() {
  try {
    if (fs.existsSync(WINDOW_STATE_FILE)) {
      return JSON.parse(fs.readFileSync(WINDOW_STATE_FILE, 'utf8'));
    }
  } catch (err) {
    console.error("Error loading window state:", err);
  }
  return {
    width: 1200,
    height: 800,
    isMaximized: true // Default to maximized
  };
}

function saveWindowState() {
  if (!mainWindow) return;
  try {
    const isMaximized = mainWindow.isMaximized();
    // Only save bounds if not maximized to avoid saving maximized size as restore dimensions
    const bounds = isMaximized ? null : mainWindow.getBounds();
    const stateData = {
      isMaximized
    };
    if (bounds) {
      stateData.width = bounds.width;
      stateData.height = bounds.height;
      stateData.x = bounds.x;
      stateData.y = bounds.y;
    } else {
      // If maximized, try to read loaded values as fallback
      const oldState = loadWindowState();
      stateData.width = oldState.width || 1200;
      stateData.height = oldState.height || 800;
      stateData.x = oldState.x;
      stateData.y = oldState.y;
    }
    fs.writeFileSync(WINDOW_STATE_FILE, JSON.stringify(stateData), 'utf8');
  } catch (err) {
    console.error("Error saving window state:", err);
  }
}

function createWindow() {
  const windowState = loadWindowState();

  mainWindow = new BrowserWindow({
    width: windowState.width,
    height: windowState.height,
    x: windowState.x,
    y: windowState.y,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: true
    },
    title: "SANS Study Indexer",
    icon: path.join(__dirname, 'icon.png') // Fallback icon
  });

  if (windowState.isMaximized) {
    mainWindow.maximize();
  }

  // Save window state on close
  mainWindow.on('close', () => {
    saveWindowState();
  });

  mainWindow.loadFile('index.html');

  // Context Menu for Spellchecking and Edit Actions
  mainWindow.webContents.on('context-menu', (event, params) => {
    const menu = new Menu();

    // Add spelling suggestions if misspelled word is right-clicked
    if (params.misspelledWord && params.dictionarySuggestions.length > 0) {
      params.dictionarySuggestions.forEach(suggestion => {
        menu.append(new MenuItem({
          label: suggestion,
          click: () => {
            mainWindow.webContents.insertText(suggestion);
          }
        }));
      });
      menu.append(new MenuItem({ type: 'separator' }));
    }

    // Standard Edit Options in text fields
    if (params.isEditable) {
      menu.append(new MenuItem({ label: 'Cut', role: 'cut' }));
      menu.append(new MenuItem({ label: 'Copy', role: 'copy' }));
      menu.append(new MenuItem({ label: 'Paste', role: 'paste' }));
    } else if (params.selectionText) {
      menu.append(new MenuItem({ label: 'Copy', role: 'copy' }));
    }

    if (menu.items.length > 0) {
      menu.popup();
    }
  });

  // Redirect renderer console messages to terminal output
  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`[RENDERER CONSOLE] ${message} (at ${path.basename(sourceId)}:${line})`);
  });

  // Open the DevTools during development if needed
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// IPC Handler: Load Data
ipcMain.handle('load-data', async () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const rawData = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(rawData);
    }
  } catch (error) {
    console.error("Error loading data file:", error);
  }
  
  // Return default database structure if file doesn't exist or is corrupted
  const defaultData = {
    courses: [
      { id: "course-1", name: "SEC504: Hacker Tools & Techniques" }
    ],
    books: [
      { id: "book-1", courseId: "course-1", name: "Book 1", color: "#0d9488" },
      { id: "book-2", courseId: "course-1", name: "Book 2", color: "#2563eb" },
      { id: "book-3", courseId: "course-1", name: "Book 3", color: "#7c3aed" },
      { id: "book-4", courseId: "course-1", name: "Book 4", color: "#db2777" },
      { id: "book-5", courseId: "course-1", name: "Book 5", color: "#ea580c" }
    ],
    entries: []
  };
  
  // Write default data initially
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2), 'utf8');
  } catch (e) {
    console.error("Failed to write initial default data:", e);
  }
  return defaultData;
});

// IPC Handler: Save Data & Make Backup
ipcMain.handle('save-data', async (event, data) => {
  try {
    // 1. Save main data file
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    
    // 2. Ensure backups directory exists
    if (!fs.existsSync(BACKUPS_DIR)) {
      fs.mkdirSync(BACKUPS_DIR, { recursive: true });
    }
    
    // 3. Write timestamped backup file
    const now = new Date();
    const timestamp = now.toISOString()
      .replace(/:/g, '-')
      .replace(/\./g, '-')
      .replace(/T/g, '_')
      .replace(/Z/g, '');
    const backupFile = path.join(BACKUPS_DIR, `backup_${timestamp}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(data, null, 2), 'utf8');
    
    // 4. Prune old backups (keep maximum 100 most recent ones to save disk space)
    const files = fs.readdirSync(BACKUPS_DIR)
      .filter(file => file.startsWith('backup_') && file.endsWith('.json'))
      .map(file => ({
        name: file,
        path: path.join(BACKUPS_DIR, file),
        mtime: fs.statSync(path.join(BACKUPS_DIR, file)).mtime
      }))
      .sort((a, b) => b.mtime - a.mtime); // Newest first
      
    if (files.length > 100) {
      const filesToDelete = files.slice(100);
      filesToDelete.forEach(file => {
        try {
          fs.unlinkSync(file.path);
        } catch (err) {
          console.error("Error deleting old backup:", err);
        }
      });
    }

    return { success: true, backupFile: path.basename(backupFile) };
  } catch (error) {
    console.error("Failed to save data:", error);
    return { success: false, error: error.message };
  }
});



// IPC Handler: Print Layout
ipcMain.handle('print-app', async () => {
  if (!mainWindow) return false;
  mainWindow.webContents.print({
    silent: false,
    printBackground: true,
    color: true,
    margins: { marginType: 'default' }
  }, (success, failureReason) => {
    if (!success) {
      console.log(`Print failed: ${failureReason}`);
    }
  });
  return true;
});
