const axios = require('axios')
const hbs = require('hbs')

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
        const percepcionAfip = 0.35;
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