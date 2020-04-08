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
    var qstr = 'select * from temps ';

    if (Object.keys(r.device_id).length != 0)
        qstr += 'where device=' + r.device_id;

    connection.query(qstr, function(err, rows, cols) {
        if (err) {
            throw err;
            res.send('query error: ' + qstr);
            return;
        }

        console.log('Got ' + rows.length + ' records');
       
	var jsonList = new Array();
	for (var i = 0; i < rows.length; i++) {
	    	var data = new Object();
		data.temp = rows[i]['temp'];
		data.sequence_number = rows[i]['seq'];
		data.device_id = rows[i]['device'];
		data.time = rows[i]['time'];
		jsonList.push(data);
	}
	    //var jsonData = JSON.stringify(jsonList);
	    res.set('Content-Type', 'application/json');
	    res.json(jsonList);
	    //res.send(jsonData);
    });
});

var server = app.listen(port, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('listening at http://%s:%s', host, port);
});
