const express = require('express')
const app = express()
//const bodyParser = require('body-parser')

//app.use(bodyParser.json())
//app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.urlencoded({
    extended: true
}))

app.use(express.json())

// app.set('view engine', 'ejs');
// app.set('views', 'src/views');

const usuarioRoutes = require('./routes/Usuario')
app.use('/usuario', usuarioRoutes)

// app.get('/', (req, res) => {
//     res.render('home')
// })


app.listen('3000', () => {
    console.log('Servidor rodando na porta 3000')
})