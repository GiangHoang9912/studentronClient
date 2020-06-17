const { ipcRenderer } = require("electron");
const displayQuestion = document.querySelector('.displayQuestion');
const buttonQuestion = document.querySelector('.buttonQuestion');
const displayAnswer = document.querySelector('.answers');

ipcRenderer.send('get-Quizzes');


ipcRenderer.on('main-send-quizzes', (event, quizzes) => {
  createQuizFrame(quizzes[0])
  for (let i = 0; i < quizzes.length; i++) {
    console.log(quizzes[i]);
    generateBtnQuestion(i + 1, quizzes[i]);
  }
})


const createQuizFrame = (quiz) => {
  displayQuestion.innerHTML = '';
  displayAnswer.innerHTML = '';
  const divQuestion = document.createElement('div');
  const question = document.createElement('h2');
  question.textContent = `Question : ${quiz.question}`;
  divQuestion.appendChild(question);
  displayQuestion.appendChild(divQuestion);



  if (quiz.correctLength == 1) {
    for (const answer of quiz.answer) {
      const anEl = document.createElement('div');
      anEl.setAttribute('class', 'anEl')

      const inputEl = document.createElement('input');
      inputEl.value = answer;
      inputEl.setAttribute('type', 'radio')
      inputEl.setAttribute('name', 'answersRadio')
      const textAnswer = document.createElement('h3')
      textAnswer.textContent = answer;

      anEl.appendChild(inputEl)
      anEl.appendChild(textAnswer)

      displayAnswer.appendChild(anEl)
    }
  } else {
    for (const answer of quiz.answer) {
      const anEl = document.createElement('div');
      anEl.setAttribute('class', 'anEl')

      const inputEl = document.createElement('input')
      inputEl.setAttribute('type', 'checkbox');
      inputEl.value = answer;
      const textAnswer = document.createElement('h3')
      textAnswer.textContent = answer;
      anEl.appendChild(inputEl)
      anEl.appendChild(textAnswer)

      displayAnswer.appendChild(anEl)
    }
  }
}
let userAnswers = [];
const generateBtnQuestion = (i, quiz) => {
  const btn_quiz = document.createElement('button');
  btn_quiz.textContent = i;
  btn_quiz.setAttribute('id', quiz._id)
  btn_quiz.addEventListener('click', (e) => {
    e.preventDefault();
    const inputAnswers = document.querySelectorAll('input');


    for (const answer of inputAnswers) {
      if (answer.checked) {
        userAnswers.push({ question: quiz._id, answer: answer.value })
      }
    }
    console.log(userAnswers)
    createQuizFrame(quiz);
  })
  buttonQuestion.appendChild(btn_quiz)
}