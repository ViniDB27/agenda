const { findAll } = require('../models/contatoModel');

exports.index = async (req, res) => {
  const contatos = await findAll();
  return res.render('index', { contatos });
};

