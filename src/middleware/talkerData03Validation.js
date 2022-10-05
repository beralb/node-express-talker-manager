module.exports = function talkerData02Validation(req, res, next) {
  const { talk } = req.body;

  const regex = /^\d{2}\/\d{2}\/\d{4}$/;

  if (!Number.isInteger(talk.rate) || Number(talk.rate) < 1 || Number(talk.rate) > 5) {
    return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }

  if ((talk.watchedAt).match(regex) === null) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  next();
};