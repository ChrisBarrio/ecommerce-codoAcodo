let db = require('../db')

const adminGet = function(req, res) {

    let sql = "SELECT * FROM productos"
    db.query(sql, function(err, data){
        if (err) res.send(`Ocurrio un error ${err.code}`)

        res.render('admin', {
            titulo: 'Panel de control',
            productos: data,
        })
    })
}
//producto GET
const agregarProductoGet = function(req, res) {
    res.render('agregar-producto',{
        titulo:"Agregar producto"
    })
}
//producto POST
const agregarProductoPost = function(req, res) {
    // console.log("datos form -->", req.body)
    const detalleProducto = req.body
    
    let sql = "INSERT INTO productos SET ?"
    db.query(sql, detalleProducto, function(err, data) {
        if (err) res.send(`Ocurrio un error ${err.code}`)
        // console.log("producto agregado correctamente")
        
        res.render('agregar-producto', {
            titulo:"Agregar producto",
            mensaje:"Producto agregado correctamente ✅",
        })
    })
}

//Editar GET ID
const editarProductoGet = function(req, res) {
    // res.render('editar-producto')
    let id = req.params.id
    let sql = "SELECT * FROM productos WHERE id = ?"
    db.query(sql, id, function (err, data) {
        if(err) res.send(`Ocurrio un error ${err.code}`)

        if(data == '') {
            res.status(404).render("404", {
                titulo:"404 - Pagina no encontrada",
                mensaje:`Producto con ID ${id} no existe`
            })
        } else {
            res.render('editar-producto', {
                producto: data[0]
            })
        }
    })
}

//Editar POST ID
const editarProductoPost = function(req, res) {
    let id = req.params.id
    let detalleProducto = req.body

    let sql = "UPDATE productos SET ? WHERE id = ?"
    db.query(sql, [detalleProducto, id], function(err, data){
        if (err) res.send(`Ocurrio un error ${err.code}`)
        console.log(data.affectedRows + " registro actualizado correctamente")
    })

    res.redirect("/admin"
        // mensaje:'Producto EDITADO correctamente'
    )
}
//Borrar ID
const borrarGet = function(req, res) {
    let id = req.params.id

    let sql = "DELETE FROM productos WHERE id = ?"
    db.query(sql, id, function(err, data){
        if (err) res.send(`Ocurrio un error ${err.code}`)
        console.log(data.affectedRows + " registro borrado correctamente")
    })

    res.redirect("/admin"
        // mensaje:'Producto BORRADO correctamente'
    )
}

const loginGet = function(req, res) {
    res.render('login')
}

const loginPost = function(req, res) {
    
    let usuario = req.body.username
    let clave = req.body.password

    let sql = "SELECT * FROM cuentas WHERE email = ? AND clave = ?"
    db.query(sql, [usuario, clave], function(err, data) {
        console.log("DATA", data)
        if (data.length > 0) {
            // ok
            res.redirect('/admin')
        } else {
            //error
            res.render('login', {
                titulo: "Login",
                error:"Nombre de usuario o contrasena incorrecto"
            })
        }
    })
}

module.exports = {
    adminGet,
    agregarProductoGet,
    agregarProductoPost,
    editarProductoGet,
    editarProductoPost,
    borrarGet,
    loginGet,
    loginPost
}