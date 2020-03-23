var request = require('request')

request.post('http://ec2-3-21-37-105.us-east-2.compute.amazonaws.com:8000', {
    json: {
        name: 'kang',
        todo: 'buy'
    }
}, (error, res, body) => {
    if (error) {
        console.error(error);
        return;
    }
    console.log(`statusCode: ${res.statusCode}`);
    console.log(body);
});