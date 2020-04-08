var express = require('express');
var app = express();
var port = 8000;

var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'me',
    password: '1234',
    database: 'mydb'
});
connection.connect();

function insert_sensor(device, temp, seq, time) {
    obj = {};
    obj.device = device;
    obj.temp = temp;
    obj.seq = seq;
    obj.time = time;

    var query = connection.query('insert into temps set ?', obj, function(err, rows, cols) {
        if (err)
            throw err;
        console.log("database insertion ok = %j", obj);
    });
}

app.get('/input', function (req, res) {
    var time = moment().format('YYYY-MM-DD HH:mm:ss');
    var r = req.query;

    console.log("GET %j", r);
    insert_sensor(r.device_id, r.temperature_value, r.sequence_number, time);

    res.set('Content-Type', 'application/json');
    res.json({"device_id": r.device_id, "status": "ok", "time": time});
});

app.get('/dump', function (req, res) {
    var r = req.query;
    console.log(r);
    res.send(JSON.stringify(r));
});

var server = app.listen(port, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('listening at http://%s:%s', host, port);
});