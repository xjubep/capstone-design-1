// http://localhost:8080/data

var express = require('express');
var app = express();

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'me',
    password: '1234',
    database: 'mydb'
});
connection.connect();

app.get('/data', function(req, res) {
    console.log('params = ' + req.query);

    var qstr = 'select * from sensor ';
    connection.query(qstr, function(err, rows, cols) {
        if (err) {
            throw err;
            res.send('query error: ' + qstr);
            return;
        }

        console.log('Got ' + rows.length + ' records');
        html = "";
        for (var i = 0; i < rows.length; i++)
            html += JSON.stringify(rows[i]);
        res.send(html);
    });
});

var server = app.listen(8080, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('listening at http://%s:%s', host, port);
});