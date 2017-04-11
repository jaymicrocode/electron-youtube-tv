'use strict';

const TITLE = 'Youtube TV';

const electron = require('electron');
const AutoLaunch = require('auto-launch');
const urlChecker = require('./libs/urlChecker');
const tray = require('./controllers/tray');
const { app, BrowserWindow, webContents, dialog } = electron;

const startMinimized = process.argv.indexOf('--hidden') !== -1;

const ytAutoLauncher = new AutoLaunch({
  name: TITLE,
  isHidden: true, // This adds a --hidden flag, which we use to start the app minimized
});

function askStartup() {
  dialog.showMessageBox({
    type: 'question',
    buttons: ['Launch on startup', 'Do not launch on startup'],
    title: 'Launch YouTube TV on Windows startup',
    message: 'Do you want to launch Youtube TV on Windows startup? It will be minimized and automatically opens when you cast to it.',
  }, (buttonIndex) => {
    if (buttonIndex === 0) {
      ytAutoLauncher.enable();
    }
  });
}

app.on('ready', function() {
  ytAutoLauncher.isEnabled().then((startup) => {
    if (!startup) {
      askStartup();
    }
  });
  var mainWindow = new BrowserWindow({
    title: TITLE,
    fullscreen: !startMinimized,
    icon: __dirname + '/favicon.ico',
    show: !startMinimized
  });
  mainWindow.setMenu(null);
  tray.init(mainWindow);

  mainWindow.webContents.on('did-navigate-in-page', (event, url, isMainFrame) => {
    urlChecker.init(url);

    if (urlChecker.includePath('control')) {
      mainWindow.minimize();
      mainWindow.focus();
      mainWindow.maximize();
      mainWindow.setFullScreen(true);
    }
  });

  mainWindow.on('close', (e) => {
    e.preventDefault();
    mainWindow.hide();
    mainWindow.setSkipTaskbar(true);
  });

  mainWindow.loadURL('https://www.youtube.com/tv');

});
