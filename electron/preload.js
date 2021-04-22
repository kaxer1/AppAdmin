const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
  'api',
  {
    send: (channel, data) => {
      ipcRenderer.send(channel, data);
    },
    receive: (channel, func) => {
      const arrayFunciones = ipcRenderer.rawListeners(channel);
      // console.log(arrayFunciones);
      ipcRenderer.on(channel, (event, args) => func(args));
      if (arrayFunciones.length > 0) {
        ipcRenderer.removeListener(channel, ...arrayFunciones)
      }
    }
  }
)

