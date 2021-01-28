// Express
const express = require('express')
const UsuarioRouter = express.Router()

// Model
const Usuario = require('../../models/Usuario')

// Outros
const bcrypt = require('bcryptjs')
const passport = require('passport')




// Listar usuarios
UsuarioRouter.get('/usuarios', (req, res) => {
  Usuario.find().lean().exec((err, usuarios) => {
    if (err) {

    }
    res.render('admin/usuario/usuarios', { usuarios: usuarios })
  })
})

// FORM
UsuarioRouter.get('/form/:id?', (req, res) => {

})

// CREATE
UsuarioRouter.post('/create', (req, res) => {
  var erros = []
  if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
    erros.push({ texto: 'Nome inválido' })
  }
  if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
    erros.push({ texto: 'E-mail inválido' })
  }
  if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
    erros.push({ texto: 'Senha inválida' })
  }
  if (req.body.senha.length < 6) {
    erros.push({ texto: 'Sua senha deve conter pelo menos 6 caracteres' })
  }
  if (req.body.senha != req.body.senha2) {
    erros.push({ texto: 'Senhas diferentes' })
  }

  if (erros.length > 0) {
    res.render('usuario/cadastro', { erros: erros })
  } else {
    Usuario.findOne({ email: req.body.email }).then((usuario) => {
      if (usuario) {
        req.flash('error_msg', 'E-mail informado já está sendo utilizado em outra conta.')
        res.redirect('/usuario/cadastro')
      } else {
        var novoUsuario = {
          nome: req.body.nome,
          email: req.body.email,
          senha: req.body.senha
        }

        bcrypt.genSalt(10, (erro, salt) => {
          bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
            if (erro) {
              req.flash('error_msg', 'Erro ao gerar hash')
              res.redirect('/')
            }
            novoUsuario.senha = hash
            Usuario(novoUsuario).save().then(() => {
              req.flash('success_msg', 'Cadastro realizado com sucesso.')
              res.redirect('/')
            }).catch((err) => {
              req.flash('error_msg', 'Erro ao cadastrar usuário.')
              res.redirect('/usuario/cadastro')
            })
          })
        })


      }
    }).catch((err) => {
      req.flash('error_msg', 'Houve um erro interno')
      res.redirect('/')
    })
  }
})

// UPDATE
UsuarioRouter.get('/update', (req, res) => {

})

// DELETE
UsuarioRouter.get('/delete', (req, res) => {

})

// LOGIN
UsuarioRouter.get('/login', (req, res) => {
  res.render('usuario/login')
})

UsuarioRouter.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/usuario/login',
    failureFlash: true
  })(req, res, next)
})

// CADASTRO
UsuarioRouter.get('/cadastro', (req, res) => {
  res.render('usuario/cadastro')
})

// LOGOUT
UsuarioRouter.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', 'Logout success')
  res.redirect('/')
})


// Exportando Modulo
module.exports = UsuarioRouter