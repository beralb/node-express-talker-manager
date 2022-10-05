module.exports = function authTalker(req, res, next) {
  const inputedToken = req.headers.authorization;
  console.log(`reqheaders: ${req.headers}`);
  console.log(`inputedToken: ${inputedToken}`);
  console.log(`global token no mid: ${process.env.GLOBAL_TOKEN}`);

  if (!inputedToken) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }
  if (inputedToken !== process.env.GLOBAL_TOKEN) {
    return res.status(401).json({ message: 'Token inválido' });
  }
  next();
};
