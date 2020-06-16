const { app, BrowserWindow, ipcMain, dialog, ipcRenderer } = require('electron')
const { validateUserName } = require('./validateInput')
const fetch = require('node-fetch');


let win = null;

function createWindow() {
    win = new BrowserWindow({
        height: 400,
        width: 300,
        webPreferences: {
            nodeIntegration: true
        },
        resizable: false
    });

    //win.webContents.openDevTools();
    win.loadFile('./views/login/index.html');
    //win.removeMenu();

    ipcMain.on('accept-login-message', async(event, user) => {
        if (user.rule) {
            win.setResizable(true);
            win.maximize();
            win.loadFile('./views/quizManagement/score.html');
            event.reply('send-session', { userName: user.userName, rule: user.rule, id: user._id });
        } else {
            win.setResizable(true);
            win.setSize(400, 200);
            win.center();
            win.loadFile('./views/testUi/loginCode/testLogin.html');
        }
    })
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', function() {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function() {
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
    win.setSize(300, 400)
    win.setResizable(false)
    win.loadFile('./views/login/index.html');
})

ipcMain.on('students-fetching', async(event) => {
    const students = await fetch('http://localhost:3000/allStudent', { method: 'GET' });
    const studentsJson = await students.json();

    event.reply('students-json', studentsJson)
})

ipcMain.on('get-all-quizzes', async(event, object) => {
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

ipcMain.on('get-subjects', async(event) => {
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

ipcMain.on('fetch-post-quiz', async(event, quiz) => {
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
                win.send('update-quiz');
                if (!res.response) {
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


ipcMain.on('fetch-post-edit-quiz', async(event, quiz) => {
    await fetch(`http://localhost:3000/updateQuiz/`, {
        method: 'PUT',
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
                win.send('update-quiz');
                if (!res.response) {
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


ipcMain.on('disable-enable-quiz', async(event, payload) => {
    await fetch(`http://localhost:3000/disableQuiz/`, {
        method: 'PUT',
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
    }).catch(() => {})
})

ipcMain.on('login-fail', () => {
    dialog.showErrorBox('login', 'login fail, please try again...!')
})


let addSubject = null;
ipcMain.on('add-subject', () => {
    win.hide();
    addSubject = new BrowserWindow({
        parent: win,
        height: 200,
        width: 400,
        webPreferences: {
            nodeIntegration: true
        }
    });

    addSubject.loadFile('./views/addSubject/addSubject.html');

    addSubject.on('close', () => {
        win.show();
    })

    ipcMain.on('save-subject', async(event, subject) => {
        await fetch(`http://localhost:3000/addSubject/`, {
            method: 'POST',
            body: JSON.stringify(subject),
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        }).then((res) => {
            return res.json();
        }).then((status) => {
            if (status.status === 200) {
                dialog.showMessageBox({
                    buttons: ["Yes", "No"],
                    message: "insert done, Do you really want to quit?"
                }).then((res) => {
                    win.send('update-subjects');
                    if (!res.response) {
                        addSubject.close();
                    }
                })
            } else {
                throw new Error();
            }
        }).catch(() => {

        })
    })
})
let quizzes = null;
ipcMain.on('send-code-subject', async(event, code) => {
    const exam = await fetch(`http://localhost:3000/getTestExam/${code}`, { method: 'GET' });
    const quizzesJson = await exam.json();
    if (quizzesJson) {
        win.loadFile('./views/testUi/examTest/examTest.html');
        win.maximize();
        quizzes = quizzesJson;
    }
})

ipcMain.on('get-Quizzes', (event) => {
        console.log(quizzes)
        if (quizzes) {
            event.reply('main-send-quizzes', quizzes);
        }
    })
    //MAE101_WMSj9hlTkhKGJTjM