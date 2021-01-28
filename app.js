// Carregando módulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
const admin = require('./routes/admin')
const db = require('./config/db')

// Import de Rotas
const postagem = require('./routes/admin/postagem')
const categoria = require('./routes/admin/categoria')
const usuario = require('./routes/admin/usuario')

// Outros
const Postagem = require('./models/Postagem')
const session = require('express-session')
const flash = require('connect-flash')

// Autenticação
const passport = require('passport')
require('./config/auth')(passport)


const app = express()


// Configurações
// Sessão
app.use(session({
  secret: 'projeto_7',
  receive: true,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// Middleware
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  res.locals.user = req.user || null
  next()
})

// Body Parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Handlebars
app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// Mongoose
mongoose.Promise = global.Promise
mongoose.connect(db.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Conectado ao banco')
}).catch((err) => {
  console.log('Erro ao se conectar ao banco: ' + err)
})

// Public
app.use(express.static(path.join(__dirname, 'public')))

// Rotas
app.use('/admin', admin)
app.use('/postagem', postagem)
app.use('/categoria', categoria)
app.use('/usuario', usuario)

app.get('/', (req, res) => {
  Postagem.find().populate('categoria').lean().exec((err, postagens) => {
    if (err) {
      req.flash('error_msg', 'Erro ao carregar postagens')
      res.redirect('/404')
    }
    res.render('index', { postagens: postagens })
  })
})

app.get('/postagem/:slug', (req, res) => {
  Postagem.findOne({ slug: req.params.slug }).populate('categoria').lean().exec((err, postagem) => {
    if (err) {
      req.flash('error_msg', 'Erro ao carregar postagem.')
      res.redirect('/')
    }
    res.render('postagem/index', { postagem: postagem })
  })
})

app.get('/404', (req, res) => {
  res.send('Erro 404!')
})

// Inicializando aplicação
const PORT = process.env.PORT || 8081
app.listen(PORT, () => {
  console.log('Server running at port: ' + PORT + '\nUse URL: http://localhot:8081')
})