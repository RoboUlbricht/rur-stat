"use strict";

var express = require('express');
var router = express.Router();
var MemoryWatch = require('./lib/memorywatch.js');

var memwatch = new MemoryWatch();
memwatch.start();

router.get('/raw', (req, res) => {
    memwatch.stat(req, res);
});

router.get('/chart', (req, res) => {
    memwatch.chart(req, res);
});

router.get('/', (req, res) => {
    let template = `
    <!DOCTYPE html>
    <html>
      <head>
         <title>Memory usage</title>
         <meta charset="utf-8">
      </head>

      <body>
         <h1>Memory usage</h1>
         <ul>
            <li><a href="./raw">raw</a></li>
            <li><a href="./chart">chart</a></li>
         </ul>
      </body>
    </html>
      `;
        res.send(template);
});

module.exports = router;
