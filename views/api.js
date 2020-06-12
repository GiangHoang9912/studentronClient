const removeSession = () => {
  sessionStorage.removeItem('id');
  sessionStorage.removeItem('name');
  sessionStorage.removeItem('rule');
}

const resetTableScore = () => {
  scoreTable.innerHTML = '';
  const trHeader = document.createElement('tr');
  const tdSubject = document.createElement('th');
  const subjectNode = document.createTextNode('subject')
  tdSubject.appendChild(subjectNode)

  const tdScore = document.createElement('th');
  const scoreNode = document.createTextNode('score')
  tdScore.appendChild(scoreNode);

  trHeader.appendChild(tdSubject);
  trHeader.appendChild(tdScore);

  scoreTable.appendChild(trHeader);
}

module.exports = { removeSession, resetTableScore }