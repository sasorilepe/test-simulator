const alertZone = document.getElementById('alert-zone');

const logError = err => showAlert(err, true);

const readResponseAsJSON = res => res.json();

const readResponseAsText = res => res.text();

const validateResponse = res => {
  if (!res.ok) {
    throw Error(res.error);
  }
  return res;
};

const getTitle = zipFile => {
  const filename = zipFile.split('.')[0];
  const title = filename.charAt(0).toUpperCase() + filename.slice(1);
  return title;
};

const getQuestions = callback => {
  return fetch('questions')
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