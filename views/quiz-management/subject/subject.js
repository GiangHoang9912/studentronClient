const { ipcRenderer } = require('electron');
const { createTableSubject, removeSession, resetTableSubject } = require('../../create-element.js');
const btn_quizzes = document.querySelector('#btn_Quizzes');
const btn_Student = document.querySelector('#btn_Student');
const btn_Logout = document.querySelector('#btn_Logout');
const btn_subject = document.querySelector('#btn_Subject');
const btn_add_subject = document.querySelector('#btn_add_subject');

btn_subject.disabled = true;

ipcRenderer.send('get-subjects')

ipcRenderer.on('subjects-json', (_, subjectsJson) => {
  resetTableSubject();
  for (const subject of subjectsJson) {
    createTableSubject(subject)
  }
})

btn_Student.addEventListener('click', (e) => {
  e.preventDefault();
  ipcRenderer.send('open-Students', { rule: sessionStorage.getItem('rule') })
})

btn_quizzes.addEventListener('click', (e) => {
  e.preventDefault();
  ipcRenderer.send('open-Quizzes', { rule: sessionStorage.getItem('rule') })
})


btn_Logout.addEventListener('click', (e) => {
  e.preventDefault();
  removeSession();
  ipcRenderer.send('user-Logout')
})


btn_add_subject.addEventListener('click', (e) => {
  e.preventDefault();
  ipcRenderer.send('add-subject')
})

ipcRenderer.on('update-subjects', () => {
  ipcRenderer.send('get-subjects')
})