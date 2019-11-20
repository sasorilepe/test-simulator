const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const questionRouter = require('./src/routes/QuestionRouter');

app.use(bodyParser.json());
app.use('/', express.static(__dirname + '/public'));
app.use('/', questionRouter);

const server = app.listen(8080, () => {
  const address = server.address();
  const host = address.address;
  const port = address.port;
  console.log(`App listening at http://${host}:${port}`);
});