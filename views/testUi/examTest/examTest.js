const { ipcRenderer } = require("electron");

ipcRenderer.send('get-Quizzes');


ipcRenderer.on('main-send-quizzes', (event, quizzes) => {
  console.log(quizzes);
})