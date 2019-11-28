const { Router } = require('express');
const questionController = require('../controllers/QuestionController');

const apiRouter = Router();

apiRouter.get('/questions', async (_req, res) => {
  const questions = await questionController.getValidQuestions();
  res.status(200).json(questions);
});

apiRouter.post('/edit-question', (req, res) => {
  const { questionId } = req.body;
  questionController.editQuestion(questionId);
  res.status(200).json({});
});

apiRouter.post('/delete-question', (req, res) => {
  const { zipFile } = req.body;
  const questionRes = questionController.deleteQuestion(zipFile);
  const status = questionRes.status;
  delete questionRes.status;
  res.status(status).json(questionRes);
});

apiRouter.post('/uninstall-question', (req, res) => {
  const { questionId } = req.body;
  const questionRes = questionController.uninstallQuestion(questionId);
  const status = questionRes.status;
  delete questionRes.status;
  res.status(status).json(questionRes);
});

apiRouter.post('/install-question', async (req, res) => {
  const { zipFile } = req.body;
  const questionRes = await questionController.installQuestion(zipFile);
  const status = questionRes.status;
  delete questionRes.status;
  res.status(status).json(questionRes);
});

module.exports = apiRouter;