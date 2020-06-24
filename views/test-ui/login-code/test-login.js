const { ipcRenderer } = require("electron");
const form = document.querySelector('form');
const btnQuit = document.querySelector('#quit');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const code = document.querySelector('#input-code').value;
  ipcRenderer.send('send-code-subject', code);
})

btnShowScore.addEventListener('click', (e) => {
  e.preventDefault();
  ipcRenderer.send('show-score-userId');
})

btnQuit.addEventListener('click', () => {
  ipcRenderer.send('student-quit')
})
