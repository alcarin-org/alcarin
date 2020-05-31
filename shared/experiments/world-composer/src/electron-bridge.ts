import electronDefault from 'electron';

type Electron = typeof electronDefault;

// we need to get electron instance from window, as we set in on "preload.ts"
// script. the reason is that the create react app default webpack config is
// do not cooperate with the electron "node" mode. so we use this small bridge,
// to not use window anywhere when it's not necessery.

const electron = (window as any).__electron as Electron;

if (electron === undefined) {
    console.warn(
        'The app is designed to run inside Electron environment. Please check the README.md file.'
    );
}

// we only exporting components necessery in renderer process
export const { ipcRenderer } = electron;
