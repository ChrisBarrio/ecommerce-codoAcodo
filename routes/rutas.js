const {Router} = require('express')
const router = Router()


// ***FRONT ***
const {
    inicioGet,
    contactoGet,
    contactoPost,
    comoComprarGet,
    detalleProductoGet,
    quienesSomosGet,
    detalleProductoGet_ID
} = require('../controllers/front.ctrl')


//ruta raiz
router.get('/',inicioGet)

router.get('/contacto', contactoGet )

router.post('/contacto', contactoPost)

router.get('/como-comprar', comoComprarGet)

router.get('/detalle-producto/:id', detalleProductoGet_ID)

router.get('/quienes-somos', quienesSomosGet)


// *** BACK (ADMIN) ***

const {
    adminGet,
    agregarProductoGet,
    agregarProductoPost,
    editarProductoGet,
    editarProductoPost,
    borrarGet,
    loginGet,
} = require('../controllers/back.ctrl')

router.get('/admin', adminGet )

router.get('/agregar-producto', agregarProductoGet )
router.post('/agregar-producto-post', agregarProductoPost )

router.get('/editar-producto/:id', editarProductoGet)
router.post('/editar-producto/:id', editarProductoPost)

router.get('/borrar-producto/:id', borrarGet)

router.get('/login', loginGet)

//exportamos router
module.exports = router;