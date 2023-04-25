const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.erros = [];
    this.user = null;
  }

  async login() {    
    const userExist = await LoginModel.findOne({ email: this.body.email });

    if (!userExist) {
      this.erros.push('Usuário não autorizado');
      return;
    }

    if (!bcrypt.compareSync(this.body.password, userExist.password)) {
      this.erros.push('Usuário não autorizado');
      return;
    }

    this.user = userExist;
  }

  async register() {
    await this.validate(true);
    if (this.erros.length > 0) return;
    await this.userExist()
    if (this.erros.length > 0) return;
    const salt = bcrypt.genSaltSync();
    this.body.password = bcrypt.hashSync(this.body.password, salt);
    this.user = await LoginModel.create(this.body)
  }

  async userExist() {
    const userExist = await LoginModel.findOne({ email: this.body.email });

    if (userExist && userExist.email === this.body.email) {
      this.erros.push('E-mail já cadastrado!')
    }
  }

  async validate(validateName = false) {
    this.clanUp();

    if (!validator.isEmail(this.body.email)) {
      this.erros.push('E-mail inválido!')
    }

    if (this.body.password.length <= 3) {
      this.erros.push('Senha inválida, a senha deve contar mais de 3 letras')
    }

    if (validateName && this.body.name.length <= 2) {
      this.erros.push('O nome é inválida, o nome deve contar mais de 2 letras')
    }
  }

  clanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }

    this.body = {
      email: this.body.email,
      password: this.body.password,
      name: this.body.name,
    }
  }

}

module.exports = Login;
