// http://localhost:8080/graph

var express = require('express');
var app = express();
var fs = require('fs');

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'me',
    password: '1234',
    database: 'mydb'
});
connection.connect();

app.get('/graph', function(req, res) {
    console.log('got app.get(graph)');
    var html = fs.readFile('./graph.html', function(err, html) {
        html = " " + html;
        console.log('read file');

        var qstr = 'select * from weather';
        connection.query(qstr, function(err, rows, cols) {
            if (err)
                throw err;

            var data = "";
            var comma = "";
            for (var i = 0; i < rows.length; i++) {
                r = rows[i];
                d = Date.parse(r.time) - 9 * 60 * 60 * 1000;
                data += comma + "[new Date(" + d + ")," + r.temp + "]";
                comma = ",";
            }

            var header = "data.addColumn('datetime', 'Date/Time');"
            header += "data.addColumn('number', 'Temp');"
            html = html.replace("<%HEADER%>", header);
            html = html.replace("<%DATA%>", data);

            res.writeHeader(200, {"Content-Type": "text/html"});
            res.write(html);
            res.end();            
        });
    });
});

var server = app.listen(8080, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('listening at http://%s:%s', host, port);
});