const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const authenticated = require('./middleware/authentication');
const talkerTokenAuth = require('./middleware/talkerTokenValidation');
const talkerData01Validation = require('./middleware/talkerData01Validation');
const talkerData02Validation = require('./middleware/talkerData02Validation');
const talkerData03Validation = require('./middleware/talkerData03Validation');

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
  }

  const generatedToken = generateToken();
  process.env.GLOBAL_TOKEN = generatedToken;
  // console.log(`global token index: ${process.env.GLOBAL_TOKEN}`);
  res.status(200).json({ token: generatedToken });
});

app.post(
  '/talker',
  talkerTokenAuth,
  talkerData01Validation,
  talkerData02Validation,
  talkerData03Validation,
  async (req, res) => {
    let talkersArray = JSON.parse(await fs.readFile(pathTalkers, 'utf-8'));
    const id = talkersArray.length + 1;
    const { name, age, talk } = req.body;
    const newTalker = { name, age, id, talk };
    talkersArray = [...talkersArray, newTalker];

    await fs.writeFile(pathTalkers, JSON.stringify(talkersArray), 'utf8');

    res.status(201).json(newTalker);
  },
);

app.put('/talker/:id',
  talkerTokenAuth,
  talkerData01Validation,
  talkerData02Validation,
  talkerData03Validation,
  async (req, res) => {
    const talkersArray = JSON.parse(await fs.readFile(pathTalkers, 'utf-8'));
    const { id } = req.params;
    const index = talkersArray.findIndex((talker) => talker.id === Number(id));
    const { name, age, talk } = req.body;

    talkersArray[index].name = name;
    talkersArray[index].age = age;
    talkersArray[index].talk = talk;

    await fs.writeFile(pathTalkers, JSON.stringify(talkersArray), 'utf8');
    res.status(200).json(talkersArray[index]);
    // res.status(200).json(newTalker);
  });

  app.put('/talker/:id',
  talkerTokenAuth,
  async (req, res) => {
    const talkersList = JSON.parse(await fs.readFile(pathTalkers, 'utf-8'));
    const { id } = req.params;
    const index = talkersList.findIndex((talker) => talker.id === Number(id));
    const { name, age, talk } = req.body;

    talkersList[index].name = name;
    talkersList[index].age = age;
    talkersList[index].talk = talk;

    await fs.writeFile(pathTalkers, JSON.stringify(talkersList), 'utf8');
    res.status(200).json(talkersList[index]);
    // res.status(200).json(newTalker);
  });

  app.delete('/talker/:id', talkerTokenAuth, async (req, res) => {
    const talkersArray = JSON.parse(await fs.readFile(pathTalkers, 'utf-8'));
    const { id } = req.params;
    const index = talkersArray.findIndex((talker) => talker.id === Number(id));
    talkersArray.splice(index, 1);
    console.log(talkersArray);
    await fs.writeFile(pathTalkers, JSON.stringify(talkersArray), 'utf8');
    res.status(204).json('');
  });

app.listen(PORT, () => {
  console.log('Online');
});
