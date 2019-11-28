const alertZone = document.getElementById('alert-zone');

const logError = err => showAlert(err, true);

const readResponseAsJSON = res => res.json();

const readResponseAsText = res => res.text();

const validateResponse = res => {
  if (!res.ok) {
    showAlert(res.statusText, true);
    throw Error(res.error);
  }
  return res;
};

const getQuestions = callback => {
  return fetch('api/questions')
    .then(validateResponse)
    .then(readResponseAsJSON)
    .then(callback)
    .catch(logError);
};

const showAlert = (message, isError) => {

  const alertClass = isError ? 'alert-danger' : 'alert-success';

  const alert = `
    <div class="alert ${ alertClass} alert-dismissible fade show" role="alert">
      <strong>${message}</strong>
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>`;

  alertZone.innerHTML = alert;
};