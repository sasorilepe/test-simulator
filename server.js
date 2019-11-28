const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const apiRouter = require('./src/routes/APIRouter');
const questionRouter = require('./src/routes/QuestionRouter');

const app = express();

app.use(bodyParser.json());

app.engine('html', ejs.renderFile);

app.use('/', express.static(__dirname + '/public'));

app.use('/', questionRouter);
app.use('/api', apiRouter);

const server = app.listen(8080, () => {
  const address = server.address();
  const host = address.address;
  const port = address.port;
  console.log(`App listening at http://${host}:${port}`);
});