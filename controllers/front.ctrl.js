// const datos = require('../productos.json') //Este archivo se crea desde phpMyadmin
let nodemailer = require('nodemailer')
let db = require('../db')

const inicioGet = function (req, res) {
    // res.render('index', {
    //     productos:datos[2].data
    // })
    let sql = 'SELECT * FROM productos'
    db.query(sql, function(error, data) {
        if (error) res.send(`Ocurrio un error ${error.code}`)
        // console.log(data)
        res.render('index', {
            titulo:"Mi emprendimiento",
            productos: data
        })
    })


}

const contactoGet = function(req, res) {
    res.render('contacto')
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
        to: 'chbwdeveloper@gmail.com',
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
    res.render('como-comprar')
}

const detalleProductoGet_ID = function(req, res) {
    let id = req.params.id

    let sql = "SELECT * FROM productos WHERE id = ?"
    db.query(sql, id, function (err, data) {
        console.log("DATA -->", data)
        if(err) res.send(`Ocurrio un error ${err.code}`)

        if(data == '') {
            res.status(404).render("404", {
                titulo:"404 - Pagina no encontrada",
                mensaje:`Producto con ID ${id} no existe`
            })
        } else {
            res.render('detalle-producto', {
                producto: data[0]
            })
        }
    })

    res.render('detalle-producto')
}

const  quienesSomosGet = function(req, res) {
    res.render('quienes-somos')
}

module.exports = {
    inicioGet,
    contactoGet,
    contactoPost,
    comoComprarGet,
    detalleProductoGet_ID,
    quienesSomosGet,
}
