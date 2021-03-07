const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron');
const path = require('path');
const dataurl = require('dataurl');
const fs = require('fs');
const uuid = require('uuid');

let win

function createWindow () {
  win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js")
    },
    fullscreen: false,
    autoHideMenuBar: true,
  });

  const menuTemplate = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open File',
          accelerator: 'CmdOrCtrl+O',
          click() {
            dialog.showOpenDialog({
              properties: ['openFile']
            })
            .then(function(fileObj) {
              if (!fileObj.filePaths.length) {
                console.error('no files selected');
                return;
              }
              const filePath = fileObj.filePaths[0];
              try {
                if (fs.existsSync(filePath)) {
                  fs.readFile(filePath, (error, data) => {
                    const dataUrl = dataurl.convert({ data, mimetype: 'audio/mp3' })
                    win.webContents.send('data-url', dataUrl);
                  })
                } else {
                  console.error('file not found');
                }
              } catch (err) {
                console.error(err);
              }
            })
            .catch(function(err) {
              console.error(err);
           })
          } 
        },
        {
          label: 'Open Folder',
          accelerator: 'CmdOrCtrl+Shift+O',
          click() {
            dialog.showOpenDialog({
              properties: ['openDirectory']
            })
            .then(function(dirObj) {
              if (!dirObj.filePaths.length) {
                return
              }
              const dirPath = dirObj.filePaths[0]
              fs.readdir(dirPath, (err, fileNames) => {
                if (err) {
                  dialog.showMessageBox({
                    message: err,
                    type: 'error'
                  });

                  return;
                }
                
                const mediaFilePaths = fileNames
                  .filter(fileName => {
                    return fileName.match(/.*\.mp3$/)
                  })
                  .map(fileName => {
                    return {
                      id: uuid.v1(),
                      name: fileName,
                      path: `${dirPath}\\${fileName}`
                    };
                  });

                win.webContents.send('media-directory', mediaFilePaths);
              })
            })
            .catch(function(err) {
              console.error(err)  
           })
          } 
        },
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
      ]
    }
  ]
  
  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)

  // development
  win.loadURL('http://localhost:8080/')

  // prod
  // win.loadFile('dist/index.html')
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

ipcMain.on('select-file', (event, filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.readFile(filePath, (error, data) => {
        const dataUrl = dataurl.convert({ data, mimetype: 'audio/mp3' })
        win.webContents.send('data-url', dataUrl);
      })
    } else {
      alert('file not found')
    }
  } catch (err) {
    console.error(err)
  }
});