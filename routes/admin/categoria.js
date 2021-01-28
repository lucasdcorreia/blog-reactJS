const express = require('express')
const CategoriaRouter = express.Router()

// Model
const Categoria = require('../../models/Categoria')

// Listar categorias
CategoriaRouter.get('/', (req, res) => {
  if (req.query.busca) {
    console.log(req.query.busca)
    Categoria.find().where('nome').equals(req.query.busca).lean().exec((err, categorias) => {
      res.render('admin/categoria/categorias', { categorias: categorias })
    })
  } else {
    Categoria.find().lean().exec((err, categorias) => {
      res.render('admin/categoria/categorias', { categorias: categorias })
    })
  }
})

// Formulário
CategoriaRouter.get('/form/:id?', (req, res) => {
  if (req.params.id) {
    Categoria.findOne({ _id: req.params.id }).lean().exec((err, categoria) => {
      if (err) {
        req.flash('error_msg', 'Categoria não encontrada')
        res.redirect('/categorias/')
      }
      res.render('admin/categorias/form', { categoria: categoria })
    })
  } else {
    res.render('admin/categoria/form')
  }
})

// CREATE
CategoriaRouter.post('/create', (req, res) => {
  var novaCategoria = {
    nome: req.body.nome,
    slug: req.body.slug
  }
  Categoria.save(novaCategoria).then(() => {
    req.flash('success_msg', 'Nova categoria cadastrada com sucesso.')
    res.redirect('/categoria/')
  }).catch((err) => {
    req.flash('error_msg', 'Erro ao cadastrar nova categoria. ' + err)
    res.redirect('/categoria')
  })
})

// UPDATE
CategoriaRouter.post('/update', (req, res) => {
  Categoria.updateOne({ _id: req.body.id }, {
    nome: req.body.nome,
    slug: req.body.slug
  }).then(() => {
    req.flash('success_msg', 'Categoria editada com sucesso.')
    res.redirect('/categoria/')
  }).catch((err) => {
    req.flash('error_msg', 'Erro ao editar categoria. ' + err)
    res.redirect('/categoria')
  })
})

// DELETE
CategoriaRouter.get('/delete/:id', (req, res) => {
  Categoria.deleteOne({ _id: req.params.id }).then(() => {
    req.flash('success_msg', 'Categoria excluída com sucesso.')
    res.redirect('/categoria')
  }).catch((err) => {
    req.flash('error_msg', 'Erro ao excluir postagem.')
    res.redirect('/categoria')
  })
})

module.exports = CategoriaRouter