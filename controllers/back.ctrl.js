const adminGet = function(req, res) {
    res.render('admin')
}

const agregarProductoGet = function(req, res) {
    res.render('agregar-producto')
}

const editarProductoGet = function(req, res) {
    res.render('editar-producto')
}

const loginGet = function(req, res) {
    res.render('login')
}

module.exports = {
    adminGet,
    agregarProductoGet,
    editarProductoGet,
    loginGet
}