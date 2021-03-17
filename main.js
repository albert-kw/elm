const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron');
const path = require('path');
const dataurl = require('dataurl');
const fs = require('fs');
const uuid = require('uuid');

const supported_format_type = [ 'mp3', 'flac', 'wav' ];
const supported_format_regex = new RegExp (
    '.*\.('+supported_format_type.join('|')+')$',
    'i'
);


let win;

/*
 * Get properties from a filepath
 * group 1 := filename
 * group 2 := . (dot)
 * group 3 := extension
 */
function getFileProperties(filePath) {
    let file_parts = filePath.match(/(.*)(\.)(.*)$/);

    return {
        name : file_parts[1],
        extension : file_parts[3]
    }
}

function createWindow () {
  win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js")
    },
    fullscreen: false,
    autoHideMenuBar: false,
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
                    let extension
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
                    return fileName.match(supported_format_regex);
                  })
                  .map(fileName => {
                    return {
                      id: uuid.v1(),
                      name: fileName,
                      path: `${dirPath}/${fileName}`
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

        let extension = getFileProperties(filePath).extension

        // match against supported format types
        //let match_format_type = supported_format_types.

        // set that to a variable `ext`, and throw it at the end of mimetype
        let supported_format_mime = `audio/${extension}`

        const dataUrl = dataurl.convert({ data, mimetype: supported_format_mime })
        win.webContents.send('data-url', dataUrl);
      })
    } else {
      alert('file not found')
    }
  } catch (err) {
    console.error(err)
  }
});


ipcMain.on('select-dir', (event, dirPath) => {
  try {

    console.log ("dir path: " + dirPath);
    if (fs.existsSync(dirPath)) {

      fs.readdir(dirPath, (error, fileNames) => {
          if (err) {
              dialog.showMessageBox({
                message: error,
                type: 'error'
              });

              return;
          }

          console.log(fileNames);
          const mediaFilePaths = fileNames

              .filter(fileName => {
                return fileName.match(supported_format_regex);
              })
              .map(fileName => {
                return {
                  id: uuid.v1(),
                  name: fileName,
                  path: `${dirPath}/${fileName}`
                };
              });

          console.log(mediaFilePaths);
          win.webContents.send('media-directory', mediaFilePaths);
          })
    } else {
        alert('directory not found')
    } //end if

  } catch (err) {
    console.error(err)
  }

});
