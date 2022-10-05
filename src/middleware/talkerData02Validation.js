module.exports = function talkerData02Validation(req, res, next) {
  const { talk } = req.body;
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!talk) {
    return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
  }
  if (!talk.watchedAt) {
    return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  }
  if ((talk.watchedAt).match(regex) === null) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  next();
};