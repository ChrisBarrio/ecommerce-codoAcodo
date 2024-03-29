// const datos = require('../productos.json') //Este archivo se crea desde phpMyadmin
let nodemailer = require('nodemailer')
let db = require('../db')

const inicioGet = function (req, res) {
    
    // console.log('antes',req.session.contador)
    // req.session.contador = req.session.contador ? req.session.contador + 1 : 1;
    // console.log('despues',req.session.contador)
    
    // res.send()
    let sql = 'SELECT * FROM productos'
    db.query(sql, function(err, data) {
        if (err) throw err;
        // console.log(data)
        res.render('index', {
            titulo:"Mi emprendimiento",
            logueado:req.session.logueado,
            usuario:req.session.usuario,
            productos: data
        })
    })


}

const contactoGet = function(req, res) {
    res.render('contacto', {
        titulo:'Contacto',
        logueado:req.session.logueado,
        usuario:req.session.usuario,
    })
}

const contactoPost = function(req, res) {
    //1. definir transportador
    let transporter = nodemailer.createTransport({
        service:'Gmail',
        auth: {
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS,
        }
    })
    //2.definimos el cuerpo del email
    console.log('BODY: ', req.body)
    let data = req.body
    let mailOptions = {
        from: data.nombre,
        to: process.env.EMAIL_USER,
        subject: data.asunto,
        text:data.mensaje
    }
    //3.Enviamos el mail
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error)
            res.status(500, error.message)
            res.status(500).render('contacto',{
                mensaje: `Ha ocurrido el siguiente error: ${error.mensaje}`
            })
        } else {
            console.log('e-mail enviado')
            res.status(200).render('contacto', {
                mensaje: `
                Tu email se ha enviado correctamente
                `
            })
        }
    })
}

const comoComprarGet = function(req, res) {
    res.render('como-comprar',{
        titulo:'Como comprar',
        logueado:req.session.logueado,
        usuario:req.session.usuario,
    })
}

const detalleProductoGet_ID = function(req, res) {
    let id = req.params.id

    let sql = "SELECT * FROM productos WHERE id = ?"
    db.query(sql, id, function (err, data) {
        // console.log("DATA -->", data)
        if(err) res.send(`Ocurrio un error ${err.code}`)

        if(data == '') {
            res.status(404).render("404", {
                titulo:"404 - Pagina no encontrada",
                mensaje:`Producto con ID ${id} no existe`
            })
        } else {
            res.render('detalle-producto', {
                titulo:`Detalle del producto ${data[0].nombre}`,
                producto: data[0],
                logueado:req.session.logueado,
                usuario:req.session.usuario,
            })
        }
    })

    // res.render('detalle-producto') << esta linea daba error porque en linea 81 ya se estaba renderizando
}

const  quienesSomosGet = function(req, res) {
    res.render('quienes-somos',{
        titulo: 'Quienes somos',
        logueado:req.session.logueado,
        usuario:req.session.usuario,
    })
}

module.exports = {
    inicioGet,
    contactoGet,
    contactoPost,
    comoComprarGet,
    detalleProductoGet_ID,
    quienesSomosGet,
}
