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
      exec(`"${venvPython}" -c "import pdfminer, nltk, wordfreq; print('ok')"`, (err, stdout) => {
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

// Helper: Curate Index with Gemini AI
async function curateIndexWithGemini(entries, geminiApiKey, event, geminiModel) {
  logDebug(`[Gemini Curation] Initiating with ${entries.length} candidate terms... Model: ${geminiModel || 'gemini-flash-latest'}, Key length: ${geminiApiKey ? geminiApiKey.length : 0}`);

  const prompt = `You are a SANS Cybersecurity course index curator. Your job is to filter a list of candidate index terms extracted from a SANS textbook.
Review the JSON array of terms below. Filter out noise terms (generic English words, verbs, adjectives, prepositions, numbers, and adverbs on their own). Keep only distinct technical terms, security concepts, tools, protocols, registry paths, specific command line utilities, file names, ports, and important techniques.
Also, if there are minor spelling/capitalization variations of the same term (e.g. "active directory", "Active Directory"), merge them by keeping the capitalized proper noun form and combining their pages into a single comma-separated list of pages (remove duplicates and sort pages in ascending numeric order).

Input list:
${JSON.stringify(entries)}

Return a JSON array of objects with the exact same structure as the input:
[
  { "topic": "...", "pages": "...", "notes": "", "source": "auto" }
]`;

  const maxAttempts = 5;
  let attempt = 0;

  while (attempt < maxAttempts) {
    attempt++;
    logDebug(`[Gemini Curation] Attempt ${attempt}/${maxAttempts}...`);

    if (event) {
      event.sender.send('auto-index-progress', { 
        step: 'curating', 
        attempt: attempt, 
        maxAttempts: maxAttempts,
        isOverloaded: attempt > 1
      });
    }

    try {
      logDebug(`[Gemini Curation] Posting to Gemini model API...`);
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
        logDebug(`[Gemini Curation] API returned error: ${response.status} - ${errorText}`);
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
        logDebug(`[Gemini Curation] API returned empty candidates array`);
        throw new Error('Gemini API returned empty response candidates.');
      }

      const responseText = resData.candidates[0].content.parts[0].text;
      logDebug(`[Gemini Curation] Received content response text length: ${responseText ? responseText.length : 0}`);
      const curatedEntries = JSON.parse(responseText);

      if (Array.isArray(curatedEntries)) {
        logDebug(`[Gemini Curation] Curation successful! Returned ${curatedEntries.length} curated terms.`);
        return { entries: curatedEntries, error: null };
      } else if (curatedEntries && Array.isArray(curatedEntries.filtered_terms)) {
        logDebug(`[Gemini Curation] Curation successful (filtered_terms)! Returned ${curatedEntries.filtered_terms.length} curated terms.`);
        return { entries: curatedEntries.filtered_terms, error: null };
      } else {
        logDebug(`[Gemini Curation] Warning: Unexpected Gemini JSON structure: ${JSON.stringify(curatedEntries).substring(0, 200)}`);
        return { entries: entries, error: "Unexpected JSON structure returned from AI." };
      }

    } catch (error) {
      logDebug(`[Gemini Curation] Attempt ${attempt} failed: ${error.message}`);
      
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
        logDebug(`[Gemini Curation] High demand detected. Waiting ${waitTimeSeconds} seconds before retrying (Attempt ${attempt + 1}/${maxAttempts})...`);
        
        for (let remaining = waitTimeSeconds; remaining > 0; remaining--) {
          if (event) {
            event.sender.send('auto-index-progress', { 
              step: 'curating', 
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
        finalErrorMessage = "We couldn't query Gemini at this time, try again later when there is less traffic.";
      }

      if (event) {
        event.sender.send('auto-index-progress', { step: 'warning', message: `AI Curation failed: ${finalErrorMessage}. Returning raw list...` });
      }
      return { entries: entries, error: finalErrorMessage };
    }
  }
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
        const curationResult = await curateIndexWithGemini(entries, geminiApiKey, event, geminiModel);
        finalEntries = curationResult.entries;
        curationError = curationResult.error;
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
    
    return { success: true, entries: finalEntries, curationError, quizQuestions, quizError, quizGenerated };
    
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
