const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { validateUserName } = require('./validateInput')


let win = null;
function createWindow() {
  win = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.webContents.openDevTools();
  win.loadFile('./views/login/index.html');


  ipcMain.on('accept-login-message', async (event, user) => {
    if (user.rule) {
      win.loadFile('./views/quizManagement/score.html');
      console.log(user)
      event.reply('send-session', { userName: user.userName, rule: user.rule, id: user._id });
    } else {
      win.loadFile('./views/testUi/test.html');
    }
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})


ipcMain.on('open-Students', (event, session) => {
  if (session.rule == 1) {
    win.loadFile('./views/quizManagement/score.html')
  } else {
    return;
  }
})
ipcMain.on('open-Quizzes', (event, session) => {
  if (session.rule == 1) {
    win.loadFile('./views/quizManagement/quiz.html')
  } else {
    return;
  }
})
ipcMain.on('user-Logout', () => {
  win.loadFile('./views/login/index.html');
})