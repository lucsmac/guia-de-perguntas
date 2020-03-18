const express = require('express')
const bodyParser = require('body-parser')
const connection = require('./database/database')
const Pergunta = require('./database/Pergunta')
const Resposta = require('./database/Resposta')

const app = express()

connection
    .authenticate()
    .then(() => {
        console.log('Banco de dados conectado com sucesso!')
    })
    .catch((err) => {
        console.log(err)
    })

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    Pergunta.findAll({ raw: true, order: [['id', 'DESC']] })
        .then((perguntas) => {
            res.render('index', { perguntas })
        })
})

app.get('/perguntar', (req, res) => {
    res.render('perguntar')
})

app.post('/salvarpergunta', (req, res) => {
    const { titulo } = req.body
    const { desc } = req.body

    Pergunta.create({ titulo, desc })
        .then(() => {
            res.redirect('/')
        })
})

app.get('/pergunta/:id', (req, res) => {
    const { id } = req.params
    Pergunta.findOne({
        where: { id }
    }).then((pergunta) => {
        if(pergunta) {

            Resposta.findAll({
                where: { perguntaID: pergunta.id },
                order: [ ['id', 'DESC'] ]
            }).then((respostas) => {
                res.render('pergunta', { pergunta, respostas })
            })
        } else {
            res.redirect('/')
        }
    })
})

app.post('/responder', (req, res) => {
    const { corpo } = req.body
    const { perguntaID } = req.body

    Resposta.create({ corpo, perguntaID })
    .then(() => {
        res.redirect('/pergunta/' + perguntaID)
    })
})

app.listen(3000, (error) => {
    if (error)
        console.log('Ocorreu um erro ao rodar a aplicação!')
    else 
        console.log('A aplicação rodou corretamente!')
})