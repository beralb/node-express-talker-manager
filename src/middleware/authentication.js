module.exports = function authenticated(req, res, next) {
  const { email, password } = req.body;
  // console.log(email, password);
  const mailformat = /\S+@\S+\.\S+/;
  const emailTest = mailformat.test(email);

  if (!email) {
    return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  }
  if (!emailTest) {
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  if (!password) {
    return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  next();
};
