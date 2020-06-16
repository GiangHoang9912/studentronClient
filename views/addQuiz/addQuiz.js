const { ipcRenderer } = require("electron");

const { createOption, createDivAnswer } = require('../createElement')


const btn_add_answer = document.querySelector('#btn_add_answer');
const selectionTag = document.querySelector('#subject')
const submit = document.querySelector('form');


let sessions = null;


ipcRenderer.send('get-subjects')

ipcRenderer.on('subjects-json', (_, subjectsJson) => {
  for (const subject of subjectsJson) {
    createOption(subject.subjectCode, subject.subjectName)
  }
})

ipcRenderer.send('get-session')
ipcRenderer.on('main-send-session', (_, session) => {
  sessions = session;
})

btn_add_answer.addEventListener('click', (e) => {
  e.preventDefault();
  createDivAnswer();
})

submit.addEventListener('submit', (e) => {
  e.preventDefault();


  const question = document.querySelector('#question textarea').value;
  const answersTextarea = document.querySelectorAll('#answers textarea');
  let arrAnswer = [];
  let correct = [];

  for (const answerInput of answersTextarea) {
    arrAnswer.push(answerInput.value)
  }

  const arrCheckbox = document.querySelectorAll(`input[type='checkbox']`);

  for (let i = 0; i < arrCheckbox.length; i++) {
    if (arrCheckbox[i].checked === true) {
      correct.push(i);
    }
  }


  const objectQuestion = {
    subject: selectionTag.value,
    quiz: {
      question: question,
      answer: arrAnswer,
      status: true,
      userId: sessions.id,
      correct: correct
    }
  }

  ipcRenderer.send('fetch-post-quiz', objectQuestion)
})