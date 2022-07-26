const axios = require('axios');
const { parse } = require('dotenv');
const { text } = require('express');
const multer = require('multer');
const hbs = require('hbs')
const { format } = require('../db');

//Calculo del dolar
let dolar; // no const 😂
let dolarPais;
axios.get('https://www.dolarsi.com/api/api.php?type=valoresprincipales')//esto equivale a fetch
    .then(function(respuesta){ //obtenemos dolar de la Api
        dolar = respuesta.data[0].casa.venta // '134.88'
        dolar = dolar.replace(/,/g, ".") // reemplazo ',' por '.'
        dolar = parseFloat(dolar) // paso de string a float
        // console.log(dolar)
    })
    .then(function(){ // agrega impuestos y percepciones
        const impuestoPais = 0.30;
        const percepcionAfip = 0.45;
        dolarPais = (dolar * impuestoPais) + (dolar * percepcionAfip) + dolar
        // console.log(dolarPais)
        return dolarPais
    })
    .catch(function(){
        //manejamos el error
        console.log('error axios', error)
    })
    

hbs.registerHelper('dolarApeso', function(precio){
    let precioFinalARS = dolarPais * precio
    // console.log(precioFinalARS)
    return new Intl.NumberFormat('es-AR',{style:'currency',currency: 'ARS'}).format(precioFinalARS)

})

hbs.registerHelper('listado', function(texto){
    let array = texto.split(',')
    
    html= `<ul class="my-3 text-secondary">`
    
    for (let item of array) {
        html = `${html} <li>${item}</li>`
    } 
    
    return html + '</ul>'
})

//FUNCION: subida de imagen

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.cwd()+'/uploads/')
    },
    filename: (req, file, cb) => {
        console.log("OBJETO FILE", file)
        let nombreArchivo =file.originalname.split('.')[0]
        let fileExtension =file.originalname.split('.')[1]
        cb(null, nombreArchivo + '-' + Date.now() + "." + fileExtension)
    },
})

var maxSize = (1024*1024) * 5 // 5MB
var maxSizeMB = formatBytes(maxSize,2)

// FUNCION: tamano de archivo
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024
    const dm = decimals < 0 ? 0 :decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', ' ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm) + ' '+ sizes[i]);
}

// FUNCION: 
var upload = multer({
    storage:storage,
    limits: {
        fileSize: maxSize
    },
    fileFilter:(req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb (new Error('Solo los formatos .png, .jpg y .jpeg son los permitidos'));
        }
    }

}).single("rutaImagen")

module.exports = {
    upload,
    maxSizeMB,
    multer
}