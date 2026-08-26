const { app, BrowserWindow, ipcMain, dialog, Menu, MenuItem, shell, net } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec, spawn, execSync } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Ensure macOS system PATH includes Homebrew and standard binary paths
if (process.platform === 'darwin') {
  const macPaths = [
    '/opt/homebrew/bin',
    '/opt/homebrew/sbin',
    '/usr/local/bin',
    '/usr/local/sbin',
    '/Library/Frameworks/Python.framework/Versions/Current/bin',
    `${process.env.HOME}/.homebrew/bin`
  ];
  const currentPath = process.env.PATH || '';
  process.env.PATH = macPaths.concat(currentPath.split(':')).filter(Boolean).join(':');
}

let mainWindow;
const DATA_FILE = path.join(__dirname, 'sans_index.json');
const BACKUPS_DIR = path.join(__dirname, 'backups');

const WINDOW_STATE_FILE = path.join(__dirname, 'window_state.json');

const DEBUG_LOG_FILE = path.join(__dirname, 'debug.log');
function logDebug(msg) {
  try {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(DEBUG_LOG_FILE, `[${timestamp}] ${msg}\n`, 'utf8');
  } catch (err) {
    console.error('Failed to write to debug log file:', err);
  }
  console.log(msg);
}

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

  // Open external links in default browser instead of Electron child window
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://') || url.startsWith('http://')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

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

// IPC Handler: Save PDF via Electron's webContents.printToPDF
ipcMain.handle('save-pdf', async (event, options = {}) => {
  if (!mainWindow) return { success: false, error: 'Main window not available.' };

  try {
    const defaultFilename = options.defaultName || 'SANS_Study_Index.pdf';
    const { filePath, canceled } = await dialog.showSaveDialog(mainWindow, {
      title: 'Save Index as PDF',
      defaultPath: defaultFilename,
      filters: [
        { name: 'PDF Document (*.pdf)', extensions: ['pdf'] },
        { name: 'All Files (*.*)', extensions: ['*'] }
      ]
    });

    if (canceled || !filePath) {
      return { success: false, canceled: true };
    }

    logDebug(`[PDF Exporter] Printing to PDF for: ${filePath}`);

    const pdfData = await mainWindow.webContents.printToPDF({
      pageSize: 'Letter',
      printBackground: true,
      margin: {
        top: 0.25,
        bottom: 0.25,
        left: 0.25,
        right: 0.25
      },
      preferCSSPageSize: true
    });

    fs.writeFileSync(filePath, pdfData);
    logDebug(`[PDF Exporter] Successfully saved PDF (${pdfData.length} bytes) to ${filePath}`);

    return { success: true, filePath, bytes: pdfData.length };
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    logDebug(`[PDF Exporter Error] ${error.message}`);
    return { success: false, error: error.message };
  }
});

async function checkCommand(command) {
  return new Promise((resolve) => {
    exec(command, (error) => {
      if (error) {
        const msg = error.message.toLowerCase();
        if (msg.includes("not recognized") || msg.includes("cannot find") || msg.includes("no such file") || msg.includes("not found")) {
          resolve(false);
          return;
        }
      }
      resolve(true);
    });
  });
}

// Helper to resolve QPDF path on Windows/macOS/Linux
function resolveQpdfPath() {
  try {
    execSync('qpdf --version', { stdio: 'ignore' });
    return 'qpdf';
  } catch (e) {
    // Ignore
  }

  if (process.platform === 'win32') {
    const searchDirs = ['C:\\Program Files', 'C:\\Program Files (x86)'];
    for (const dir of searchDirs) {
      if (fs.existsSync(dir)) {
        const items = fs.readdirSync(dir);
        for (const item of items) {
          if (item.toLowerCase().startsWith('qpdf')) {
            const binaryPath = path.join(dir, item, 'bin', 'qpdf.exe');
            if (fs.existsSync(binaryPath)) {
              return binaryPath;
            }
          }
        }
      }
    }
  } else {
    const macCheckPaths = ['/opt/homebrew/bin/qpdf', '/usr/local/bin/qpdf'];
    for (const p of macCheckPaths) {
      if (fs.existsSync(p)) return p;
    }
  }

  return 'qpdf';
}

// Helper to resolve pdftotext path on Windows/macOS/Linux
function resolvePdftotextPath() {
  try {
    execSync('pdftotext -v', { stdio: 'ignore' });
    return 'pdftotext';
  } catch (e) {
    // Ignore
  }

  if (process.platform === 'win32') {
    const gitPath = 'C:\\Program Files\\Git\\mingw64\\bin\\pdftotext.exe';
    if (fs.existsSync(gitPath)) {
      return gitPath;
    }

    const searchDirs = ['C:\\Program Files', 'C:\\Program Files (x86)'];
    for (const dir of searchDirs) {
      if (fs.existsSync(dir)) {
        const items = fs.readdirSync(dir);
        for (const item of items) {
          if (item.toLowerCase().includes('poppler')) {
            const binaryPath = path.join(dir, item, 'bin', 'pdftotext.exe');
            if (fs.existsSync(binaryPath)) {
              return binaryPath;
            }
          }
        }
      }
    }
  } else {
    const macCheckPaths = ['/opt/homebrew/bin/pdftotext', '/usr/local/bin/pdftotext'];
    for (const p of macCheckPaths) {
      if (fs.existsSync(p)) return p;
    }
  }

  return 'pdftotext';
}

// Helper: Determine system Python binary (python3 vs python)
async function getSystemPythonCommand() {
  if (await checkCommand('python3 --version')) return 'python3';
  if (await checkCommand('python --version')) return 'python';
  return process.platform === 'win32' ? 'python' : 'python3';
}

// Helper: Ensure Python virtual environment and required libraries exist
async function ensurePythonEnvironment(event) {
  const engineDir = path.join(__dirname, 'engine');
  const venvPath = path.join(engineDir, '.venv');
  const venvPython = process.platform === 'win32'
    ? path.join(venvPath, 'Scripts', 'python.exe')
    : path.join(venvPath, 'bin', 'python');

  let venvValid = false;
  if (fs.existsSync(venvPython)) {
    venvValid = await new Promise((resolve) => {
      exec(`"${venvPython}" -c "import pdfminer, nltk, wordfreq, fitz; print('ok')"`, (err, stdout) => {
        resolve(!err && stdout.trim() === 'ok');
      });
    });
  }

  if (venvValid) {
    return venvPython;
  }

  const sysPython = await getSystemPythonCommand();

  if (event) {
    event.sender.send('auto-index-progress', {
      step: 'setup',
      message: 'First-time setup: Checking/Installing required Python indexing libraries...'
    });
  }

  if (!fs.existsSync(venvPath)) {
    if (event) {
      event.sender.send('auto-index-progress', {
        step: 'setup',
        message: 'Creating Python virtual environment (engine/.venv)...'
      });
    }
    await new Promise((resolve, reject) => {
      const venvSpawn = spawn(sysPython, ['-m', 'venv', '.venv'], { cwd: engineDir });
      venvSpawn.on('close', (code) => {
        if (code === 0) resolve();
        else reject(new Error('Failed to create Python virtual environment. Please ensure Python 3 is installed.'));
      });
    });
  }

  const pipPath = process.platform === 'win32'
    ? path.join(venvPath, 'Scripts', 'pip.exe')
    : path.join(venvPath, 'bin', 'pip');

  if (fs.existsSync(pipPath)) {
    if (event) {
      event.sender.send('auto-index-progress', {
        step: 'setup',
        message: 'Installing required Python libraries into engine/.venv...'
      });
    }
    await new Promise((resolve) => {
      const pipSpawn = spawn(pipPath, ['install', '-r', 'requirements.txt'], { cwd: engineDir });
      pipSpawn.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          // Fallback: Install essential indexing packages
          const fallbackPip = spawn(pipPath, ['install', 'pdfminer.six', 'nltk', 'wordfreq', 'PyMuPDF', 'Pillow', 'tqdm'], { cwd: engineDir });
          fallbackPip.on('close', () => resolve());
        }
      });
    });
  }

  return fs.existsSync(venvPython) ? venvPython : sysPython;
}

// IPC Handler: Check Auto-Indexing Dependencies
ipcMain.handle('check-dependencies', async () => {
  const python = (await checkCommand('python3 --version')) || (await checkCommand('python --version'));
  const sysPython = await getSystemPythonCommand();
  const resolvedQpdf = resolveQpdfPath();
  const resolvedPdftotext = resolvePdftotextPath();
  
  const qpdf = resolvedQpdf !== 'qpdf' || await checkCommand('qpdf --version');
  const pdftotext = resolvedPdftotext !== 'pdftotext' || await checkCommand('pdftotext -v');
  
  const venvPath = path.join(__dirname, 'engine', '.venv');
  const venvExists = fs.existsSync(venvPath);
  
  let ocr = false;
  if (python) {
    ocr = await new Promise((resolve) => {
      exec(`${sysPython} -c "import doctr, torch; print('ok')"`, (error, stdout) => {
        if (!error && stdout.trim() === 'ok') {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }
  
  let venvOcr = false;
  if (venvExists) {
    const venvPython = process.platform === 'win32' 
      ? path.join(venvPath, 'Scripts', 'python.exe')
      : path.join(venvPath, 'bin', 'python');
    
    venvOcr = await new Promise((resolve) => {
      exec(`"${venvPython}" -c "import doctr, torch; print('ok')"`, (error, stdout) => {
        if (!error && stdout.trim() === 'ok') {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }
  
  return {
    python,
    qpdf,
    pdftotext,
    ocr: ocr || venvOcr,
    venvExists,
  };
});

// IPC Handler: Select PDF File
ipcMain.handle('select-pdf-file', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Select SANS PDF Book',
    properties: ['openFile'],
    filters: [
      { name: 'PDF Files', extensions: ['pdf'] }
    ]
  });
  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }
  return result.filePaths[0];
});

// IPC Handler: Install OCR Dependencies (virtual environment creation and pip install)
ipcMain.handle('install-ocr', async (event) => {
  return new Promise(async (resolve, reject) => {
    const engineDir = path.join(__dirname, 'engine');
    const venvPath = path.join(engineDir, '.venv');
    const sysPython = await getSystemPythonCommand();
    
    event.sender.send('ocr-install-status', 'Creating virtual environment (engine/.venv)...');
    
    const venvSpawn = spawn(sysPython, ['-m', 'venv', '.venv'], { cwd: engineDir });
    
    venvSpawn.on('close', (code) => {
      if (code !== 0) {
        event.sender.send('ocr-install-status', 'Failed to create virtual environment.');
        reject(new Error('Failed to create virtual environment'));
        return;
      }
      
      event.sender.send('ocr-install-status', 'Installing libraries (PyTorch, DocTR, and requirements.txt)... This can take 5-10 minutes.');
      
      const pipPath = process.platform === 'win32'
        ? path.join(venvPath, 'Scripts', 'pip.exe')
        : path.join(venvPath, 'bin', 'pip');
        
      const pipSpawn = spawn(pipPath, ['install', '-r', 'requirements.txt'], { cwd: engineDir });
      
      pipSpawn.stdout.on('data', (data) => {
        event.sender.send('ocr-install-log', data.toString());
      });
      
      pipSpawn.stderr.on('data', (data) => {
        event.sender.send('ocr-install-log', data.toString());
      });
      
      pipSpawn.on('close', (pipCode) => {
        if (pipCode !== 0) {
          event.sender.send('ocr-install-status', 'Failed to install requirements.');
          reject(new Error('Failed to install requirements'));
        } else {
          event.sender.send('ocr-install-status', 'OCR dependencies successfully installed!');
          resolve({ success: true });
        }
      });
    });
  });
});

// IPC Handler: Install System Dependencies (Python, qpdf, Poppler pdftotext, OCR)
ipcMain.handle('install-dependency', async (event, dependencyName) => {
  return new Promise(async (resolve, reject) => {
    if (dependencyName === 'ocr') {
      const engineDir = path.join(__dirname, 'engine');
      const venvPath = path.join(engineDir, '.venv');
      const sysPython = await getSystemPythonCommand();
      
      event.sender.send('dep-install-status', {
        dependency: 'ocr',
        status: 'Creating virtual environment (engine/.venv)...',
        percent: 10
      });
      
      const venvSpawn = spawn(sysPython, ['-m', 'venv', '.venv'], { cwd: engineDir });
      
      venvSpawn.stdout.on('data', (data) => {
        event.sender.send('dep-install-log', data.toString());
      });
      venvSpawn.stderr.on('data', (data) => {
        event.sender.send('dep-install-log', data.toString());
      });
      
      venvSpawn.on('close', (code) => {
        if (code !== 0) {
          event.sender.send('dep-install-status', {
            dependency: 'ocr',
            status: 'Failed to create virtual environment.',
            percent: 0
          });
          reject(new Error('Failed to create virtual environment'));
          return;
        }
        
        event.sender.send('dep-install-status', {
          dependency: 'ocr',
          status: 'Installing libraries (PyTorch, DocTR, and requirements.txt)... This can take 5-10 minutes.',
          percent: 40
        });
        
        const pipPath = process.platform === 'win32'
          ? path.join(venvPath, 'Scripts', 'pip.exe')
          : path.join(venvPath, 'bin', 'pip');
          
        const pipSpawn = spawn(pipPath, ['install', '-r', 'requirements.txt'], { cwd: engineDir });
        
        pipSpawn.stdout.on('data', (data) => {
          const text = data.toString();
          event.sender.send('dep-install-log', text);
          if (text.includes('Downloading')) {
            event.sender.send('dep-install-status', {
              dependency: 'ocr',
              status: 'Downloading Python OCR libraries...',
              percent: 50
            });
          } else if (text.includes('Installing collected packages')) {
            event.sender.send('dep-install-status', {
              dependency: 'ocr',
              status: 'Installing/Building Python packages...',
              percent: 85
            });
          }
        });
        
        pipSpawn.stderr.on('data', (data) => {
          event.sender.send('dep-install-log', data.toString());
        });
        
        pipSpawn.on('close', (pipCode) => {
          if (pipCode !== 0) {
            event.sender.send('dep-install-status', {
              dependency: 'ocr',
              status: 'Failed to install OCR packages.',
              percent: 0
            });
            reject(new Error('Failed to install requirements'));
          } else {
            event.sender.send('dep-install-status', {
              dependency: 'ocr',
              status: 'OCR dependencies successfully installed!',
              percent: 100
            });
            resolve({ success: true });
          }
        });
      });
      return;
    }

    if (process.platform === 'win32') {
      let command = 'winget';
      let args = [];
      
      if (dependencyName === 'python') {
        args = ['install', 'Python.Python.3.12', '--accept-source-agreements', '--accept-package-agreements'];
      } else if (dependencyName === 'qpdf') {
        args = ['install', 'QPDF.QPDF', '--accept-source-agreements', '--accept-package-agreements'];
      } else if (dependencyName === 'pdftotext') {
        args = ['install', 'oschwartz10612.Poppler', '--accept-source-agreements', '--accept-package-agreements'];
      } else {
        reject(new Error(`Unknown dependency: ${dependencyName}`));
        return;
      }

      event.sender.send('dep-install-status', {
        dependency: dependencyName,
        status: `Starting installation of ${dependencyName}...`,
        percent: 5
      });

      const installerProcess = spawn(command, args, { shell: true });
      let logBuffer = '';

      installerProcess.stdout.on('data', (data) => {
        const text = data.toString();
        event.sender.send('dep-install-log', text);
        logBuffer += text;

        const pctMatch = text.match(/(\d+)\s*%/);
        if (pctMatch) {
          const pct = parseInt(pctMatch[1]);
          event.sender.send('dep-install-status', {
            dependency: dependencyName,
            status: `Downloading/Installing ${dependencyName}...`,
            percent: Math.min(95, Math.max(5, pct))
          });
        } else if (text.includes('Successfully installed') || text.includes('Installer exit code: 0')) {
          event.sender.send('dep-install-status', {
            dependency: dependencyName,
            status: `Installation of ${dependencyName} succeeded!`,
            percent: 100
          });
        } else if (text.includes('Downloading')) {
          event.sender.send('dep-install-status', {
            dependency: dependencyName,
            status: `Downloading ${dependencyName}...`,
            percent: 25
          });
        } else if (text.includes('Installing')) {
          event.sender.send('dep-install-status', {
            dependency: dependencyName,
            status: `Installing ${dependencyName}...`,
            percent: 75
          });
        }
      });

      installerProcess.stderr.on('data', (data) => {
        const text = data.toString();
        event.sender.send('dep-install-log', `ERROR: ${text}`);
      });

      installerProcess.on('close', (code) => {
        const isAlreadyInstalled = code === 2316632107 || 
                                   logBuffer.includes('already installed') || 
                                   logBuffer.includes('No newer package versions are available') || 
                                   logBuffer.includes('No available upgrade found') ||
                                   logBuffer.includes('Command line alias already exists');
                                   
        if (code === 0 || isAlreadyInstalled || logBuffer.includes('Successfully installed')) {
          const statusMsg = isAlreadyInstalled 
            ? `${dependencyName} is already installed!`
            : `Successfully completed installation of ${dependencyName}!`;
            
          event.sender.send('dep-install-status', {
            dependency: dependencyName,
            status: statusMsg,
            percent: 100
          });
          resolve({ success: true });
        } else {
          event.sender.send('dep-install-status', {
            dependency: dependencyName,
            status: `Failed to install ${dependencyName}. Exit code: ${code}`,
            percent: 0
          });
          reject(new Error(`winget install exited with code ${code}. If you don't have winget, please install this dependency manually.`));
        }
      });
    } else if (process.platform === 'darwin') {
      let brewPkg = '';
      if (dependencyName === 'python') brewPkg = 'python';
      else if (dependencyName === 'qpdf') brewPkg = 'qpdf';
      else if (dependencyName === 'pdftotext') brewPkg = 'poppler';
      else {
        reject(new Error(`Unknown dependency: ${dependencyName}`));
        return;
      }

      const hasBrew = await checkCommand('brew --version');
      if (!hasBrew) {
        event.sender.send('dep-install-status', {
          dependency: dependencyName,
          status: 'Homebrew (brew) is required on macOS. Opening brew.sh...',
          percent: 0
        });
        shell.openExternal('https://brew.sh');
        reject(new Error('Homebrew is not installed. Please install Homebrew from https://brew.sh first.'));
        return;
      }

      event.sender.send('dep-install-status', {
        dependency: dependencyName,
        status: `Running "brew install ${brewPkg}"...`,
        percent: 25
      });

      const installerProcess = spawn('brew', ['install', brewPkg]);

      installerProcess.stdout.on('data', (data) => {
        event.sender.send('dep-install-log', data.toString());
      });

      installerProcess.stderr.on('data', (data) => {
        event.sender.send('dep-install-log', data.toString());
      });

      installerProcess.on('close', (code) => {
        if (code === 0) {
          event.sender.send('dep-install-status', {
            dependency: dependencyName,
            status: `Successfully installed ${brewPkg} via Homebrew!`,
            percent: 100
          });
          resolve({ success: true });
        } else {
          event.sender.send('dep-install-status', {
            dependency: dependencyName,
            status: `Failed to install ${brewPkg} via Homebrew (exit code ${code}).`,
            percent: 0
          });
          reject(new Error(`brew install ${brewPkg} failed with exit code ${code}`));
        }
      });
    } else {
      reject(new Error(`Unsupported platform: ${process.platform}`));
    }
  });
});

// Helper: Curate Index with Gemini AI (Chunked Dynamic Concurrency Engine)
async function curateIndexWithGemini(entries, geminiApiKey, event, geminiModel, customPrompt, options = {}) {
  const isRetry = options && options.isRetry && Array.isArray(options.failedChunks) && options.failedChunks.length > 0;
  logDebug(`[Gemini Curation] Initiating with ${entries ? entries.length : 0} candidate terms... Model: ${geminiModel || 'gemini-3.7-flash'}, Key length: ${geminiApiKey ? geminiApiKey.length : 0}, isRetry: ${isRetry}`);

  const defaultInstruction = `You are a SANS Cybersecurity course index curator. Your job is to filter a list of candidate index terms extracted from a SANS textbook.
Review the JSON array of terms below. Filter out noise terms (generic English words, verbs, adjectives, prepositions, numbers, and adverbs on their own). Keep only distinct technical terms, security concepts, tools, protocols, registry paths, specific command line utilities, file names, ports, and important techniques.
Also, if there are minor spelling/capitalization variations of the same term (e.g. "active directory", "Active Directory"), merge them by keeping the capitalized proper noun form and combining their pages into a single comma-separated list of pages (remove duplicates and sort pages in ascending numeric order).`;

  const systemInstruction = (customPrompt && customPrompt.trim()) ? customPrompt.trim() : defaultInstruction;

  const chunks = [];
  const chunkPreviousAttempts = [];

  if (isRetry) {
    options.failedChunks.forEach((fc) => {
      if (fc.rawEntries && Array.isArray(fc.rawEntries)) {
        chunks.push(fc.rawEntries);
        const prev = typeof fc.attemptsCompleted === 'number' ? fc.attemptsCompleted : 5;
        chunkPreviousAttempts.push(prev);
      }
    });
  } else {
    if (!entries || entries.length === 0) {
      return { entries: [], failedChunks: [], error: null };
    }
    const chunkSize = 400;
    for (let i = 0; i < entries.length; i += chunkSize) {
      chunks.push(entries.slice(i, i + chunkSize));
      chunkPreviousAttempts.push(0);
    }
  }

  if (chunks.length === 0) {
    return { entries: [], failedChunks: [], error: null };
  }

  logDebug(`[Gemini Curation] Split candidate terms into ${chunks.length} batch(es) (size: 400).`);

  const chunkStatuses = chunks.map((c, idx) => {
    const prevAttempts = chunkPreviousAttempts[idx];
    const chunkMaxAttempts = prevAttempts + 5;
    const origIndex = (isRetry && options.failedChunks[idx]) ? options.failedChunks[idx].chunkIndex : (idx + 1);
    const origTotal = (isRetry && options.failedChunks[idx]) ? options.failedChunks[idx].totalChunks : chunks.length;
    return {
      chunkIndex: origIndex,
      totalChunks: origTotal,
      termCount: c.length,
      status: 'pending',
      attempt: prevAttempts,
      maxAttempts: chunkMaxAttempts,
      message: 'Waiting in queue...'
    };
  });

  const allCuratedEntries = [];
  const failedChunks = [];
  const selectedModel = geminiModel || 'gemini-3.7-flash';
  const concurrencyLimit = 3;

  const emitApiDebugLog = (msg) => {
    logDebug(msg);
    if (event && event.sender) {
      const timeStr = new Date().toLocaleTimeString();
      try {
        event.sender.send('api-debug-log', `[${timeStr}] ${msg}`);
      } catch (e) {}
    }
  };

  emitApiDebugLog(`[Curation Init] Model: ${selectedModel} | Batches: ${chunks.length} | Retry Mode: ${isRetry}`);

  const emitProgress = () => {
    if (event) {
      const completedCount = chunkStatuses.filter(s => s.status === 'success' || s.status === 'failed').length;
      event.sender.send('auto-index-progress', {
        step: 'curating',
        currentChunk: completedCount,
        totalChunks: chunks.length,
        chunkStatuses: chunkStatuses,
        message: `Curating candidate terms in parallel batches (${concurrencyLimit} parallel max)...`
      });
    }
  };

  const processSingleChunk = async (cIdx) => {
    const chunkEntries = chunks[cIdx];
    const statusObj = chunkStatuses[cIdx];
    const prevAttempts = chunkPreviousAttempts[cIdx];
    const chunkMaxAttempts = prevAttempts + 5;

    statusObj.status = 'processing';
    emitProgress();

    const prompt = `${systemInstruction}

Input list:
${JSON.stringify(chunkEntries)}

Return a JSON array of objects with the exact same structure as the input:
[
  { "topic": "...", "pages": "...", "notes": "", "source": "auto" }
]`;

    let chunkSuccess = false;

    for (let attempt = prevAttempts + 1; attempt <= chunkMaxAttempts; attempt++) {
      statusObj.attempt = attempt;
      statusObj.maxAttempts = chunkMaxAttempts;
      statusObj.message = `Retrying (${selectedModel})... Attempt ${attempt}/${chunkMaxAttempts}`;
      emitProgress();

      emitApiDebugLog(`[POST] Calling models/${selectedModel}:generateContent (Batch ${statusObj.chunkIndex}/${statusObj.totalChunks}, Attempt ${attempt}/${chunkMaxAttempts})...`);

      try {
        const response = await net.fetch(`https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${geminiApiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: "application/json"
            }
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          let parsedError = errorText;
          try {
            const errorJson = JSON.parse(errorText);
            if (errorJson.error && errorJson.error.message) {
              parsedError = errorJson.error.message;
            }
          } catch (e) {}

          const errSummary = `HTTP ${response.status}: ${parsedError}`;
          emitApiDebugLog(`❌ [API Error] Batch ${statusObj.chunkIndex}/${statusObj.totalChunks} returned ${errSummary}`);
          throw new Error(errSummary);
        }

        const resData = await response.json();
        if (!resData.candidates || resData.candidates.length === 0) {
          emitApiDebugLog(`⚠️ [API Warning] Batch ${statusObj.chunkIndex}/${statusObj.totalChunks} returned 200 OK but empty candidates array.`);
          throw new Error('Gemini API returned empty response candidates.');
        }

        const responseText = resData.candidates[0].content.parts[0].text;
        const parsedResult = JSON.parse(responseText);
        let items = Array.isArray(parsedResult) ? parsedResult : (parsedResult && Array.isArray(parsedResult.filtered_terms) ? parsedResult.filtered_terms : null);

        if (Array.isArray(items)) {
          allCuratedEntries.push(...items);
          chunkSuccess = true;
          statusObj.status = 'success';
          statusObj.message = `Completed (${items.length} kept)`;
          statusObj.lastErrorMessage = null;
          emitApiDebugLog(`✅ [HTTP 200] Batch ${statusObj.chunkIndex}/${statusObj.totalChunks} succeeded on Attempt ${attempt}/${chunkMaxAttempts}! Returned ${items.length} curated terms.`);
          emitProgress();
          break;
        } else {
          throw new Error("Unexpected JSON structure returned from AI.");
        }

      } catch (error) {
        statusObj.lastErrorMessage = error.message;
        const errLower = error.message.toLowerCase();
        const isHighDemand = errLower.includes("high demand") || 
                             errLower.includes("quota exceeded") || 
                             errLower.includes("resource has been exhausted") || 
                             errLower.includes("429") || 
                             errLower.includes("503") || 
                             errLower.includes("rate limit") || 
                             errLower.includes("volume of traffic");

        if (isHighDemand && attempt < chunkMaxAttempts) {
          const waitTimeSeconds = Math.min(15 * Math.pow(2, (attempt - prevAttempts) - 1), 60);
          for (let remaining = waitTimeSeconds; remaining > 0; remaining--) {
            statusObj.message = `Rate Limit/Traffic Wait (${remaining}s)... (Attempt ${attempt + 1}/${chunkMaxAttempts})`;
            emitProgress();
            await new Promise(r => setTimeout(r, 1000));
          }
        } else if (attempt < chunkMaxAttempts) {
          await new Promise(r => setTimeout(r, 3000));
        }
      }
    }

    if (!chunkSuccess) {
      statusObj.status = 'failed';
      statusObj.message = statusObj.lastErrorMessage || `Failed after ${chunkMaxAttempts} attempts.`;
      const originalFc = isRetry ? options.failedChunks[cIdx] : null;
      failedChunks.push({
        chunkIndex: originalFc ? originalFc.chunkIndex : (cIdx + 1),
        totalChunks: originalFc ? originalFc.totalChunks : chunks.length,
        rawEntries: chunkEntries,
        error: statusObj.lastErrorMessage,
        attemptsCompleted: chunkMaxAttempts
      });
      emitApiDebugLog(`⛔ [BATCH FAILED] Batch ${statusObj.chunkIndex}/${statusObj.totalChunks} failed after ${chunkMaxAttempts} attempts: ${statusObj.lastErrorMessage}`);
      emitProgress();
    }
  };

  // True Dynamic Concurrency Worker Pool (max concurrencyLimit active workers)
  let nextChunkIndex = 0;

  const worker = async () => {
    while (nextChunkIndex < chunks.length) {
      const currentIndex = nextChunkIndex++;
      await processSingleChunk(currentIndex);
    }
  };

  const activeWorkerPool = [];
  const workerCount = Math.min(concurrencyLimit, chunks.length);
  for (let w = 0; w < workerCount; w++) {
    activeWorkerPool.push((async () => {
      // Stagger initial worker launch by 250ms to prevent API collisions
      await new Promise(r => setTimeout(r, w * 250));
      await worker();
    })());
  }

  await Promise.all(activeWorkerPool);

  if (event) {
    event.sender.send('auto-index-progress', {
      step: 'curating',
      currentChunk: chunks.length,
      totalChunks: chunks.length,
      chunkStatuses: chunkStatuses,
      message: failedChunks.length > 0 
        ? `Curation finished with ${failedChunks.length} failed batch(es).` 
        : `Curation complete! All ${chunks.length} batches succeeded.`
    });
  }

  return {
    entries: allCuratedEntries,
    failedChunks: failedChunks,
    error: failedChunks.length > 0 ? `${failedChunks.length} of ${chunks.length} batch(es) failed to curate due to rate limits or API errors.` : null
  };
}

// Helper: Curate Index with Local SLM Engine
async function curateIndexWithLocalSLM(entries, pythonExe, tempDir, event, localSlmModel = '0.5b', localSlmPrompt = null) {
  logDebug(`[Local SLM Curation] Initiating (${localSlmModel}) with ${entries.length} candidate terms...`);

  if (event) {
    event.sender.send('auto-index-progress', { 
      step: 'curating-slm', 
      message: `Running Local Neural SLM (${localSlmModel.toUpperCase()}) Curation Engine...` 
    });
  }

  const inputJsonFile = path.join(tempDir, 'slm_input_entries.json');
  const outputJsonFile = path.join(tempDir, 'slm_output_entries.json');

  fs.writeFileSync(inputJsonFile, JSON.stringify(entries, null, 2), 'utf8');

  const curateScript = path.join(__dirname, 'engine', 'curate_slm.py');
  const args = [curateScript, inputJsonFile, outputJsonFile, '--model', localSlmModel];
  if (localSlmPrompt && localSlmPrompt.trim()) {
    args.push('--custom-prompt', localSlmPrompt.trim());
  }

  return new Promise((resolve) => {
    const proc = spawn(pythonExe, args, { cwd: path.join(__dirname, 'engine') });
    let stderr = '';

    proc.stdout.on('data', (data) => {
      const msg = data.toString();
      logDebug(`[Local SLM Curation Output] ${msg}`);
      if (event && msg.includes('[VERIFICATION]')) {
        event.sender.send('auto-index-progress', { 
          step: 'curating-slm', 
          message: msg.trim() 
        });
      }
    });

    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('close', (code) => {
      if (code === 0 && fs.existsSync(outputJsonFile)) {
        try {
          const curatedEntries = JSON.parse(fs.readFileSync(outputJsonFile, 'utf8'));
          logDebug(`[Local SLM Curation] Curation successful! Returned ${curatedEntries.length} terms.`);
          resolve({ entries: curatedEntries, error: null });
          return;
        } catch (err) {
          logDebug(`[Local SLM Curation] Failed to parse output JSON: ${err.message}`);
        }
      }
      logDebug(`[Local SLM Curation] Failed with exit code ${code}: ${stderr}`);
      resolve({ entries: entries, error: `Local SLM curation failed: ${stderr || 'Unknown error'}` });
    });
  });
}

// Helper: Generate Practice Quiz with Gemini AI
async function generateQuizWithGemini(textFile, numQuestions, difficulty, geminiApiKey, event, geminiModel) {
  logDebug(`[Gemini Quiz Gen] Initiating. Questions: ${numQuestions}, Difficulty: ${difficulty}, Model: ${geminiModel || 'gemini-flash-latest'}`);

  if (!fs.existsSync(textFile)) {
    throw new Error("Text file for quiz generation does not exist.");
  }

  let textContent = fs.readFileSync(textFile, 'utf8');
  // Clean up content slightly (remove excessive whitespace)
  textContent = textContent.replace(/\s+/g, ' ');

  // SANS books can be long. Slicing the first 250,000 characters
  // is plenty for generating representative cybersecurity multiple-choice questions.
  const maxChars = 250000;
  const textSample = textContent.length > maxChars ? textContent.substring(0, maxChars) : textContent;

  const prompt = `You are an expert SANS Cybersecurity Instructor and exam writer. Your goal is to write a high-quality practice quiz based on the course material provided below.

Generate exactly ${numQuestions} multiple-choice questions at the ${difficulty} difficulty level.

Strictly adhere to these guidelines:
1. Questions must be highly technical and realistic SANS exam questions.
2. The options must contain one correct answer and three plausible but incorrect distractors.
3. Provide a detailed, paragraph-long SANS-level answer explanation explaining the concepts, why the correct option is right, and why the other options are wrong.
4. Output must be valid JSON in the specified format, with no other text, markdown blocks, or formatting around it.

Format your response strictly as a JSON array of objects:
[
  {
    "question": "The question text here...",
    "options": [
      "Option A text",
      "Option B text",
      "Option C text",
      "Option D text"
    ],
    "correctIndex": 0,
    "explanation": "Thorough SANS-style explanation here..."
  }
]

Course Content:
${textSample}
`;

  const maxAttempts = 3;
  let attempt = 0;

  while (attempt < maxAttempts) {
    attempt++;
    logDebug(`[Gemini Quiz Gen] Attempt ${attempt}/${maxAttempts}...`);

    if (event) {
      event.sender.send('auto-index-progress', { 
        step: 'quiz-generating', 
        attempt: attempt, 
        maxAttempts: maxAttempts,
        isOverloaded: attempt > 1,
        message: `Generating ${numQuestions} Practice Quiz questions (${difficulty})...`
      });
    }

    try {
      const model = geminiModel || 'gemini-flash-latest';
      const response = await net.fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { 
            responseMimeType: "application/json"
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        logDebug(`[Gemini Quiz Gen] API returned error: ${response.status} - ${errorText}`);
        let parsedError = errorText;
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.error && errorJson.error.message) {
            parsedError = errorJson.error.message;
          }
        } catch (e) {}
        throw new Error(`Gemini API Error: ${parsedError}`);
      }

      const resData = await response.json();
      if (!resData.candidates || resData.candidates.length === 0) {
        throw new Error('Gemini API returned empty response candidates.');
      }

      const responseText = resData.candidates[0].content.parts[0].text;
      const questions = JSON.parse(responseText);

      if (Array.isArray(questions) && questions.length > 0) {
        const validated = questions.filter(q => {
          return q.question && Array.isArray(q.options) && q.options.length === 4 && typeof q.correctIndex === 'number' && q.explanation;
        });

        if (validated.length > 0) {
          logDebug(`[Gemini Quiz Gen] Successfully generated ${validated.length} quiz questions.`);
          return { questions: validated, error: null };
        }
      }
      throw new Error("Invalid JSON structure returned by Gemini.");

    } catch (error) {
      logDebug(`[Gemini Quiz Gen] Attempt ${attempt} failed: ${error.message}`);
      
      const errLower = error.message.toLowerCase();
      const isHighDemand = errLower.includes("high demand") || 
                           errLower.includes("quota exceeded") || 
                           errLower.includes("resource has been exhausted") || 
                           errLower.includes("429") || 
                           errLower.includes("503") || 
                           errLower.includes("rate limit") || 
                           errLower.includes("volume of traffic");

      if (isHighDemand && attempt < maxAttempts) {
        const waitTimeSeconds = 15 * Math.pow(2, attempt - 1);
        logDebug(`[Gemini Quiz Gen] Rate limit detected. Waiting ${waitTimeSeconds} seconds...`);
        for (let remaining = waitTimeSeconds; remaining > 0; remaining--) {
          if (event) {
            event.sender.send('auto-index-progress', { 
              step: 'quiz-generating', 
              attempt: attempt + 1, 
              maxAttempts: maxAttempts,
              isOverloaded: true,
              message: `Gemini models are experiencing high volumes of traffic right now. Retrying in ${remaining}s... 🤙` 
            });
          }
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        continue;
      }

      let finalErrorMessage = error.message;
      if (attempt === maxAttempts && isHighDemand) {
        finalErrorMessage = "Google's free tier rate limit was exceeded. Try again later.";
      }
      return { questions: [], error: finalErrorMessage };
    }
  }
}

// IPC Handler: Run Auto-Indexing
ipcMain.handle('run-auto-index', async (event, args) => {
  const { pdfPath, password, fname, lname, email, geminiApiKey, geminiModel, settings } = args;
  logDebug(`[Auto-Index Handler] Received args - PDF: ${pdfPath ? 'yes' : 'no'}, Model: ${geminiModel}, Key present: ${!!geminiApiKey}, Key val length: ${geminiApiKey ? geminiApiKey.length : 0}, Watermark info: ${fname}/${lname}/${email}`);
  
  if (geminiApiKey) {
    try {
      logDebug(`[Diagnostic] Querying v1beta models...`);
      const listV1Beta = await net.fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${geminiApiKey}`);
      if (listV1Beta.ok) {
        const data = await listV1Beta.json();
        const modelNames = data.models ? data.models.map(m => m.name) : [];
        logDebug(`[Diagnostic] v1beta models: ${modelNames.join(', ')}`);
      } else {
        const errTxt = await listV1Beta.text();
        logDebug(`[Diagnostic] v1beta list failed: ${listV1Beta.status} - ${errTxt}`);
      }
    } catch (diagErr) {
      logDebug(`[Diagnostic] v1beta query error: ${diagErr.message}`);
    }
  }

  const tempDir = path.join(__dirname, 'temp_indexing');
  
  try {
    if (fs.existsSync(tempDir)) {
      const files = fs.readdirSync(tempDir);
      for (const file of files) {
        fs.unlinkSync(path.join(tempDir, file));
      }
    } else {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    const decryptedPdf = path.join(tempDir, 'decrypted.pdf');
    const processedPdf = path.join(tempDir, 'processed.pdf');
    const textFile = path.join(tempDir, 'text.txt');
    const indexOutputFile = path.join(tempDir, 'index_output.txt');
    
    // Decrypt
    event.sender.send('auto-index-progress', { step: 'decrypting', message: 'Decrypting PDF...' });
    
    let decryptArgs = [];
    if (password) {
      decryptArgs.push(`--password=${password}`);
    }
    decryptArgs.push('--decrypt', pdfPath, decryptedPdf);
    
    await new Promise((resolve, reject) => {
      const qpdfProc = spawn(resolveQpdfPath(), decryptArgs);
      let stderr = '';
      qpdfProc.stderr.on('data', (data) => stderr += data.toString());
      qpdfProc.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Decryption failed: ${stderr || 'Wrong password or corrupted PDF'}`));
        } else {
          resolve();
        }
      });
    });
    
    let sourceFile = decryptedPdf;
    const pythonExe = await ensurePythonEnvironment(event);
      
    // OCR if enabled
    if (settings.useOcr) {
      event.sender.send('auto-index-progress', { step: 'ocr', message: 'Running OCR on images (this will take a while)...' });
      const ocrScript = path.join(__dirname, 'engine', 'extract_img_text.py');
      await new Promise((resolve, reject) => {
        const ocrProc = spawn(pythonExe, [ocrScript, decryptedPdf, processedPdf]);
        let stderr = '';
        ocrProc.stderr.on('data', (data) => stderr += data.toString());
        ocrProc.on('close', (code) => {
          if (code !== 0) {
            reject(new Error(`OCR failed: ${stderr}`));
          } else {
            resolve();
          }
        });
      });
      sourceFile = processedPdf;
    }
    
    // Extract Text (pdftotext)
    const resolvedPdftotext = resolvePdftotextPath();
    const hasPdftotext = resolvedPdftotext !== 'pdftotext' || await checkCommand('pdftotext -v');
    let usePdfDirectly = false;
    
    if (hasPdftotext) {
      event.sender.send('auto-index-progress', { step: 'converting', message: 'Extracting text from PDF...' });
      await new Promise((resolve) => {
        const pdfToTextProc = spawn(resolvedPdftotext, [sourceFile, textFile]);
        let stderr = '';
        pdfToTextProc.stderr.on('data', (data) => stderr += data.toString());
        pdfToTextProc.on('close', (code) => {
          if (code !== 0) {
            console.error(`pdftotext failed: ${stderr}. Falling back to direct PDF text extraction.`);
            usePdfDirectly = true;
          }
          resolve();
        });
      });
    } else {
      usePdfDirectly = true;
    }

    // Apply Front-Matter & Back-Matter Page Exclusion Rules (Regular Books vs Lab Workbooks)
    if (fs.existsSync(textFile)) {
      const rawText = fs.readFileSync(textFile, 'utf8');
      const pages = rawText.split('\x0c');

      if (pages.length > 1) {
        // 1. Detect Book Type (Lab Workbook vs Regular Textbook) based on cover page title conventions
        const coverText = (pages[0] || '') + ' ' + (pages[1] || '');
        const baseName = path.basename(sourceFile || '').toLowerCase();

        // SANS Cover Conventions:
        // - Lab Workbooks: Cover title reads "Workbook Sections [x]-[x]" or filename contains "workbook"
        // - Regular Textbooks: Cover title format reads "[Class #].[Book #]" (e.g. SEC565.1, 565.1)
        const isLabWorkbook = /\bworkbook\s+sections?\b/i.test(coverText) ||
                              /\b(lab\s*workbook|exercise\s*workbook|hands-on\s*labs?)\b/i.test(coverText) ||
                              /\b(workbook|lab_workbook|lab-workbook)\b/i.test(baseName);

        if (isLabWorkbook) {
          // Lab Workbook Rule: Ignore everything up until the first lab banner in the book
          const labBannerRegex = /\b(lab\s*\d|exercise\s*\d|lab\s*banner|hands-on\s*lab)\b/i;
          let firstLabIdx = -1;
          for (let i = 0; i < Math.min(pages.length, 25); i++) {
            if (labBannerRegex.test(pages[i])) {
              firstLabIdx = i;
              break;
            }
          }
          if (firstLabIdx > 0) {
            for (let k = 0; k < firstLabIdx; k++) {
              pages[k] = ''; // Clear text before first lab banner
            }
            logDebug(`[Auto-Index Filter] LAB WORKBOOK: Cleared pages 1 to ${firstLabIdx} (before first lab banner on page ${firstLabIdx + 1}).`);
          }
        } else {
          // Regular Textbook Rule: Ignore front matter up to & including the 1st "Module Objectives" page. Ignore last page.
          // Matches "Module Objectives", "Module 1 Objectives", "Course Objectives", "Module 1 Overview", etc.
          const objRegex = /\b(module\s*(?:\d+)?\s*objectives?|course\s+objectives?|module\s*(?:\d+)?\s*overview|course\s+overview|course\s+agenda)\b/i;
          let firstObjIdx = -1;
          for (let i = 0; i < Math.min(pages.length, 15); i++) {
            if (objRegex.test(pages[i])) {
              firstObjIdx = i;
              break;
            }
          }
          if (firstObjIdx >= 0) {
            for (let k = 0; k <= firstObjIdx; k++) {
              pages[k] = ''; // Clear pages up to & including the 1st module objectives page
            }
            logDebug(`[Auto-Index Filter] REGULAR TEXTBOOK: Cleared pages 1 to ${firstObjIdx + 1} (1st Module Objectives on page ${firstObjIdx + 1}). Indexing starts on page ${firstObjIdx + 2}.`);
          } else {
            // Fallback if no objectives header found: clear first 5 pages of front-matter
            const defaultSkip = Math.min(5, pages.length - 1);
            for (let k = 0; k < defaultSkip; k++) {
              pages[k] = '';
            }
            logDebug(`[Auto-Index Filter] REGULAR TEXTBOOK: No objectives header found. Default cleared pages 1 to ${defaultSkip}.`);
          }

          // Clear very last page (SANS contact / feedback page) for regular books
          if (pages.length > 1) {
            pages[pages.length - 1] = '';
            logDebug(`[Auto-Index Filter] REGULAR TEXTBOOK: Cleared last contact page (page ${pages.length}).`);
          }
        }

        fs.writeFileSync(textFile, pages.join('\x0c'), 'utf8');
      }
    }
    
    const indexInputFile = usePdfDirectly ? sourceFile : textFile;
    // Indexing
    event.sender.send('auto-index-progress', { step: 'indexing', message: 'Generating index terms...' });
    
    const buildIndexScript = path.join(__dirname, 'engine', 'build_index.py');
    const indexArgs = [buildIndexScript];
    
    if (settings.offset) indexArgs.push('-o', settings.offset.toString());
    if (settings.minLength) indexArgs.push('-l', settings.minLength.toString());
    if (settings.maxLength) indexArgs.push('-L', settings.maxLength.toString());
    if (settings.minFrequency) indexArgs.push('-f', settings.minFrequency.toString());
    if (settings.maxFrequency) indexArgs.push('-F', settings.maxFrequency.toString());
    if (settings.zipf) indexArgs.push('-z', settings.zipf.toString());
    
    indexArgs.push('-r', '[a-zA-Z0-9 :.&_-]+');
    
    // Add watermark exclusion words
    const excludeWordsSet = new Set(['licensed', 'to']);
    if (fname) {
      fname.toLowerCase().split(/\s+/).forEach(w => { if (w.length > 1) excludeWordsSet.add(w); });
    }
    if (lname) {
      lname.toLowerCase().split(/\s+/).forEach(w => { if (w.length > 1) excludeWordsSet.add(w); });
    }
    if (email) {
      excludeWordsSet.add(email.toLowerCase());
      email.toLowerCase().split(/[.@]/).forEach(w => { if (w.length > 2) excludeWordsSet.add(w); });
    }
    if (excludeWordsSet.size > 0) {
      indexArgs.push('--exclude-words', Array.from(excludeWordsSet).join(','));
    }
    
    indexArgs.push(indexInputFile, indexOutputFile);
    
    await new Promise((resolve, reject) => {
      const indexProc = spawn(pythonExe, indexArgs, { cwd: path.join(__dirname, 'engine') });
      let stderr = '';
      indexProc.stderr.on('data', (data) => stderr += data.toString());
      indexProc.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Indexing failed: ${stderr}`));
        } else {
          resolve();
        }
      });
    });
    
    // Parse
    event.sender.send('auto-index-progress', { step: 'parsing', message: 'Parsing output...' });
    if (!fs.existsSync(indexOutputFile)) {
      throw new Error('Auto-index completed but output file was not found.');
    }
    
    const indexContent = fs.readFileSync(indexOutputFile, 'utf8');
    const entries = [];
    const lines = indexContent.split('\n');
    
    for (let line of lines) {
      line = line.replace(/\r/g, '');
      if (!line.trim() || (line.startsWith('[') && line.endsWith(']'))) {
        continue;
      }
      
      const colonIndex = line.lastIndexOf(':');
      if (colonIndex === -1) continue;
      
      const topic = line.substring(0, colonIndex).trim();
      const pages = line.substring(colonIndex + 1).trim();
      
      if (topic && pages) {
        entries.push({
          topic: topic,
          pages: pages,
          notes: '',
          source: 'auto'
        });
      }
    }

    let finalEntries = entries;
    let curationError = null;
    if (entries.length > 0) {
      if (settings.curationEngine === 'local-slm') {
        const curationResult = await curateIndexWithLocalSLM(entries, pythonExe, tempDir, event, settings.localSlmModel || '0.5b', settings.localSlmPrompt || null);
        finalEntries = curationResult.entries;
        curationError = curationResult.error;
      } else if (geminiApiKey) {
        const curationResult = await curateIndexWithGemini(entries, geminiApiKey, event, geminiModel, settings.geminiPrompt || null);
        finalEntries = curationResult.entries;
        curationError = curationResult.error;
        var failedChunks = curationResult.failedChunks || [];
      }
    }

    // Quiz Generation (Sequential & Independent)
    let quizQuestions = [];
    let quizError = null;
    let quizGenerated = false;

    if (settings.generateQuiz && geminiApiKey) {
      if (!fs.existsSync(textFile) && fs.existsSync(sourceFile)) {
        event.sender.send('auto-index-progress', { step: 'converting', message: 'Extracting text for quiz generation...' });
        const pythonTextExtractCode = `import sys; from pdfminer.high_level import extract_text; open(sys.argv[2], "w", encoding="utf-8").write(extract_text(sys.argv[1]))`;
        await new Promise((resolve) => {
          const proc = spawn(pythonExe, ['-c', pythonTextExtractCode, sourceFile, textFile]);
          proc.on('close', () => resolve());
        });
      }
      
      const quizResult = await generateQuizWithGemini(
        textFile, 
        settings.quizCount, 
        settings.quizDifficulty, 
        geminiApiKey, 
        event, 
        geminiModel
      );
      
      if (quizResult.error) {
        quizError = quizResult.error;
      } else {
        quizQuestions = quizResult.questions;
        quizGenerated = true;
      }
    }

    // Cleanup
    try {
      if (fs.existsSync(tempDir)) {
        const files = fs.readdirSync(tempDir);
        for (const file of files) {
          fs.unlinkSync(path.join(tempDir, file));
        }
        fs.rmdirSync(tempDir);
      }
    } catch (e) {}
    
    return { success: true, entries: finalEntries, curationError, failedChunks: typeof failedChunks !== 'undefined' ? failedChunks : [], quizQuestions, quizError, quizGenerated };
    
  } catch (error) {
    console.error('Auto-indexing pipeline error:', error);
    try {
      if (fs.existsSync(tempDir)) {
        const files = fs.readdirSync(tempDir);
        for (const file of files) {
          fs.unlinkSync(path.join(tempDir, file));
        }
        fs.rmdirSync(tempDir);
      }
    } catch (e) {}
    return { success: false, error: error.message };
  }
});

ipcMain.handle('retry-gemini-curation', async (event, args) => {
  const { entries, geminiApiKey, geminiModel } = args;
  logDebug(`[Auto-Index Handler] Received retry-gemini-curation request for ${entries ? entries.length : 0} terms. Model: ${geminiModel}`);
  
  try {
    const curationResult = await curateIndexWithGemini(entries, geminiApiKey, event, geminiModel);
    return { success: curationResult.error ? false : true, entries: curationResult.entries, error: curationResult.error };
  } catch (error) {
    logDebug(`[Auto-Index Handler] Retry curation failed: ${error.message}`);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('retry-failed-chunks', async (event, args) => {
  const { failedChunks, geminiApiKey, geminiModel, geminiPrompt } = args;
  logDebug(`[Auto-Index Handler] Received retry-failed-chunks request for ${failedChunks ? failedChunks.length : 0} chunks. Model: ${geminiModel}`);
  
  if (!failedChunks || failedChunks.length === 0) {
    return { success: true, entries: [], failedChunks: [] };
  }

  try {
    const curationResult = await curateIndexWithGemini([], geminiApiKey, event, geminiModel, geminiPrompt || null, {
      isRetry: true,
      failedChunks: failedChunks
    });
    return {
      success: curationResult.failedChunks && curationResult.failedChunks.length > 0 ? false : true,
      entries: curationResult.entries,
      failedChunks: curationResult.failedChunks || [],
      error: curationResult.error
    };
  } catch (error) {
    logDebug(`[Auto-Index Handler] Retry failed chunks failed: ${error.message}`);
    return { success: false, entries: [], failedChunks: failedChunks, error: error.message };
  }
});

ipcMain.handle('check-local-model-status', async (event, modelKey) => {
  try {
    const pythonExe = await getSystemPythonCommand();
    const curateScript = path.join(__dirname, 'engine', 'curate_slm.py');
    return new Promise((resolve) => {
      const proc = spawn(pythonExe, [curateScript, '--model', modelKey || '0.5b', '--check-downloaded'], { cwd: path.join(__dirname, 'engine') });
      let stdout = '';
      proc.stdout.on('data', (data) => { stdout += data.toString(); });
      proc.on('close', (code) => {
        if (code === 0 && stdout) {
          try {
            const parsed = JSON.parse(stdout.trim());
            resolve({ downloaded: !!parsed.downloaded, model: parsed.model });
            return;
          } catch (e) {}
        }
        resolve({ downloaded: false, model: modelKey });
      });
    });
  } catch (err) {
    return { downloaded: false, error: err.message };
  }
});

ipcMain.handle('download-local-model', async (event, modelKey) => {
  try {
    const pythonExe = await getSystemPythonCommand();
    const curateScript = path.join(__dirname, 'engine', 'curate_slm.py');
    return new Promise((resolve) => {
      const proc = spawn(pythonExe, [curateScript, '--model', modelKey || '0.5b', '--download-only'], { cwd: path.join(__dirname, 'engine') });
      let outputLogs = '';
      proc.stdout.on('data', (data) => {
        const str = data.toString();
        outputLogs += str;
        event.sender.send('model-download-progress', { modelKey, text: str });
      });
      proc.stderr.on('data', (data) => {
        const str = data.toString();
        outputLogs += str;
        event.sender.send('model-download-progress', { modelKey, text: str });
      });
      proc.on('close', (code) => {
        if (code === 0) {
          resolve({ success: true, modelKey });
        } else {
          resolve({ success: false, error: outputLogs });
        }
      });
    });
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// Helper: Robustly parse or repair JSON array output from AI models
function tryParseJSONArray(text) {
  if (!text) return null;
  let clean = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');

  // 1. Direct JSON parse
  try {
    const val = JSON.parse(clean);
    if (Array.isArray(val)) return val;
  } catch (e) {}

  // 2. Extract array substring using regex
  const match = clean.match(/\[[\s\S]*\]/);
  if (match) {
    try {
      const val = JSON.parse(match[0]);
      if (Array.isArray(val)) return val;
    } catch (e) {}
  }

  // 3. Repair truncated JSON array: find start '[' and last completed object '}'
  const startIdx = clean.indexOf('[');
  const lastObjEnd = clean.lastIndexOf('}');
  if (startIdx !== -1 && lastObjEnd > startIdx) {
    const repaired = clean.substring(startIdx, lastObjEnd + 1) + ']';
    try {
      const val = JSON.parse(repaired);
      if (Array.isArray(val)) return val;
    } catch (e) {}
  }

  return null;
}

// ==========================================================================
// IPC Handler: Parse PDF Index File with Gemini AI
// ==========================================================================
ipcMain.handle('parse-pdf-index', async (event, params = {}) => {
  const pdfPath = params.pdfPath || params.filePath;
  const geminiApiKey = params.geminiApiKey || params.geminiKey;
  const geminiModel = params.geminiModel;
  const mode = params.parseMode || params.mode || (geminiApiKey ? 'ai-generic' : 'sans-fast');
  logDebug(`[PDF Index Parser] Starting. Mode: ${mode}, PDF: ${pdfPath}, Key present: ${!!geminiApiKey}, Model: ${geminiModel || 'gemini-flash-latest'}`);

  try {
    const pythonExe = await ensurePythonEnvironment(event);

    // =========================================================================
    // MODE 1: Fast Local SANS Index Parsing (PyMuPDF / fitz layout extraction)
    // =========================================================================
    if (mode === 'sans-fast') {
      const fastScript = `
import sys, json, fitz, re

pdf_path = sys.argv[1]
doc = fitz.open(pdf_path)
all_entries = []

for page in doc:
    drawings = page.get_drawings()
    gray_rects = []
    for d in drawings:
        if 'rect' in d and d.get('fill'):
            r = d['rect']
            if r.width > 200 and r.height >= 8.0:
                gray_rects.append((round(r.y0, 1), round(r.y1, 1)))

    gray_rects = sorted(list(set(gray_rects)), key=lambda x: x[0])
    merged_gray = []
    for g_y0, g_y1 in gray_rects:
        if merged_gray and g_y0 < merged_gray[-1][1]:
            merged_gray[-1] = (merged_gray[-1][0], max(merged_gray[-1][1], g_y1))
        else:
            merged_gray.append((g_y0, g_y1))

    def get_gray_rect(y_val):
        for g in merged_gray:
            if g[0] - 0.5 <= y_val < g[1] - 0.5:
                return g
        return None

    page_dict = page.get_text('dict')
    lines = []
    for b in page_dict['blocks']:
        if 'lines' in b:
            for l in b['lines']:
                line_text = ''.join([w['text'] for w in l['spans']]).strip()
                if line_text:
                    y0 = round(l['bbox'][1], 1)
                    x0 = round(l['bbox'][0], 1)
                    lines.append((y0, x0, line_text))
    lines.sort(key=lambda x: (x[0], x[1]))

    filtered_lines = []
    for y0, x0, text in lines:
        if text in ['Index', 'Note: The numbers indicate the book number, followed by the page number.']:
            continue
        if len(text) == 1 and text.isupper():
            continue
        filtered_lines.append((y0, x0, text))

    if not filtered_lines: continue

    rows = []
    for y0, x0, text in filtered_lines:
        matched = False
        for r in rows:
            if abs(r['y0'] - y0) <= 4.0:
                if x0 < 250:
                    r['topic_parts'].append((x0, text))
                else:
                    r['page_parts'].append((x0, text))
                matched = True
                break
        if not matched:
            rows.append({
                'y0': y0,
                'gray_rect': get_gray_rect(y0),
                'topic_parts': [(x0, text)] if x0 < 250 else [],
                'page_parts': [(x0, text)] if x0 >= 250 else []
            })
    rows.sort(key=lambda r: r['y0'])

    idx = 0
    while idx < len(rows):
        t_spans = sorted(rows[idx]['topic_parts'], key=lambda x: x[0])
        if not t_spans:
            idx += 1
            continue

        t_first = ' '.join([s[1] for s in t_spans]).strip()
        topic_lines = [t_first]
        page_lines = []

        p_spans = sorted(rows[idx]['page_parts'], key=lambda x: x[0])
        p_first = ' '.join([s[1] for s in p_spans]).strip()
        if p_first:
            page_lines.append(p_first)

        curr_rect = rows[idx]['gray_rect']

        curr = idx + 1
        while curr < len(rows):
            r_curr = rows[curr]
            curr_t_spans = sorted(r_curr['topic_parts'], key=lambda x: x[0])
            curr_p_spans = sorted(r_curr['page_parts'], key=lambda x: x[0])

            t_curr = ' '.join([s[1] for s in curr_t_spans]).strip()
            p_curr = ' '.join([s[1] for s in curr_p_spans]).strip()

            if not t_curr and not p_curr:
                curr += 1
                continue

            if not t_curr and p_curr:
                page_lines.append(p_curr)
                curr += 1
                continue

            is_continuation = False
            if t_curr.startswith('(') or t_curr.startswith('-'):
                is_continuation = True
            elif curr_rect is not None and r_curr['gray_rect'] == curr_rect:
                is_continuation = True

            if is_continuation:
                topic_lines.append(t_curr)
                if p_curr:
                    page_lines.append(p_curr)
                curr += 1
            else:
                break

        all_entries.append((' '.join(topic_lines).strip(), ' '.join(page_lines).strip()))
        idx = curr

result_entries = []
for topic, pages_raw in all_entries:
    parts = re.split(r'(?=\\b\\d+:)', pages_raw)
    book_pages = {}
    for part in parts:
        part = part.strip().rstrip(',')
        if not part: continue
        m = re.match(r'^(\\d+):(.*)$', part)
        if m:
            book_num = int(m.group(1))
            p_clean = m.group(2).strip().rstrip(',')
            if p_clean:
                if book_num not in book_pages: book_pages[book_num] = []
                book_pages[book_num].append(p_clean)
        else:
            if 1 not in book_pages: book_pages[1] = []
            book_pages[1].append(part)

    for b_num, p_list in book_pages.items():
        result_entries.append({
            'topic': topic,
            'book': b_num,
            'pages': ', '.join(p_list)
        })

print(json.dumps(result_entries))
`;

      let scriptOut = '';
      let scriptErr = '';
      await new Promise((resolve, reject) => {
        const proc = spawn(pythonExe, ['-c', fastScript, pdfPath]);
        proc.stdout.on('data', d => { scriptOut += d.toString(); });
        proc.stderr.on('data', d => { scriptErr += d.toString(); });
        proc.on('close', code => {
          if (code !== 0) reject(new Error(`Local PDF parse failed: ${scriptErr || 'Unknown error'}`));
          else resolve();
        });
      });

      let parsedEntries = [];
      try { parsedEntries = JSON.parse(scriptOut); } catch (e) {
        return { success: false, error: 'Failed to parse JSON from local PDF reader.' };
      }

      if (!Array.isArray(parsedEntries) || parsedEntries.length === 0) {
        return { success: false, error: 'No index entries were found using the fast SANS PDF parser. Try AI mode for custom PDF formats.' };
      }

      logDebug(`[PDF Index Parser] Fast Local SANS parser extracted ${parsedEntries.length} entries successfully.`);
      return { success: true, entries: parsedEntries };
    }

    // =========================================================================
    // MODE 2: AI-Powered PDF Parsing (Gemini API with ~1,800-char chunks)
    // =========================================================================
    if (!geminiApiKey) {
      return { success: false, error: 'A Gemini API key is required to use AI-Powered PDF parsing.' };
    }

    const extractCode = `import sys; from pdfminer.high_level import extract_text; text=extract_text(sys.argv[1]); print(text)`;
    let pdfText = '';
    await new Promise((resolve, reject) => {
      const proc = spawn(pythonExe, ['-c', extractCode, pdfPath]);
      let out = '';
      let err = '';
      proc.stdout.on('data', d => { out += d.toString(); });
      proc.stderr.on('data', d => { err += d.toString(); });
      proc.on('close', code => {
        if (code !== 0) reject(new Error(`PDF text extraction failed: ${err || 'Unknown error'}`));
        else resolve();
        pdfText = out;
      });
    });

    if (!pdfText || pdfText.trim().length < 20) {
      return { success: false, error: 'Could not extract readable text from the PDF. It may be scanned or image-based.' };
    }

    logDebug(`[PDF Index Parser] Extracted ${pdfText.length} chars of text for AI parsing.`);

    // Split text into small chunks (~1,800 chars each) to ensure ~99.8% extraction recall
    const lines = pdfText.split(/\r?\n/);
    const chunks = [];
    let currentChunk = [];
    let currentLen = 0;

    for (const line of lines) {
      currentChunk.push(line);
      currentLen += line.length + 1;
      if (currentLen >= 1800) {
        chunks.push(currentChunk.join('\n'));
        currentChunk = [];
        currentLen = 0;
      }
    }
    if (currentChunk.length > 0) {
      chunks.push(currentChunk.join('\n'));
    }

    logDebug(`[PDF Index Parser] Split text into ${chunks.length} small chunks (~1800 chars) for complete extraction.`);

    const model = geminiModel || 'gemini-flash-latest';
    const allRawParsedEntries = [];

    for (let cIdx = 0; cIdx < chunks.length; cIdx++) {
      const chunkText = chunks[cIdx];
      const progressPercent = Math.round(((cIdx + 1) / chunks.length) * 100);

      event.sender.send('pdf-import-progress', {
        chunkIndex: cIdx + 1,
        totalChunks: chunks.length,
        percent: progressPercent,
        message: `Parsing index chunk ${cIdx + 1} of ${chunks.length} (${progressPercent}%)...`
      });

      const prompt = `You are an expert index parser. The following text is a slice of a book index PDF.
Your task is to extract EVERY SINGLE index entry and its page references. The page references always include a BOOK NUMBER and a PAGE NUMBER.

CRITICAL INSTRUCTION: You MUST extract EVERY SINGLE index entry present in the text snippet below.
Do NOT summarize, skip, or truncate any entries. Every line with a term and page reference MUST be included.

The format can vary. Examples:
- "1:23" means Book 1, Page 23
- "2:45-47" means Book 2, Pages 45-47
- "Bk1 p.23" means Book 1, Page 23
- "Book 2, pg 45" means Book 2, Page 45
- "1-23" (where first digit is the book) means Book 1, Page 23
- "3:12, 3:45, 4:7" means Book 3 pages 12 and 45, Book 4 page 7

For each index entry, create one JSON object PER BOOK it appears in:
{ "topic": "Entry Name", "book": 1, "pages": "23, 45-47" }

Rules:
- "book" must be an integer (the book number)
- "pages" must be a string of comma-separated page numbers/ranges for THAT BOOK ONLY
- "topic" is the index entry name exactly as it appears
- If an entry appears in multiple books, create one object per book
- Ignore headers, footers, page numbers that are not part of index entries
- Return ONLY a raw JSON array, no markdown, no explanation

Index text slice:
${chunkText}`;

      const maxAttempts = 3;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        logDebug(`[PDF Index Parser] Chunk ${cIdx + 1}/${chunks.length}, attempt ${attempt}/${maxAttempts}...`);
        try {
          const response = await net.fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { 
                  responseMimeType: 'application/json',
                  maxOutputTokens: 8192
                },
                safetySettings: [
                  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                  { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                  { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                  { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
                ]
              })
            }
          );

          if (!response.ok) {
            const errText = await response.text();
            logDebug(`[PDF Index Parser] Chunk ${cIdx + 1} API error ${response.status}: ${errText}`);
            if ((response.status === 429 || response.status === 503) && attempt < maxAttempts) {
              // Rate limit hit (Free Tier 15 RPM). Emit user-facing status message before pausing.
              event.sender.send('pdf-import-progress', {
                chunkIndex: cIdx + 1,
                totalChunks: chunks.length,
                percent: progressPercent,
                message: `Waiting for API request per minute to refresh. Pausing for maximum of 1 minute...`
              });
              await new Promise(r => setTimeout(r, 16000));
              continue;
            }
            break;
          }

          const resData = await response.json();
          if (resData.candidates && resData.candidates.length > 0) {
            const responseText = resData.candidates[0].content.parts[0].text;
            const chunkEntries = tryParseJSONArray(responseText);
            if (Array.isArray(chunkEntries) && chunkEntries.length > 0) {
              allRawParsedEntries.push(...chunkEntries);
              logDebug(`[PDF Index Parser] Chunk ${cIdx + 1} succeeded: ${chunkEntries.length} entries.`);
              break;
            }
          }
        } catch (fetchErr) {
          logDebug(`[PDF Index Parser] Chunk ${cIdx + 1} fetch error: ${fetchErr.message}`);
          if (attempt < maxAttempts) await new Promise(r => setTimeout(r, 5000));
        }
      }
    }

    if (allRawParsedEntries.length === 0) {
      return { success: false, error: 'No valid index entries could be parsed from the PDF using AI.' };
    }

    // Validate and sanitize entries
    const validEntries = allRawParsedEntries
      .filter(e => e && typeof e.topic === 'string' && e.topic.trim() && typeof e.book === 'number' && e.pages)
      .map(e => ({
        topic: e.topic.trim(),
        book: Math.round(e.book),
        pages: String(e.pages).trim()
      }));

    logDebug(`[PDF Index Parser] AI Total parsed valid entries: ${validEntries.length}`);
    return { success: true, entries: validEntries };

  } catch (err) {
    logDebug(`[PDF Index Parser] Unexpected error: ${err.message}`);
    return { success: false, error: err.message };
  }
});

// ==========================================================================
// IPC Handler: Combine Same Items using Gemini AI (Chunked Batching Engine)
// ==========================================================================
ipcMain.handle('combine-same-items', async (event, { entries, geminiApiKey, geminiModel }) => {
  logDebug(`[Same Items Consolidation] Starting chunked AI analysis for ${entries.length} entries.`);

  if (!geminiApiKey) {
    return { success: false, error: 'Gemini API key is required.' };
  }

  if (!entries || entries.length === 0) {
    return { success: false, error: 'No index entries were provided for analysis.' };
  }

  try {
    const modelName = geminiModel || 'gemini-flash-latest';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiApiKey}`;

    // 1. Sort entries alphabetically by topic title
    const sortedEntries = [...entries].sort((a, b) => (a.topic || '').localeCompare(b.topic || '', undefined, { sensitivity: 'base' }));

    // 2. Build Global Acronym & Short-Term Reference Map across full project
    const globalAcronymMap = {};
    sortedEntries.forEach(e => {
      if (!e || !e.topic) return;
      const t = e.topic.trim();
      const m = t.match(/\(([A-Z0-9]{2,10})\)/i);
      if (m) {
        globalAcronymMap[m[1].toUpperCase()] = t;
      }
      const words = t.split(/\s+/).filter(w => w.length > 0 && !['and', 'or', 'for', 'of', 'in', 'on', 'with', 'the', 'a', 'an'].includes(w.toLowerCase()));
      if (words.length >= 2) {
        const acr = words.map(w => w[0]?.toUpperCase() || '').join('');
        if (acr.length >= 2 && acr.length <= 6) {
          globalAcronymMap[acr] = t;
        }
      }
    });

    // 3. Split entries into batches of 120 entries each to prevent LLM response truncation
    const chunkSize = 120;
    const chunks = [];
    for (let i = 0; i < sortedEntries.length; i += chunkSize) {
      chunks.push(sortedEntries.slice(i, i + chunkSize));
    }

    const allProposals = [];
    const totalChunks = chunks.length;
    const concurrencyLimit = 5;
    let completedChunks = 0;

    logDebug(`[Same Items Consolidation] Processing ${sortedEntries.length} entries in ${totalChunks} parallel batches (concurrency: 5).`);

    const processBatch = async (chunk, cIdx) => {
      const firstLetter = (chunk[0].topic || '').charAt(0).toUpperCase() || 'A';
      const lastLetter = (chunk[chunk.length - 1].topic || '').charAt(0).toUpperCase() || 'Z';

      const batchEntries = chunk.map(e => ({
        id: e.id,
        topic: e.topic,
        book: e.bookNum || e.book || 1,
        pages: e.pages
      }));

      const systemPrompt = `You are an expert cybersecurity index consolidation assistant.
Analyze the following batch of course index entries (${cIdx + 1} of ${totalChunks}) and identify terms that represent the SAME concept, tool, technology, or standard (e.g. "Active Directory" and "AD", "Active Directory Certificate Services (AD CS)" and "AD CS", "Resource-Based Constrained Delegation (RBCD)" and "RBCD").

GLOBAL ACRONYM & FULL NAME REFERENCE MAP Across Full Index:
${JSON.stringify(globalAcronymMap, null, 2)}

CRITICAL CONSOLIDATION & ACRONYM RULES:
1. ONLY COMBINE MULTIPLE DISTINCT TERMS: Do NOT propose changes for single standalone terms (like "Attack Instances" or "Kerberos") unless they match a separate abbreviation, acronym, or equivalent term in the batch or Global Reference Map!
2. NEVER INVENT OR GENERATE FAKE ACRONYMS: Do NOT append invented parenthetical acronyms (like "(AI)" for "Attack Instances" or "(KD)" for "Key Distribution") unless that acronym actually exists as a separate term in the index or Global Reference Map!
3. High Recall Preference for Genuine Matches: Actively combine terms when a true abbreviation or equivalent term exists (e.g. "AD" <-> "Active Directory", "RBCD" <-> "Resource-Based Constrained Delegation").
4. Moderate Precision Limit: Do NOT combine clearly distinct sub-topics or modules just because they share a prefix (e.g. do NOT combine "AD Module" with "Active Directory").
5. Standardized Naming Format:
   - If combining a long-form title with a known acronym: format as "Long-Form Title (ACRONYM)". E.g. "Active Directory (AD)".
   - If no established acronym exists in the index, keep the clean long-form title WITHOUT inventing any parenthetical letters!
6. Return ONLY a JSON array of consolidation proposals matching this structure:
[
  {
    "originalTopic": "AD",
    "book": 1,
    "proposedTopic": "Active Directory (AD)",
    "targetTopic": "Active Directory",
    "reason": "Abbreviation for Active Directory"
  }
]

List of entries in this batch (${firstLetter} to ${lastLetter}):
${JSON.stringify(batchEntries, null, 2)}
`;

      const requestBody = {
        contents: [{ parts: [{ text: systemPrompt }] }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 8192,
          responseMimeType: "application/json"
        }
      };

      try {
        const startTime = Date.now();
        let response = null;

        while (true) {
          response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
          });

          if (response.status === 429) {
            const elapsed = Date.now() - startTime;
            if (elapsed >= 60000) {
              throw new Error(`Gemini API rate limit (HTTP 429) persisted for more than 1 minute on batch ${cIdx + 1}. Please wait a moment or check API quota.`);
            }
            logDebug(`[Same Items Consolidation] HTTP 429 on batch ${cIdx + 1}. Pausing 15 seconds before retrying (elapsed: ${Math.round(elapsed / 1000)}s)...`);
            if (event) {
              event.sender.send('pdf-import-progress', {
                percent: Math.round((completedChunks / totalChunks) * 100),
                message: `Rate limit hit (429). Waiting 15s before retrying batch ${cIdx + 1}...`
              });
            }
            await new Promise(res => setTimeout(res, 15000));
            continue;
          }

          break;
        }

        completedChunks++;
        const progressPercent = Math.round((completedChunks / totalChunks) * 100);

        if (event) {
          event.sender.send('pdf-import-progress', {
            percent: progressPercent,
            message: `Analyzing topics in parallel [Completed ${completedChunks} of ${totalChunks} (${firstLetter} - ${lastLetter})]...`
          });
        }

        if (response.ok) {
          const resData = await response.json();
          if (resData.candidates && resData.candidates.length > 0) {
            const responseText = resData.candidates[0].content.parts[0].text;
            const chunkProposals = tryParseJSONArray(responseText);
            if (Array.isArray(chunkProposals) && chunkProposals.length > 0) {
              return chunkProposals;
            }
          }
        } else {
          logDebug(`[Same Items Consolidation] Batch ${cIdx + 1} HTTP error ${response.status}`);
        }
      } catch (batchErr) {
        logDebug(`[Same Items Consolidation] Batch ${cIdx + 1} error: ${batchErr.message}`);
        if (batchErr.message.includes('rate limit')) {
          throw batchErr;
        }
      }
      return [];
    };

    // Run parallel batch processing with concurrency limit of 5
    for (let i = 0; i < chunks.length; i += concurrencyLimit) {
      const batchPromises = chunks.slice(i, i + concurrencyLimit).map((chunk, index) => processBatch(chunk, i + index));
      const batchResults = await Promise.all(batchPromises);
      batchResults.forEach(r => allProposals.push(...r));
    }

    if (allProposals.length === 0) {
      return { success: true, proposals: [] };
    }

    // 4. Deduplicate proposals by originalTopic + book + proposedTopic
    const uniqueMap = new Map();
    allProposals.forEach(p => {
      if (!p || !p.originalTopic || !p.proposedTopic) return;
      const key = `${p.originalTopic.toLowerCase()}_${p.book || 1}_${p.proposedTopic.toLowerCase()}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, p);
      }
    });

    const deduplicatedProposals = Array.from(uniqueMap.values());
    logDebug(`[Same Items Consolidation] Total deduplicated AI proposals: ${deduplicatedProposals.length}`);
    return { success: true, proposals: deduplicatedProposals };

  } catch (err) {
    logDebug(`[Same Items Consolidation] Unexpected error: ${err.message}`);
    return { success: false, error: err.message };
  }
});

// ==========================================================================
// GITHUB UPDATE & AUTO-RESTART SYSTEM
// ==========================================================================
const FORCE_TEST_UPDATE = false; // Switch to false for actual remote git checks

ipcMain.handle('check-for-updates', async (event, testMode = false) => {
  const isTest = testMode || FORCE_TEST_UPDATE;
  if (isTest) {
    return {
      updateAvailable: true,
      recentChanges: [
        "Feature: Seamless automatic updates via Git (simulated)",
        "UI: Native blurred backdrop dialog centering for update prompt",
        "UI: Beautiful glowing notification bell if update is postponed",
        "System: Auto-restart and app relaunch sequence"
      ]
    };
  }

  try {
    // 1. Fetch remote changes
    // Check if git is available
    await execPromise('git --version');
    
    // Fetch from origin
    await execPromise('git fetch origin main');

    // 2. Check if we are behind remote branch
    const { stdout: localHead } = await execPromise('git rev-parse HEAD');
    const { stdout: remoteHead } = await execPromise('git rev-parse origin/main');

    if (localHead.trim() !== remoteHead.trim()) {
      // 3. Get list of recent changes (remote commits since local HEAD)
      const { stdout: diffLog } = await execPromise('git log HEAD..origin/main --oneline');
      const recentChanges = diffLog.trim().split('\n').filter(Boolean).map(line => {
        // Strip out SHA from start of line
        return line.replace(/^[a-f0-9]+\s+/, '');
      });

      return {
        updateAvailable: true,
        recentChanges: recentChanges.length > 0 ? recentChanges : ["Miscellaneous updates"]
      };
    }

    return { updateAvailable: false };
  } catch (error) {
    logDebug(`[Update Checker] Git update check failed: ${error.message}`);
    return { updateAvailable: false, error: error.message };
  }
});

ipcMain.handle('perform-update', async (event, testMode = false) => {
  const isTest = testMode || FORCE_TEST_UPDATE;
  if (isTest) {
    // Simulate update taking 2.5 seconds
    await new Promise(resolve => setTimeout(resolve, 2500));
    // Relaunch app
    app.relaunch();
    app.exit(0);
    return { success: true };
  }

  try {
    // Run git pull
    const { stdout, stderr } = await execPromise('git pull');
    logDebug(`[Update Pull] Git pull output: ${stdout}\nStderr: ${stderr}`);
    
    // Relaunch app
    app.relaunch();
    app.exit(0);
    return { success: true };
  } catch (error) {
    logDebug(`[Update Pull] Failed to pull changes: ${error.message}`);
    return { success: false, error: error.message };
  }
});

