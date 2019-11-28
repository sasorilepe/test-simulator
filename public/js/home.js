const toggleBtn = document.getElementById('menu-toggle');
const wrapper = document.getElementById('wrapper');
const dashboard = document.getElementById('dashboard');
const dashboardLink = document.getElementById('dashboard-link');
const questionContainer = document.getElementById('question');
const questionState = document.getElementById('question-state');
const sidebar = document.querySelector('#sidebar-wrapper .list-group');

const openApp = event => {
  const codePath = event.target.dataset.codePath;
  window.open(codePath, '_blank');
};

const editCode = event => {
  fetch('api/edit-question', {
    method: 'POST',
    body: JSON.stringify({
      questionId: event.target.dataset.questionId
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(validateResponse)
    .catch(logError);
};

const setLastSelected = questionId => {
  const url = window.location.href;
  const param = url.split('?challenge=')[1];
  if (param === undefined) {
    return;
  }
  else if (param.toString() === questionId.toString()) {
    localStorage.setItem('lastSelected', questionId);
  }
};

const getInstructionsPath = questionId => {
  const path = `challenges/${questionId}/instructions/index.html`;
  return path;
};

const getCodePath = questionId => {
  const path = `challenges/${questionId}/code/index.html`;
  return path;
};

const selectSidebarOption = event => {

  const selected = event.target.dataset.questionId;
  const options = document.getElementsByClassName('list-group-item');

  for (const option of options) {
    option.classList.remove('active', 'selected-question');
    option.classList.add('bg-light');
  }

  event.target.classList.add('active', 'selected-question');
  event.target.classList.remove('bg-light');

  if (selected === undefined) {
    return;
  }
  else {
    localStorage.setItem('lastSelected', selected);
  }
};

const showSidebar = () => wrapper.classList.toggle('toggled');

const showQuestions = questions => {

  for (const question of questions) {

    const questionId = question.challengeData.id;
    const questionLink = document.createElement('a');
    const questionTitle = question.challengeData.name;
    const questionNode = document.createTextNode(questionTitle);
    const lastSelected = localStorage.getItem('lastSelected');

    setLastSelected(questionId);

    questionLink.appendChild(questionNode);
    questionLink.href = 'javascript:void(0);';

    if (question.installed) {

      questionLink.classList.add(
        'list-group-item',
        'list-group-item-action',
        'bg-light');
      questionLink.dataset.questionId = questionId;
      questionLink.dataset.title = questionTitle;
      questionLink.dataset.loaded = false;

      questionLink.addEventListener('click', async (event) => {

        questionState.classList.remove('d-none');

        window.history.pushState(
          'param',
          'param',
          `http://${window.location.host}?challenge=${questionId}`
        );

        const state = localStorage.getItem(event.target.dataset.questionId) === 'true';

        if (event.target.dataset.instructions === undefined) {

          const instructionsPath = getInstructionsPath(questionId);
          event.target.dataset.instructions = await getInstructions(
            instructionsPath,
            event.target.dataset.title
          );
        }

        questionContainer.innerHTML = event.target.dataset.instructions;

        const viewPageBtn = questionContainer.getElementsByClassName('btn-primary')[0];

        viewPageBtn.dataset.codePath = getCodePath(questionId);

        viewPageBtn.addEventListener(
          'click',
          openApp
        );

        const editCodeBtn = questionContainer.getElementsByClassName('btn-success')[0];

        editCodeBtn.dataset.questionId = questionId;

        editCodeBtn.addEventListener(
          'click',
          editCode
        );

        selectSidebarOption(event);

        questionContainer.classList.remove('d-none');
        dashboard.classList.add('d-none');

        if (!state) {
          questionState.innerText = 'Not finished!';
          questionState.classList.remove('btn-success');
          questionState.classList.add('btn-danger');
        }
        else {
          questionState.innerText = 'Finished!';
          questionState.classList.add('btn-success');
          questionState.classList.remove('btn-danger');
        }
      });

      sidebar.appendChild(questionLink);
    }

    if (lastSelected.toString() === questionId.toString()) {
      questionLink.click();
    }
  }
};

const getInstructions = async (url, title = 'ok') => {

  const header = `<h1>${title}</h1><hr>`;

  const instructions = await fetch(url)
    .then(validateResponse)
    .then(readResponseAsText)
    .catch('<b>Not found</b>')

  return header + instructions;
};

const showDashboard = event => {
  questionContainer.classList.add('d-none');
  questionState.classList.add('d-none');
  dashboard.classList.remove('d-none')
  selectSidebarOption(event);
  window.history.pushState('param', 'param', 'dashboard');
};

const changeQuestionState = () => {

  const lastSelected = localStorage.getItem('lastSelected');
  const state = localStorage.getItem(lastSelected) === 'true';

  if (state) {
    questionState.innerText = 'Not finished!';
    questionState.classList.remove('btn-success');
    questionState.classList.add('btn-danger');
    localStorage.setItem(lastSelected, false);
  }
  else {
    questionState.innerText = 'Finished!';
    questionState.classList.add('btn-success');
    questionState.classList.remove('btn-danger');
    localStorage.setItem(lastSelected, true);
  }
};

window.addEventListener('load', () => {

  const lastSelected = localStorage.getItem('lastSelected');
  if (lastSelected === null) {
    localStorage.setItem('lastSelected', 'dashboard');
    questionState.classList.add('d-none');
  }
  else if (lastSelected === 'dashboard') {
    questionState.classList.add('d-none');
  }

  toggleBtn.addEventListener('click', showSidebar);
  dashboardLink.addEventListener('click', showDashboard);
  questionState.addEventListener('click', changeQuestionState);

  getQuestions(showQuestions);
});