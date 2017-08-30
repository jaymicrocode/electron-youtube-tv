'use strict';

const TITLE = 'Youtube TV';

const electron = require('electron');
const { app, BrowserWindow, webContents } = electron;

let mainWindow = null;

const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    mainWindow.show();
  }
});

if (shouldQuit) {
  app.quit();
}

app.on('ready', function() {
  mainWindow = new BrowserWindow({
    title: TITLE,
    fullscreen: true,
    icon: __dirname + '/favicon.ico',
  });
  mainWindow.setMenu(null);
  mainWindow.setFullScreen(true);
  // mainWindow.setIgnoreMouseEvents(true);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.loadURL('https://www.youtube.com/tv');
  mainWindow.webContents.on('did-finish-load', function() {
    mainWindow.webContents.insertCSS('body { cursor: none !important; pointer-events: none !important; }');
  });

});

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
      app.quit();
  }
});