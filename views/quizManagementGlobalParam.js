const btn_quizzes = document.querySelector('#btn_Quizzes');
const btn_Student = document.querySelector('#btn_Student');
const btn_Logout = document.querySelector('#btn_Logout');
const { ipcRenderer } = require('electron');
const { removeSession, resetTableScore } = require('../api.js');
const scoreTable = document.querySelector('#score');

