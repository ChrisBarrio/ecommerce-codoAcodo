const express = require('express')
const session = require('express-session')
// var MySQLStore = require('express-mysql-session')(session);
const app = express()
var colors = require('colors')
const hbs = require('hbs')
var path = require('path')
require('./helpers/helpers')


let opciones = {
    host     : 'bfuqtwgapmi7t9kzcub1-mysql.services.clever-cloud.com',
    user     : 'ugk3glycvxd0vv86',
    password : 'IYuwrWGzhewpaYzgp48L',
    port: 3306,
    database : 'bfuqtwgapmi7t9kzcub1'
}

// let sessionStore = new MySQLStore(opciones)

app.use(session({
    // key:'cookie_22007',
    secret:'secretito',
    // store:sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge:300000 } // 5 minutos
}))

// Para que tome los datos de los formulario
app.use(express.json())
app.use(express.urlencoded({
    extended:false
}))

//HBS
app.set('view engine', 'hbs');
app.set('views',[
    path.join('./views/front'),
    path.join('./views/back'),
    path.join('./views'),
])
hbs.registerPartials(__dirname + '/views/partials');

// espacio para cargar archivo de las rutas
app.use('/', require('./routes/rutas'))

// *** 404 - no encontrado *** se coloca siempre a lo ultimo de todas las rutas

app.use(function(req, res) {
    res.status(404).render('404');
});


// Apertura servidor
app.listen(3000, function() { // compruebo que funciona el servidor desde la consola de VSC
    console.log('servidor online en puerto 3000'.green)
})