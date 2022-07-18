var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'codo-a-codo-2022'
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