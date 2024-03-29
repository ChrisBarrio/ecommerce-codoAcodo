let db = require('../db')
const fs = require('fs');
const { upload, maxSizeMB, multer } = require('../helpers/helpers.js')


const adminGet = function(req, res) {

    if (req.session.logueado) {
        let sql = "SELECT * FROM productos"
        db.query(sql, function(err, data){
            if (err) throw err;

        console.log("usuario", req.session)
        res.render('admin', {
            titulo: 'Panel de control',
            logueado:req.session.logueado,
            usuario:req.session.usuario,
            productos: data
        })
    })    
    } else {
        res.render('login', {titulo:'Login', error: 'Por favor loguearse para ver esta pagina.'})
    }


    
}
//producto GET
const agregarProductoGet = function(req, res) {
    
    if (req.session.logueado) {
        res.render('agregar-producto',{
            titulo:"Agregar producto",
            logueado:req.session.logueado,
            usuario:req.session.usuario,
        })
    } else {
        res.render('login', {titulo:'Login', error: 'Por favor loguearse para ver esta pagina.'})
    }
    
    
}
//producto POST
const agregarProductoPost = function(req, res) {
    console.log("datos form -->", req.body)

    upload(req, res, function (err) {
        // Manejo de ERRORES de multer
        if (err instanceof multer.MulterError){
            // Error de Multer al subir imagen
            if(err.code === "LIMIT_FILE_SIZE") {
                return res.status(400).render('agregar-producto', { mensaje: `Imagen muy grande, por favor achicar a ${maxsizeMB}`, clase: danger})
            }
            return res.status(400).render('agregar-producto', { mensaje:err.code, clase: danger})
        } else if (err) {
            // Ocurrio un error desconocido al subir la imagen
            return res.status(400).render('agregar-producto', {mensaje:err, clase: danger})
        }

        // SI TODO OK
        let detalleProducto = req.body
        console.log("REQ.FILE -->", req.file)
        const nombreImagen = req.file.filename; // Tomo el nombre del archivo de la imagen
        console.log("DETALLE (ANTES) -->", detalleProducto)
        detalleProducto.rutaImagen = nombreImagen
        console.log("DETALLE (DESPUES) -->", detalleProducto)

        let sql = "INSERT INTO productos SET ?"
        db.query(sql, detalleProducto, function (err, data) {
            console.log(data)
            if (err) throw err;
            console.log("Producto agregado correctamente ")

        })
        res.render("agregar-producto", {
            mensaje: "Producto agregado correctamente",
            clase: "success",
            titulo: "Agregar producto"
        })
    }) 


}

//Editar GET ID
const editarProductoGet = function(req, res) {
    
    if (req.session.logueado) {
        let id = req.params.id
        let sql = "SELECT * FROM productos WHERE id = ?"
        db.query(sql, id, function (err, data) {
            if (err) throw err;

            if(data == '') {
                res.status(404).render("404", {
                    titulo:"404 - Pagina no encontrada",
                    mensaje:`Producto con ID ${id} no existe`
                })
            } else {
                res.render('editar-producto', {
                    titulo:`Editando ${data[0].nombre}`,
                    producto: data[0],
                    logueado:req.session.logueado,
                    usuario:req.session.usuario,
                })
            }
        })
    } else {
        res.render('login', {titulo:'Login', error: 'Por favor loguearse para ver esta pagina.'})
    }

}

//Editar POST ID
const editarProductoPost = function(req, res) {

    upload(req, res, function (err) {
        // Manejo de ERRORES de multer
        if (err instanceof multer.MulterError){
            // Error de Multer al subir imagen
            if(err.code === "LIMIT_FILE_SIZE") {
                return res.status(400).render('agregar-producto', { mensaje: `Imagen muy grande, por favor achicar a ${maxsizeMB}`, clase: 'danger'})
            }
            return res.status(400).render('agregar-producto', { mensaje:err.code, clase: 'danger'})
        } else if (err) {
            //Ocurrio un error desconocido al subir la imagen
            return res.status(400).render('agregar-producto', {mensaje:err, clase: 'danger'})
        }

        let id = req.params.id // parametro ID de la url
        let detalleProducto = req.body // datos del formulario

        // chequear si la edicion incluyo cambio de imagen
        if (req.hasOwnProperty("file")){ //Si se subio una imagen entonces multer adjunto la propiedad "file"
            const nombreImagen = req.file.filename; 
            detalleProducto.rutaImagen = nombreImagen

            //
            let borrarImagen = 'SELECT rutaImagen FROM productos WHERE id =?';
            db.query(borrarImagen, id, function (err, data) {
                if (err) throw err

                console.log("Imagen a borrar", data[0].rutaImagen)
                fs.unlink(`./public/uploads/${data[0].rutaImagen}`, function (err) {
                    if (err) throw err

                    // Una vez borrada la imagen se procede a actualizar el registro de la BD
                    let sql = "UPDATE productos SET ? WHERE id= ?"
                    db.query(sql, [detalleProducto, id], function (err, data) {
                        if (err) throw err;
                        console.log( data.affectedRows + "registro(s) actualizado(s)")
                    })
                })
            })
        } 

        let sql = "UPDATE productos SET ? WHERE id= ?"
        db.query(sql, [detalleProducto, id], function (err, data) {
            if (err) throw err;
            console.log( data.affectedRows + "registro actualizado")
        })

        res.redirect("/admin")

    })


    //-------------------------

    
}
//Borrar ID
const borrarGet = function(req, res) {
    
    if (req.session.logueado) {
        let id = req.params.id

        let sql = "DELETE FROM productos WHERE id = ?"
        db.query(sql, id, function(err, data){
            if (err) throw err;
            console.log(data.affectedRows + " registro borrado correctamente")
        })

        res.redirect("/admin"
            // mensaje:'Producto BORRADO correctamente'
        )
    } else {
        res.render('login', {titulo:'Login', error: 'Por favor loguearse para ver esta pagina.'})
    }
    
    
}

const loginGet = function(req, res) {
    res.render('login')
}

const loginPost = function(req, res) {
    
    let usuario = req.body.username
    let clave = req.body.password

    if (usuario && clave) {
        //ingresa usu y contras
        let sql = "SELECT * FROM cuentas WHERE email = ? AND clave = ?"
        db.query(sql, [usuario, clave], function(err, data) {
            console.log("DATA", data)
            if (data.length) {
                // usuario y contrasena ok
                req.session.logueado = true
                req.session.usuario = usuario
                res.redirect('/admin')
            } else {
                //error en login
                res.render('login', {
                    titulo: "Login",
                    error:"Nombre de usuario o contrasena incorrecto"
                })
            }
        })
    } else {
        //no escribe usu y contrasena
        res.render('login', {
            titulo: 'Login',
            error: 'Por favor escriba un nombre de usuario y una contrasena.'
        })
    }
}

const logout = function(req, res) {
    

    req.session.destroy(function(err) {
        console.log(err)
    })

    let sql = 'SELECT * FROM productos'
    db.query(sql, function(error, data) {
        if (err) throw err;
        // console.log(data)
        res.render('index', {
            titulo:"Mi emprendimiento",
            productos: data
        })
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
    loginPost,
    logout,
}