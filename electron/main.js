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
  mainWindow.webContents.setMaxListeners(1);
  mainWindow.on('closed', () => mainWindow = null);

}

/**
  * 
  * EVENTOS MANEJO DE ARCHIVOS DEL SISTEMA
  * 
  */

ipcMain.on("fileConf/read_update", async (event, args) => {
  fs.readFile('bdd.conf.json', 'utf8', (error, data) => {
    if (error) throw error;
    mainWindow.webContents.send("read_update", data);
  });

});

ipcMain.on("fileConf/update", async (event, args) => {
  fs.writeFile('bdd.conf.json', args.data, function (err) {
    if (err) throw err;
    mainWindow.webContents.send("update", args.data );
    console.log('******************************', 'Archivo  actualizado!', '******************************');
  })

});

/**
  * 
  * EVENTOS CONSULTAS API
  * 
  */

ipcMain.on("Api/listaBDD", async (event, args) => {
  console.log(args);
  let response = await consultas.listaBDD();
  mainWindow.webContents.send("listaBDD", response);
});

ipcMain.on("Api/usuariosDataBase", async (event, args) => {
  let response = await consultas.usuariosDataBase();
  mainWindow.webContents.send("usuariosDataBase", response);
});

ipcMain.on("Api/tablasDatabase", async (event, args) => {
  let response = await consultas.tablasDatabase(args.namedb);
  mainWindow.webContents.send("tablasDatabase", response);
});

ipcMain.on("Api/informacionTabla", async (event, args) => {
  let response = await consultas.informacionTabla(args.namedb);
  mainWindow.webContents.send("informacionTabla", response);
});

ipcMain.on("Api/getfuncionesModulos", async (event, args) => {
  let response = await consultas.getfuncionesModulos(args.namedb);
  mainWindow.webContents.send("getfuncionesModulos", response);
});

ipcMain.on("Api/putfuncionesModulos", async (event, args) => {
  let response = await consultas.putfuncionesModulos(args.namedb, args.data);
  mainWindow.webContents.send("putfuncionesModulos", response);
});

ipcMain.on("Api/getUsersApp", async (event, args) => {
  let response = await consultas.getUsersApp(args.namedb);
  mainWindow.webContents.send("getUsersApp", response);
});

ipcMain.on("Api/jsonDataEmpresa", async (event, args) => {
  let response = await consultas.jsonDataEmpresa(args.namedb);
  mainWindow.webContents.send("jsonDataEmpresa", response);
});

ipcMain.on("Api/putUserApp", async (event, args) => {
  let response = await consultas.putUserApp(args.namedb, args.data);
  mainWindow.webContents.send("putUserApp", response);
});

ipcMain.on("Api/getLicencias", async (event, args) => {
  console.log(args);
  let response = await consultas.getLicencias();
  mainWindow.webContents.send("getLicencias", response);
});

ipcMain.on("Api/obtenerLicencia", async (event, args) => {
  console.log(args);
  let response = await consultas.obtenerLicencia(args.namedb);
  mainWindow.webContents.send("obtenerLicencia", response);
});

ipcMain.on("Api/createLicencia", async (event, args) => {
  console.log(args);
  let response = await consultas.createLicencia(args.data);
  mainWindow.webContents.send("createLicencia", response);
});

// ipcMain.on("Api/", async (event, args) => {
//   console.log(args);
// });


module.exports = {
  createWindow
}