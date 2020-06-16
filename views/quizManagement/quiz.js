const selectionTag = document.querySelector('#subject');
const tableQuiz = document.querySelector('#quizMana');
const btn_Add = document.querySelector('#btn_add');
const btn_add_subject = document.querySelector('#btn_add_subject');

btn_quizzes.disabled = true;
ipcRenderer.send('get-all-quizzes', { userId: sessionStorage.getItem('id'), subjectCode: "MAE101" });


selectionTag.addEventListener('change', (e) => {
    e.preventDefault();
    tableQuiz.innerHTML = '';
    if (Number(selectionTag.value) !== 0) {
        ipcRenderer.send('get-all-quizzes', { userId: sessionStorage.getItem('id'), subjectCode: selectionTag.value });
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

btn_Add.addEventListener('click', (e) => {
    e.preventDefault();
    ipcRenderer.send('open-new-window', { isAdd: true })
})


ipcRenderer.send('get-subjects')

ipcRenderer.on('subjects-json', (_, subjectsJson) => {
    for (const subject of subjectsJson) {
        createOption(subject.subjectCode, subject.subjectName)
    }
})


ipcRenderer.on('quizzes-json', (_, quizzesJson) => {
    createTableQuizzes(quizzesJson)
})

ipcRenderer.on('update-quiz', () => {
    tableQuiz.innerHTML = '';
    ipcRenderer.send('get-all-quizzes', { userId: sessionStorage.getItem('id'), subjectCode: selectionTag.value });
})

ipcRenderer.on('update-subjects', () => {
    selectionTag.innerHTML = '';
    ipcRenderer.send('get-subjects')
})


btn_add_subject.addEventListener('click', (e) => {
    e.preventDefault();
    ipcRenderer.send('add-subject')
})