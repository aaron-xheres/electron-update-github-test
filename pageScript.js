const btnCheckUpdate = document.getElementById('check-update');
const btnCheckUpdateNotify = document.getElementById('check-update-notify');
const btnStartUpdate = document.getElementById('start-update');
const spanVersion = document.getElementById('version');
const spanUpdateVersion = document.getElementById('update-version');
const spanUpdateDownloadProgress = document.getElementById('update-download-progress');

const STR_VERSION_PREFIX = 'Current Version: ';
const STR_UPDATE_STATUS_PREFIX = 'Update Version: ';

let currentVersion;
// Get Current Version
(async () => {
  currentVersion = await window.updater.getCurrentVersion();
  spanVersion.textContent = STR_VERSION_PREFIX + currentVersion;
})();
// --------

btnCheckUpdate.onclick = async () => {
  btnCheckUpdate.disabled = true;
  btnCheckUpdateNotify.disabled = true;
  const updateVersion = await window.updater.checkUpdate();
  if (updateVersion && updateVersion !== currentVersion) {
    btnStartUpdate.disabled = false;
    spanUpdateVersion.textContent = STR_UPDATE_STATUS_PREFIX + updateVersion;
  }

  btnCheckUpdate.disabled = false;
  btnCheckUpdateNotify.disabled = false;
};

btnCheckUpdate.onclick = async () => {
  btnCheckUpdate.disabled = true;
  const updateVersion = await window.updater.checkUpdate(true);
  if (updateVersion && updateVersion !== currentVersion) {
    btnStartUpdate.disabled = false;
    spanUpdateVersion.textContent = STR_UPDATE_STATUS_PREFIX + updateVersion;
  }

  btnCheckUpdate.disabled = false;
};


btnStartUpdate.onclick = () => {
  window.updater.startUpdate();
};

// Preload Listener
window.addEventListener('message', (e) => {
  if (e.origin !== location.origin) {
    console.warn('rejected message from non-origin', e.origin);
    return;
  }

  switch (e.data.msg) {
    case 'download-progress': {
      const data = e.data.data;
      console.log('[DOWNLOAD PROGRESS]', data);
      spanUpdateDownloadProgress.textContent = `
        bytesPerSecond: ${data.bytesPerSecond} | 
        downloadProgress: ${data.percent} | 
        total: ${data.total} | 
        transferred: ${data.transferred} | 
      `;
      break;
    }
    default: {
      console.warn('received unhandled message', e.data.msg);
      break;
    }
  }
});
