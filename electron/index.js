const { app } = require('electron');
const {createWindow} = require('./main');

// require('electron-reload')(__dirname);
contextIsolation = true;
// app.whenReady().then(createWindow)

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});