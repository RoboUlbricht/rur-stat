var express = require('express');
var app = express();

var statmodule = require('../index.js');

// http://127.0.0.1:8080/test/
// http://127.0.0.1:8080/test/raw
// http://127.0.0.1:8080/test/chart
app.use('/test', statmodule);

var server = app.listen(8080, function () {
    console.log('Node server is running..');
});
