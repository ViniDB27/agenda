const { Contato, findById } = require('../models/contatoModel');

exports.index = (req, res) => {
  return res.render('contato', { contato: {} });
};

exports.register = async (req, res) => {
  try {
    const contato = new Contato(req.body);
    await contato.register();

    if(contato.erros.length > 0){
      req.flash('errors', contato.erros);
      return req.session.save(() => res.redirect('/contato'));
    }


    req.flash('success', 'Contato salvo com sucesso!');
    return req.session.save(() => res.redirect('/'));
  }catch (error) {
    console.log(error);
    return res.render('404');
  }
};

exports.editIndex = async  (req, res) => {
  if(!req.params.id) {
    return res.render('404');
  }
  
  const contato = await findById(req.params.id);

  if(!contato) {
    return res.render('404');
  }
  
  return res.render('contato', { contato });
};

exports.edit = async (req, res) => {
  if(!req.params.id) {
    return res.render('404');
  }
  
  try {
    const contato = new Contato(req.body);
    await contato.edit(req.params.id);

    if(contato.erros.length > 0){
      req.flash('errors', contato.erros);
      return req.session.save(() => res.redirect('/contato'));
    }

    req.flash('success', 'Contato salvo com sucesso!');
    return req.session.save(() => res.redirect('/'));
  } catch (error) {
    console.log(error);
    return res.render('404');
  }
};