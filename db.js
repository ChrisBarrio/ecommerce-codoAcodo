var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'bfuqtwgapmi7t9kzcub1-mysql.services.clever-cloud.com',
    user     : 'ugk3glycvxd0vv86',
    password : 'IYuwrWGzhewpaYzgp48L',
    database : 'bfuqtwgapmi7t9kzcub1'
});

connection.connect(function (error) {
    if(error) throw error
    console.log("DB online")
});

// connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//     if (error) throw error;
//     console.log('The solution is: ', results[0].solution);
// });

// connection.end();

module.exports = connection