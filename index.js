const { app, BrowserWindow } = require('electron');
const path = require('path');

let window;
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile('index.html');
  window = win;
};

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});


// ------------------------------
// UPDATER
const { ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');

// Set auto download to false
// If the update is to be auto downloaded, ensure that event handlers
// are ready before calling checkForUpdates
autoUpdater.autoDownload = false;

ipcMain.handle('get-current-version', (e) => {
  return app.getVersion();
});

ipcMain.handle('check-update', async (e, notify) => {
  let checkUpdateStatus;
  if(notify) {
    // Notify using OS notification
    checkUpdateStatus = await autoUpdater.checkForUpdatesAndNotify();
  } else {
    // Just check for update
    checkUpdateStatus = await autoUpdater.checkForUpdates();
  }

  if (!checkUpdateStatus || !checkUpdateStatus.updateInfo) {
    return undefined;
  }

  return checkUpdateStatus.updateInfo.version;
});

ipcMain.handle('start-update', async (e) => {
  // Event fires when downloading update
  autoUpdater.on('download-progress', (info) => {
    if (window) {
      window.webContents.send('download-progress', info);
    }
  });
  // Event fires when update is downloaded
  autoUpdater.on('update-downloaded', (e) => {
    // Quit and Install update after update-downloaded event fires
    autoUpdater.quitAndInstall(true, true);
  });

  // Start downloading update (Auto Download is set to false in this demo)
  autoUpdater.downloadUpdate();
});
