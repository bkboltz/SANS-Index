const { app, BrowserWindow, ipcMain, dialog, Menu, MenuItem, shell, net } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec, spawn, execSync } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

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

// Helper to resolve QPDF path on Windows
function resolveQpdfPath() {
  if (process.platform !== 'win32') return 'qpdf';
  
  try {
    execSync('qpdf --version', { stdio: 'ignore' });
    return 'qpdf';
  } catch (e) {
    // Ignore
  }

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

  return 'qpdf';
}

// Helper to resolve pdftotext path on Windows
function resolvePdftotextPath() {
  if (process.platform !== 'win32') return 'pdftotext';

  try {
    execSync('pdftotext -v', { stdio: 'ignore' });
    return 'pdftotext';
  } catch (e) {
    // Ignore
  }

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

  return 'pdftotext';
}

// IPC Handler: Check Auto-Indexing Dependencies
ipcMain.handle('check-dependencies', async () => {
  const python = await checkCommand('python --version');
  const resolvedQpdf = resolveQpdfPath();
  const resolvedPdftotext = resolvePdftotextPath();
  
  const qpdf = resolvedQpdf !== 'qpdf' || await checkCommand('qpdf --version');
  const pdftotext = resolvedPdftotext !== 'pdftotext' || await checkCommand('pdftotext -v');
  
  const venvPath = path.join(__dirname, 'engine', '.venv');
  const venvExists = fs.existsSync(venvPath);
  
  let ocr = false;
  if (python) {
    ocr = await new Promise((resolve) => {
      exec('python -c "import doctr, torch; print(\'ok\')"', (error, stdout) => {
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
      exec(`"${venvPython}" -c "import doctr, torch; print(\'ok\')"`, (error, stdout) => {
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
  return new Promise((resolve, reject) => {
    const engineDir = path.join(__dirname, 'engine');
    const venvPath = path.join(engineDir, '.venv');
    
    event.sender.send('ocr-install-status', 'Creating virtual environment (engine/.venv)...');
    
    const venvSpawn = spawn('python', ['-m', 'venv', '.venv'], { cwd: engineDir });
    
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
  return new Promise((resolve, reject) => {
    if (dependencyName === 'ocr') {
      const engineDir = path.join(__dirname, 'engine');
      const venvPath = path.join(engineDir, '.venv');
      
      event.sender.send('dep-install-status', {
        dependency: 'ocr',
        status: 'Creating virtual environment (engine/.venv)...',
        percent: 10
      });
      
      const venvSpawn = spawn('python', ['-m', 'venv', '.venv'], { cwd: engineDir });
      
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
  });
});

// Helper: Curate Index with Gemini AI
async function curateIndexWithGemini(entries, geminiApiKey, event) {
  logDebug(`[Gemini Curation] Initiating with ${entries.length} candidate terms... Key length: ${geminiApiKey ? geminiApiKey.length : 0}`);
  if (event) {
    event.sender.send('auto-index-progress', { step: 'curating', message: 'Running Gemini AI Curation...' });
  }

  const prompt = `You are a SANS Cybersecurity course index curator. Your job is to filter a list of candidate index terms extracted from a SANS textbook.
Review the JSON array of terms below. Filter out noise terms (generic English words, verbs, adjectives, prepositions, numbers, and adverbs on their own). Keep only distinct technical terms, security concepts, tools, protocols, registry paths, specific command line utilities, file names, ports, and important techniques.
Also, if there are minor spelling/capitalization variations of the same term (e.g. "active directory", "Active Directory"), merge them by keeping the capitalized proper noun form and combining their pages into a single comma-separated list of pages (remove duplicates and sort pages in ascending numeric order).

Input list:
${JSON.stringify(entries)}

Return a JSON array of objects with the exact same structure as the input:
[
  { "topic": "...", "pages": "...", "notes": "", "source": "auto" }
]`;

  try {
    logDebug(`[Gemini Curation] Posting to Gemini model API...`);
    const response = await net.fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${geminiApiKey}`, {
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
    logDebug(`[Gemini Curation] Failed to curate with Gemini: ${error.message}\n${error.stack}`);
    if (event) {
      event.sender.send('auto-index-progress', { step: 'warning', message: `AI Curation failed: ${error.message}. Returning raw list...` });
    }
    return { entries: entries, error: error.message };
  }
}

// IPC Handler: Run Auto-Indexing
ipcMain.handle('run-auto-index', async (event, args) => {
  const { pdfPath, password, fname, lname, email, geminiApiKey, settings } = args;
  logDebug(`[Auto-Index Handler] Received args - PDF: ${pdfPath ? 'yes' : 'no'}, Key present: ${!!geminiApiKey}, Key val length: ${geminiApiKey ? geminiApiKey.length : 0}, Watermark info: ${fname}/${lname}/${email}`);
  
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
    const venvPath = path.join(__dirname, 'engine', '.venv');
    const venvExists = fs.existsSync(venvPath);
    const pythonExe = venvExists
      ? (process.platform === 'win32' ? path.join(venvPath, 'Scripts', 'python.exe') : path.join(venvPath, 'bin', 'python'))
      : 'python';
      
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
    if (geminiApiKey && entries.length > 0) {
      const curationResult = await curateIndexWithGemini(entries, geminiApiKey, event);
      finalEntries = curationResult.entries;
      curationError = curationResult.error;
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
    
    return { success: true, entries: finalEntries, curationError };
    
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
