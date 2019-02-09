const { ipcRenderer } = require('electron-ipc-mock')();

window.__electron = {
    ipcRenderer,
};
