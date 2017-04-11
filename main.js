'use strict';

const electron = require('electron');
const urlChecker = require('./libs/urlChecker');
const tray = require('./controllers/tray');
const { app, BrowserWindow, webContents } = electron;

const startMinimized = process.argv.indexOf('--hidden') !== -1;

app.on('ready', function() {
  var mainWindow = new BrowserWindow({
    title: 'Youtube TV',
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
