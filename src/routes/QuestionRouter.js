const { Router } = require('express');
const questionController = require('../controllers/QuestionController');

const questionRouter = Router();

questionRouter.get('/', (_req, res) => res.render('index.html'));

questionRouter.get('/questions', async (_req, res) => {
  const questions = await questionController.getValidQuestions();
  res.status(200).json(questions);
});

questionRouter.post('/delete-question', (req, res) => {
  const { zipFile } = req.body;
  const questionRes = questionController.deleteQuestion(zipFile);
  const status = questionRes.status;
  delete questionRes.status;
  res.status(status).json(questionRes);
});

questionRouter.post('/uninstall-question', (req, res) => {
  const { zipFile } = req.body;
  const questionRes = questionController.uninstallQuestion(zipFile);
  const status = questionRes.status;
  delete questionRes.status;
  res.status(status).json(questionRes);
});

questionRouter.post('/install-question', async (req, res) => {
  const { zipFile } = req.body;
  const questionRes = await questionController.installQuestion(zipFile);
  const status = questionRes.status;
  delete questionRes.status;
  res.status(status).json(questionRes);
});

module.exports = questionRouter;