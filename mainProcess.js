const { app, BrowserWindow, ipcMain, dialog, ipcRenderer } = require('electron')
const { validateUserName } = require('./validateInput')
const fetch = require('node-fetch');


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

ipcMain.on('students-fetching', async (event) => {
  const students = await fetch('http://localhost:3000/allStudent', { method: 'GET' });
  const studentsJson = await students.json();

  event.reply('students-json', studentsJson)
})

ipcMain.on('get-all-quizzes', async (event, object) => {
  await fetch(`http://localhost:3000/getAllQuizzes/`, {
    method: 'POST',
    body: JSON.stringify(object),
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }).then((res) => {
    return res.json();
  }).then((quizzesJson) => {
    event.reply('quizzes-json', quizzesJson)
  }).catch(() =>
    console.log('fetch fail...!')
  )
})

ipcMain.on('get-subjects', async (event) => {
  const subjects = await fetch('http://localhost:3000/getSubjects/', { method: 'GET' });
  const subjectsJson = await subjects.json();
  event.reply('subjects-json', subjectsJson)
})

let addFrame = null;
ipcMain.on('open-new-window', (_, isAdd) => {
  win.hide();
  addFrame = new BrowserWindow({
    parent: win,
    height: 400,
    width: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });


  addFrame.loadFile('./views/addQuiz/quizDetail.html');
  //addFrame.removeMenu()
  addFrame.webContents.once('dom-ready', () => {
    if (isAdd.isAdd) {
      addFrame.webContents.executeJavaScript(`
        require('./addQuiz.js');
      `)
    } else {
      ipcMain.once('get-quiz-edit', (event) => {
        event.reply('main-send-quiz-edit', { subjectCode: isAdd.subjectCode, quiz: isAdd.quiz })
      });
      addFrame.webContents.executeJavaScript(`
        document.title = 'Edit Quiz';
        require('./editQuiz.js');
      `)
    }
  })

  addFrame.on('close', () => {
    win.show();
  })
})
let sessions = null;

ipcMain.once('send-session', (event, session) => {
  sessions = session;
})

ipcMain.on('get-session', (event) => {
  event.reply('main-send-session', sessions)
})

ipcMain.on('fetch-post-quiz', async (event, quiz) => {
  await fetch(`http://localhost:3000/postQuiz/`, {
    method: 'POST',
    body: JSON.stringify(quiz),
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }).then((res) => {
    return res.json();
  }).then((status) => {
    if (status.status === 200) {
      dialog.showMessageBox({
        buttons: ["Yes", "No"],
        message: "Insert done, Do you really want to quit?"
      }).then((res) => {
        if (!res.response) {
          win.send('update-quiz');
          addFrame.close();
        }
      })
    } else {
      throw new Error();
    }
  }).catch(() =>
    dialog.showMessageBox({
      message: "insert fail, please try again...!"
    })
  )
})


ipcMain.on('fetch-post-edit-quiz', async (event, quiz) => {
  await fetch(`http://localhost:3000/updateQuiz/`, {
    method: 'POST',
    body: JSON.stringify(quiz),
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }).then((res) => {
    return res.json();
  }).then((status) => {
    if (status.status === 200) {
      dialog.showMessageBox({
        buttons: ["Yes", "No"],
        message: "Update done, Do you really want to quit?"
      }).then((res) => {
        if (!res.response) {
          win.send('update-quiz');
          addFrame.close();
        }
      })
    } else {
      throw new Error();
    }
  }).catch(() =>
    dialog.showMessageBox({
      message: "update fail, please try again...!"
    })
  )
})


ipcMain.on('disable-enable-quiz', async (event, payload) => {
  await fetch(`http://localhost:3000/disableQuiz/`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }).then((res) => {
    return res.json();
  }).then((status) => {
    if (status.status === 200) {
      win.send('update-quiz');
    } else {
      throw new Error();
    }
  }).catch(() => { }
  )
})