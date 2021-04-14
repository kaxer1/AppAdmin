const { BrowserWindow, ipcMain } = require('electron');
const consultas = require('./utils/consultas');
const fs = require('fs');

const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200, 
    height: 900,
    webPreferences: {
      contextIsolation: true,
      enableRemoteModule: true,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  // mainWindow.loadFile(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  if (isDev) {
    // Open the DevTools.
    //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    mainWindow.webContents.openDevTools();
    // mainWindow.webContents.send();
  }
  mainWindow.on('closed', () => mainWindow = null);
}

ipcMain.on("ArchivoConf", async (event, args) => {
  console.log(args);
  const {accion , data} = args.data
  let response;
  switch (accion) {

    case 'read_update':
      fs.readFile('bdd.conf.json', 'utf8', (error, data) => {
        if(error) throw error;
        mainWindow.webContents.send("read_update", data);
      });
      break;

    case 'update':
      console.log(data);
      fs.writeFile('bdd.conf.json', data, function (err) {
        if (err) throw err;
        mainWindow.webContents.send("update", data);
        console.log('******************************', 'Archivo  actualizado!', '******************************');
      })
      break;

    default:
      response = { error: 'Error en la consulta.'}
      mainWindow.webContents.send("error", response);
      break;
  }
  
});

ipcMain.on("ApiResquest", async (event, args) => {
  console.log(args);
  let response;
  switch (args.funcion) {
    case 'listaBDD':
      response = await consultas.listaBDD();
      mainWindow.webContents.send("listaBDD", response);
      break;
    case 'usuariosDataBase':
      response = await consultas.usuariosDataBase();
      mainWindow.webContents.send("usuariosDataBase", response);
      break;
    case 'tablasDatabase':
      response = await consultas.tablasDatabase(args.namedb);
      mainWindow.webContents.send("tablasDatabase", response);
      break;
    default:
      response = { error: 'Error en la consulta.'}
      mainWindow.webContents.send("error", response);
      break;
  }
});


module.exports = {
  createWindow
}