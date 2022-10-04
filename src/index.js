const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const authenticated = require('./middleware/authentication');

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
  const talkerArray = JSON.parse(await fs.readFile(pathTalkers, 'utf-8'));
  res.status(200).json(talkerArray);
});

app.get('/talker/:id', async (req, res) => {
  const talkerArray = JSON.parse(await fs.readFile(pathTalkers, 'utf-8'));
  const { id } = req.params;
  const index = talkerArray.findIndex((talker) => talker.id === Number(id));
  if (index < 0) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  res.status(200).json(talkerArray[index]);
});

app.post('/login', authenticated, (req, res) => {
  function generateToken() {
    return crypto.randomBytes(8.5).toString('hex');
    // return crypto.randomBytes(16).toString('utf8')
  }

  const generatedToken = generateToken();

  res.status(200).json({ token: generatedToken });
});

app.listen(PORT, () => {
  console.log('Online');
});

 // const id = req.params.id;