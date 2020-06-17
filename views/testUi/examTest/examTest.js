const { ipcRenderer } = require("electron");
const displayQuestion = document.querySelector('.displayQuestion');
const buttonQuestion = document.querySelector('.buttonQuestion');
const displayAnswer = document.querySelector('.answers');
const Quiz = require('../entity/Quiz');
let currentQuizId = null;
const HOUR_MINUTE = 60;
const MINUTE_SECOND = 60;


ipcRenderer.send('get-Quizzes');

let userExam = null;
ipcRenderer.on('main-send-quizzes', (event, quizzes) => {
  createQuizFrame(quizzes[0]);
  currentQuizId = quizzes[0]._id;
  userExam = quizzes.map((quiz) => { return { questionId: quiz._id, userAnswer: [] } });

  let TOTAL_TIME = quizzes.length * MINUTE_SECOND;
  let hour = parseInt(TOTAL_TIME / (HOUR_MINUTE * MINUTE_SECOND));
  let minute = (TOTAL_TIME % (HOUR_MINUTE * MINUTE_SECOND)) / MINUTE_SECOND;
  let second = ((TOTAL_TIME % (HOUR_MINUTE * MINUTE_SECOND)) % MINUTE_SECOND);

  const time = setInterval(() => {
    console.log(userExam)
    console.log(hour + ':' + minute + ':' + second);
    second -= 1;
    if (second <= 0) {
      minute -= 1;
      second = MINUTE_SECOND;
    }
    if (minute <= 0 && hour !== 0) {
      hour -= 1;
      minute = 60;
    }

    if (TOTAL_TIME < 0) {
      ipcRenderer.send('finish-exam', userExam);
      clearInterval(time)
    }
    console.log(TOTAL_TIME)
    TOTAL_TIME -= 1;
  }, 100);

  for (let i = 0; i < quizzes.length; i++) {

    generateBtnQuestion(i + 1, quizzes[i]);
  }
})



const createQuizFrame = (quiz) => {
  console.log(quiz.answer)
  displayQuestion.innerHTML = '';
  displayAnswer.innerHTML = '';
  const divQuestion = document.createElement('div');
  const question = document.createElement('h2');
  question.textContent = `Question : ${quiz.question}`;
  divQuestion.appendChild(question);
  displayQuestion.appendChild(divQuestion);



  if (quiz.correctLength == 1) {
    for (let i = 0; i < quiz.answer.length; i++) {
      const anEl = document.createElement('div');
      anEl.setAttribute('class', 'anEl')

      const inputEl = document.createElement('input');
      inputEl.setAttribute('id', `answer-${i}`)

      inputEl.value = quiz.answer[i];
      inputEl.setAttribute('type', 'radio')
      inputEl.setAttribute('name', 'answersRadio')
      const textAnswer = document.createElement('h3')
      textAnswer.textContent = quiz.answer[i];

      anEl.appendChild(inputEl)
      anEl.appendChild(textAnswer)

      displayAnswer.appendChild(anEl)
    }
  } else {
    for (let i = 0; i < quiz.answer.length; i++) {
      const anEl = document.createElement('div');
      anEl.setAttribute('class', 'anEl')

      const inputEl = document.createElement('input')
      inputEl.setAttribute('type', 'checkbox');
      inputEl.setAttribute('id', `answer-${i}`)

      inputEl.value = quiz.answer[i];
      const textAnswer = document.createElement('h3')
      textAnswer.textContent = quiz.answer[i];
      anEl.appendChild(inputEl)
      anEl.appendChild(textAnswer)

      displayAnswer.appendChild(anEl)
    }
  }

  if (userExam) {
    for (const question of userExam) {
      if (quiz._id === question.questionId) {
        for (const answer of question.userAnswer) {
          document.querySelector(`#${answer.getAttribute('id')}`).checked = true
        }
      }
    }
  }

  currentQuizId = quiz._id;
}

const generateBtnQuestion = (i, quiz) => {
  const btn_quiz = document.createElement('button');
  btn_quiz.textContent = i;
  btn_quiz.setAttribute('id', quiz._id)

  btn_quiz.addEventListener('click', (e) => {
    e.preventDefault();
    let arrTextAnswer = [];
    const inputChecked = displayAnswer.querySelectorAll('input:checked');

    for (const input of inputChecked) {
      arrTextAnswer.push(input.value)
    }
    //xem question co tron arruseranswer chua userExam = [quiz{ questionId; userAnswer[] }]
    for (const question of userExam) {
      if (question.questionId === currentQuizId) {
        question.userAnswer = inputChecked;
        question.textAnswers = arrTextAnswer;
        break;
      }
    }

    createQuizFrame(quiz);
  })
  buttonQuestion.appendChild(btn_quiz)
}