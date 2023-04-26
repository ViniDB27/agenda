const mongose = require('mongoose');
const validator = require('validator');

const ContatoSchema = new mongose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: false, default: '' },
  phone: { type: String, required: false, default: '' },
  email: { type: String, required: false, default: '' },
  createAt: { type: Date, default: Date.now },
});

const contatoModel = mongose.model('Contato', ContatoSchema);

class Contato {
  constructor(body) {
      this.body = body;
      this.erros = [];
      this.contato = null;
  }

  async edit(id) {
    if(!mongose.Types.ObjectId.isValid(id)) return;
    
    await this.validate()

    if (this.erros.length > 0) return;

    this.contato = await contatoModel.findByIdAndUpdate(id, this.body, { new: true });
  }
  
  async register() {
    await this.validate()

    if (this.erros.length > 0) return;

    this.contato = await contatoModel.create(this.body);
  }

  async validate() {
    await this.clanUp();

    if (!this.body.firstname) {
      this.erros.push('Nome é um campo obrigatório!')
    }

    if (this.body.email && !validator.isEmail(this.body.email)) {
      this.erros.push('E-mail inválido!')
    }

    if (!this.body.email && !this.body.phone) {
      this.erros.push("Pelo menos um contato precisa ser enviado: e-mail ou telefone!")
    }
  }

  async clanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }

    this.body = {
      firstname: this.body.firstname,
      lastname: this.body.lastname,
      email: this.body.email,
      phone: this.body.phone,
    }
  }
}

async function findAll() {
  return contatoModel.find().sort({ createAt: -1 });
}

async function findById(id){
  if(!mongose.Types.ObjectId.isValid(id)) return;
  return contatoModel.findById(id);
}

async function deleteContato(id) {
  if (!mongose.Types.ObjectId.isValid(id)) return;
  return contatoModel.findOneAndDelete({ _id: id });
}

module.exports = { Contato, findById, findAll, deleteContato };
  