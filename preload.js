const { ipcRenderer, contextBridge } = require('electron');

const getCurrentVersion = async () => {
  const currentVersion = await ipcRenderer.invoke('get-current-version');
  return currentVersion;
};

const checkUpdate = async (notify = false) => {
  const checkUpdateVersion = await ipcRenderer.invoke('check-update', notify);
  return checkUpdateVersion;
};

const startUpdate = async () => {
  console.log('[START UPDATE]');
  ipcRenderer.invoke('start-update');
  ipcRenderer.on('download-progress', (e, downloadProgress) => {
    window.postMessage(
      {
        msg: 'download-progress',
        data: downloadProgress,
      },
      location.href
    );
  });
};

contextBridge.exposeInMainWorld('updater', {
  getCurrentVersion,
  checkUpdate,
  startUpdate,
});
