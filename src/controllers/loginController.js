const Login = require('../models/LoginModel');

exports.index = (req, res) => {
  if(req.session.user) return req.session.save(() => res.redirect('/'));
  return res.render('login');
};


exports.register = async (req, res) => {
  try {
    const login = new Login(req.body)
    await login.register();

    if (login.erros.length > 0) {
      req.flash('errors', login.erros);
      return req.session.save(() => res.redirect('/login'));
    };


    req.flash('success', 'Usuário cadastrado com sucesso!');
    return req.session.save(() => res.redirect('/login'));
  } catch (error) {
    console.log(error);
    return res.render('404');
  }
};


exports.login = async (req, res) => {
  try {
    const login = new Login(req.body)
    await login.login();

    if (login.erros.length > 0) {
      req.flash('errors', login.erros);
      return req.session.save(() => res.redirect('/login'));
    };


    req.flash('success', 'Usuário logado com sucesso!');
    req.session.user = login.user;
    req.session.save(() => res.redirect('/'));
    return;
  } catch (error) {
    console.log(error);
    return res.render('404');
  }
};


exports.logout = async (req, res) => {
  try {
    req.session.user = null;
    return req.session.save(() => res.redirect('/login'));
  } catch (error) {
    console.log(error);
    return res.render('404');
  }
};