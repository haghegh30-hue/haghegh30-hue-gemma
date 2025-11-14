const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const Store = require('electron-store');
const { glob } = require('glob');

const store = new Store();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

const createSettingsWindow = () => {
  const settingsWindow = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      preload: SETTINGS_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  settingsWindow.loadURL(SETTINGS_WINDOW_WEBPACK_ENTRY);

  settingsWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on('open-settings', () => {
  createSettingsWindow();
});

ipcMain.on('save-settings', (event, settings) => {
  store.set(settings);
});

ipcMain.handle('get-settings', async () => {
  return store.get();
});

ipcMain.on('send-prompt', async (event, prompt) => {
  const settings = store.get();
  const provider = settings.provider || 'ollama';
  const model = settings.model || 'llama2';
  const apiUrl = settings.apiUrl || (provider === 'ollama' ? 'http://localhost:11434/api/generate' : 'http://localhost:1234/v1/chat/completions');

  let payload;
  if (provider === 'ollama') {
    payload = {
      model: model,
      prompt: prompt,
      stream: false,
    };
  } else { // LM Studio
    payload = {
      model: model,
      messages: [{ role: 'user', content: prompt }],
      stream: false,
    };
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    let content = '';
    if (provider === 'ollama') {
      content = data.response;
    } else { // Assuming LM Studio-like API
      content = data.choices[0].message.content;
    }

    event.sender.send('response', content);
  } catch (error) {
    event.sender.send('response', `Error: ${error.message}`);
  }
});

ipcMain.handle('search-files', async (event, query) => {
  const homeDir = app.getPath('home');
  const files = await glob(`**/*${query}*`, { cwd: homeDir });
  return files;
});
