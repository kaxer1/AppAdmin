const { BrowserWindow, ipcMain } = require('electron');
const consultas = require('./utils/consultas');
const migracion2_7 = require('./migracionFulltime2_7/index');
const dataflex = require('./migracionDataflex/index');
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

ipcMain.on("Api/putlicenciaEmpresa", async (event, args) => {
  console.log(args);
  let response = await consultas.putlicenciaEmpresa(args.namedb, args.public_key);
  mainWindow.webContents.send("putlicenciaEmpresa", response);
});

ipcMain.on("Api/getAccessWebEmploy", async (event, args) => {
  console.log(args);
  let response = await consultas.getAccessWebEmploy(args.namedb);
  mainWindow.webContents.send("getAccessWebEmploy", response);
});

ipcMain.on("Api/putAccessWebEmploy", async (event, args) => {
  console.log(args);
  let response = await consultas.putAccessWebEmploy(args.namedb, args.data);
  mainWindow.webContents.send("putAccessWebEmploy", response);
});

ipcMain.on("Api/fileUpload", async (event, args) => {
  let response = await consultas.fileUpload(args);
  mainWindow.webContents.send("fileUpload", response);
});

// ipcMain.on("Api/", async (event, args) => {
//   console.log(args);
// });

/*****************************************************************
 * 
 *      METODOS DE MIGRACION FULLTIME 2.7 A FULLTIME V3
 * 
 *****************************************************************/
ipcMain.on("Api/CrearConexionClienteFulltime27", async (event, args) => {
  let response = await migracion2_7.CrearConexionClienteFulltime27(args.data)
  mainWindow.webContents.send("CrearConexionClienteFulltime27", response);
});

ipcMain.on("Api/CrearConexionFulltime3", async (event, args) => {
  let response = await migracion2_7.CrearConexionFulltime3(args.data)
  mainWindow.webContents.send("CrearConexionFulltime3", response);
});

ipcMain.on("Api/migracionFT3__FT2_7", async (event, args) => {
  let response = await migracion2_7.main(args.fulltime3, args.fulltime2_7);
  mainWindow.webContents.send("migracionFT3__FT2_7", response);
});

ipcMain.on("Api/migracionFT3__FT2_7_Timbre", async (event, args) => {
  let response = await migracion2_7.insertarTimbres(args.fulltime3, args.fulltime2_7);
  mainWindow.webContents.send("migracionFT3__FT2_7_Timbre", response);
});

/*****************************************************************
 * 
 *      METODOS DE MIGRACION DATAFLEX A FULLTIME V3
 * 
 *****************************************************************/
ipcMain.on("Api/import/Empleados", async (event, args) => {
  let response = await dataflex.empleados(args);
  mainWindow.webContents.send("import/Empleados", response);
});

ipcMain.on("Api/import/Departamentos", async (event, args) => {
  let response = await dataflex.departamentos(args);
  mainWindow.webContents.send("import/Departamentos", response);
});

ipcMain.on("Api/import/Cargos", async (event, args) => {
  let response = await dataflex.cargos(args);
  mainWindow.webContents.send("import/Cargos", response);
});

ipcMain.on("Api/import/Timbres", async (event, args) => {
  let response = await dataflex.timbres(args);
  mainWindow.webContents.send("import/Timbres", response);
});

ipcMain.on("Api/import/Empresa", async (event, args) => {
  let response = await dataflex.empresa(args);
  mainWindow.webContents.send("import/Empresa", response);
});

ipcMain.on("Api/import/Sucursal", async (event, args) => {
  let response = await dataflex.sucursal(args);
  mainWindow.webContents.send("import/Sucursal", response);
});


module.exports = {
  createWindow
}