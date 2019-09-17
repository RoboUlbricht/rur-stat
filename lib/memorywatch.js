"use strict";

var express = require('express');
var router = express.Router();

class MemoryWatch {

    constructor() {
        this.data = [];
        this.tm = undefined;
    }

    start() {
        if (this.tm)
            return;
        this.tm = setInterval(this.tick, 1000, this);
    }

    stop() {
        if (this.tm)
            clearInterval(this.tm);
        this.tm = undefined;
    }

    tick(self) {
        let used = process.memoryUsage();
        if (self.data.length > 60)
            self.data.shift();
        self.data.push(used.heapUsed);
    }

    stat(req, res) {
        let cdata = this.data.slice();
        if (req.query.format) {
            switch (req.query.format) {
                case 'KB':
                    cdata.forEach((value, index) => {
                        cdata[index] = parseFloat((value / 1024).toFixed(2));
                    });
                case 'MB':
                    cdata.forEach((value, index) => {
                        cdata[index] = parseFloat((value / 1024 / 1024).toFixed(2));
                    });
            }
        }
        res.json(cdata);
    }

    chart(req, res) {
        let cdata = this.data.slice();
        cdata.forEach((value, index) => {
            cdata[index] = [String(index), parseFloat((value / 1024 / 1024).toFixed(2))];
        });
        cdata.unshift(['index', 'value']);
        let template = `
    <!DOCTYPE html>
    <html>
      <head>
         <title>Memory usage</title>
         <meta http-equiv="refresh" content="30">
         <meta charset="utf-8">
         <script type = "text/javascript" src = "https://www.gstatic.com/charts/loader.js">
         </script>
         <script type = "text/javascript">
            google.charts.load('current', {packages: ['corechart']});
         </script>
      </head>

      <body>
         <div id = "container" style = "width: 1024px; height: 400px; margin: 0 auto">
         </div>
         <script language = "JavaScript">
            function drawChart() {
               // Define the chart to be drawn.
               var data = google.visualization.arrayToDataTable(${JSON.stringify(cdata)});

               var options = {title: 'Memory usage (in MB)'};

               // Instantiate and draw the chart.
               var chart = new google.visualization.ColumnChart(document.getElementById('container'));
               chart.draw(data, options);
            }
            google.charts.setOnLoadCallback(drawChart);
         </script>
      </body>
    </html>
      `;
        res.send(template);
    }
}

module.exports = MemoryWatch;
