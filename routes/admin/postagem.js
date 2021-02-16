const express = require('express')
const PostagemRouter = express.Router()

const Postagem = require('../../models/Postagem')
const Categoria = require('../../models/Categoria')

// Autenticacao
const { eAdmin } = require('../../helpers/eAdmin')

// Listar Postagens
PostagemRouter.get('/', (req, res) => {
  Postagem.find().lean().exec((err, postagens) => {
    if (err) {
      res.redirect('/postagem')
    }
    res.render('admin/postagem/postagens', { postagens: postagens })
  })
})

// Formulário
PostagemRouter.get('/form/:id?', (req, res) => {
  if (req.params.id) {
    Postagem.findOne({ _id: req.params.id }).populate("categoria").lean().exec((err, postagem) => {
      if (err) {
        req.flash('error_msg', 'Postagem não encontrada.')
        res.redirect('/postagem')
      }
      Categoria.find().lean().exec((err, categorias) => {
        if (err) {
          req.flash('error_msg', 'Não foi possível carregar a lista de categorias.')
          res.redirect('/postagem')
        }
        res.render('admin/postagem/form', {
          postagem: postagem,
          categorias: categorias
        })
      })
    })
  } else {
    Categoria.find().lean().exec((err, categorias) => {
      if (err) {
        req.flash('error_msg', 'Erro ao carregar categorias.')
        res.redirect("/postagem")
      }
      res.render('admin/postagem/form', { categorias: categorias })
    })
  }
})

// Ações
// CREATE
PostagemRouter.post('/nova', (req, res) => {
  var erros = []
  if (!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null) {
    erros.push({ texto: 'Título inválido' })
  }
  if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
    erros.push({ texto: 'Slug inválido' })
  }
  if (!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null) {
    erros.push({ texto: 'Descrição inválida' })
  }
  if (!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null) {
    erros.push({ texto: 'Conteúdo inválido' })
  }
  if (req.body.categoria == "0") {
    erros.push({ texto: 'Categoria inválida. Registre uma categoria' })
  }

  if (erros.length > 0) {
    res.render('admin/postagem/form', { erros: erros })
  } else {
    var novaPostagem = {
      titulo: req.body.titulo,
      slug: req.body.slug,
      descricao: req.body.descricao,
      conteudo: req.body.conteudo,
      categoria: req.body.categoria
    }
    Postagem(novaPostagem).save().then(() => {
      req.flash('success_msg', 'Nova postagem enviada com sucesso')
      res.redirect('/postagem')
    }).catch((err) => {
      req.flash('error_msg', 'Erro ao enviar nova postagem. ' + err)
      res.redirect('/postagem')
    })
  }
})

// UPDATE
PostagemRouter.post('/update', (req, res) => {
  Postagem.updateOne({ _id: req.body.id }, {
    titulo: req.body.titulo,
    slug: req.body.slug,
    descricao: req.body.descricao,
    conteudo: req.body.conteudo,
    categoria: req.body.categoria
  }).then(() => {
    req.flash('success_msg', 'Postagem editada com sucesso.')
    res.redirect('/postagem/')
  }).catch((err) => {
    req.flash('error_msg', 'Erro ao editar postagem. ' + err)
    res.redirect('/postagem')
  })
})

// DELETE
PostagemRouter.get('/delete/:id', (req, res) => {
  Postagem.deleteOne({ _id: req.params.id }).then(() => {
    req.flash('success_msg', 'Postagem excluída com sucesso.')
    res.redirect('/postagem')
  }).catch((err) => {
    req.flash('error_msg', 'Erro ao excluir postagem.')
    res.redirect('postagem')
  })
})

module.exports = PostagemRouter