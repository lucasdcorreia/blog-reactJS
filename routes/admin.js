const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('categorias')
const Postagem = require('../models/Postagem')
const {eAdmin} = require('../helpers/eAdmin')

router.get('/dashboard', (req, res) => {
  res.render('admin/dashboard')
})

// Listar categorias
router.get('/categorias', (req, res) => {
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

// Formularios
// Nova categoria
router.get('/categorias/add', (req, res) => {
  res.render('admin/categoria/addcategoria')
})
// Editar categoria
router.get('/categorias/edit/:id', (req, res) => {
  Categoria.findOne({ _id: req.params.id }).lean().exec((err, categoria) => {
    res.render('admin/editcategoria', { categoria: categoria })
  })
})

// Ações
// CREATE
router.post('/categorias/nova', (req, res) => {

  var erros = []
  if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
    erros.push({ texto: 'Nome inválido' })
  }
  if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
    erros.push({ texto: 'Slug inválido' })
  }
  if (req.body.nome.length < 2) {
    erros.push({ texto: 'Nome de categoria muito curto' })
  }
  if (erros.length > 0) {
    res.render('admin/addcategoria', { erros: erros })
  } else {
    var novaCategoria = {
      nome: req.body.nome,
      slug: req.body.slug
    }
    new Categoria(novaCategoria).save().then(() => {
      console.log('Nova categoria adicionada com sucesso.')
      req.flash('success_msg', 'Categoria criada com sucesso!')
      res.redirect('/admin/categorias')
    }
    ).catch((err) => {
      req.flash('error_msg', 'Erro ao cadastrar nova categoria.')
      console.log('Erro ao adicionar nova categoria: ' + err)
    })
  }
})

// UPDATE
router.post('/categorias/edit', (req, res) => {
  var erros = []
  if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
    erros.push({ texto: 'Nome inválido' })
  }
  if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
    erros.push({ texto: 'Slug inválido' })
  }
  if (req.body.nome.length < 2) {
    erros.push({ texto: 'Nome de categoria muito curto' })
  }

  if (erros.length > 0) {
    res.render('/admin/editcategoria', { erros: erros })
  } else {
    Categoria.updateOne({ _id: req.body.id }, { nome: req.body.nome, slug: req.body.slug }).then(() => {
      req.flash('success_msg', 'Categoria editada com sucesso.')
      res.redirect('/admin/categorias')
    }).catch((err) => {
      req.flash('error_msg', 'Erro ao editar categoria.')
      res.redirect('/admin/categorias')
    })
  }
})

// DELETE
router.get('/categorias/delete/:id', (req, res) => {
  Categoria.deleteOne({ _id: req.params.id }).then(() => {
    req.flash('success_msg', 'Categoria removida com sucesso.')
    res.redirect('/admin/categorias')
  }).catch((err) => {
    req.flash('error_msg', 'Erro ao remover categoria.')
    res.redirect('/admin/categorias')
  })
})


module.exports = router