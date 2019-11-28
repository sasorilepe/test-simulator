const questionContainer = document.getElementById('questionContainer');

const postQuestion = (questionId, questionFile, isInstalling) => {

  const url = isInstalling ? 'api/install-question' : 'api/uninstall-question';
  const data = isInstalling ? { zipFile: questionFile } : { questionId };

  fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(validateResponse)
    .then(readResponseAsJSON)
    .then(res => {
      showAlert(res.message, false);
      toggleSpinner(questionId, isInstalling, false);
    })
    .catch(logError);
};

const toggleSpinner = (questionId, isInstalling, showSpinner) => {

  const questionCard = document.getElementById(questionId);
  const spinner = questionCard.getElementsByClassName('fa-spinner')[0];
  const installBtn = questionCard.getElementsByClassName('btn-primary')[0];
  const uninstallBtn = questionCard.getElementsByClassName('btn-danger')[0];

  if (isInstalling) {
    if (showSpinner) {
      installBtn.classList.add('d-none');
    }
    else {
      uninstallBtn.classList.remove('d-none');
    }
  }
  else {
    if (showSpinner) {
      uninstallBtn.classList.add('d-none');
    }
    else {
      installBtn.classList.remove('d-none');
    }
  }
  spinner.classList.toggle('d-none');
};

const uninstallQuestion = event => {
  toggleSpinner(event.target.dataset.questionId, false, true);
  postQuestion(event.target.dataset.questionId, event.target.dataset.questionFile, false);
};

const installQuestion = event => {
  toggleSpinner(event.target.dataset.questionId, true, true);
  postQuestion(event.target.dataset.questionId, event.target.dataset.questionFile, true);
};

const showQuestions = questions => {

  for (const question of questions) {

    const questionFile = question.zipFile;
    const questionTitle = question.challengeData.name;
    const questionId = question.challengeData.id;

    const questionCard = document.createElement('div');
    questionCard.id = questionId;
    questionCard.classList.add('card');
    questionCard.innerHTML = `
    <div class="card-body">
      <h2>${ questionTitle}</h2>
      <hr>
      <p class="card-text">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur dignissimos doloremque eum nulla, accusamus tenetur corporis libero dolorum deleniti illo quo itaque voluptatem sequi veritatis minus quos quas iste. Itaque!
      </p>
      <div class="text-right">
        <a href="javascript:void(0);" class="btn btn-primary">
          Install
        </a>
        <a href="javascript:void(0);" class="btn btn-danger">
          Uninstall
        </a>
        <i class="fas fa-spinner fa-spin d-none"></i>
      </div>
    </div>
    `;

    const installBtn = questionCard.getElementsByClassName('btn-primary')[0];
    installBtn.dataset.questionFile = questionFile;
    installBtn.dataset.questionId = questionId;
    installBtn.addEventListener('click', installQuestion);

    const uninstallBtn = questionCard.getElementsByClassName('btn-danger')[0];
    uninstallBtn.dataset.questionFile = questionFile;
    uninstallBtn.dataset.questionId = questionId;
    uninstallBtn.addEventListener('click', uninstallQuestion);

    if (question.installed) {
      installBtn.classList.add('d-none');
    }
    else {
      uninstallBtn.classList.add('d-none');
    }

    questionContainer.appendChild(questionCard);
  }
};

window.addEventListener('load', () => getQuestions(showQuestions));