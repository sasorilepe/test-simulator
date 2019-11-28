const { Router } = require('express');

const questionRouter = Router();

questionRouter.get('/', (_req, res) => res.render('../public/index.html'));

questionRouter.get('/dashboard', (_req, res) => res.render('../public/index.html'));

questionRouter.get('/manage-questions', (_req, res) => res.render('../public/manage-questions.html'));

module.exports = questionRouter;