const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const pathTalkers = path.resolve(__dirname, '..', 'src', 'talker.json');


const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (req, res) => {
  const talkerArray = JSON.parse(await fs.readFile(pathTalkers, 'utf-8'))
  res.status(200).json(talkerArray);
});

app.listen(PORT, () => {
  console.log('Online');
});
