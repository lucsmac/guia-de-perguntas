const express = require('express')
const app = express()

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/perguntar', (req, res) => {
    res.render('perguntar')
})

app.listen(3000, (error) => {
    if (error)
        console.log('Ocorreu um erro ao rodar a aplicação!')
    else 
        console.log('A aplicação rodou corretamente!')
})