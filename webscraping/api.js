var http = require('http');
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'phly.c7jx0v6pormd.us-east-1.rds.amazonaws.com',
  user: 'phly',
  password: 'phlyisthebest',
  port: '3306',
  database : 'phly'
});

connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log("connected to db");
});

var server = http.createServer((req, res)=>{
    res.writeHead(200, {'Content-Type': 'text/plain'});
    var userInput = req.url.split('?')[1];
    console.log('received url:' + req.url);
    console.log('received arg:' + userInput);

    // crawl date from now until the day searched
    pullData(userInput, function(err, data) {
        if(err) console.log(err);



        res.write('{' + JSON.stringify(data) + '}');
        res.end();
    });
}).listen(4000);

var pullData = function (userInput, callback) {
    var brandTable = '';
    if(userInput === 'nike') {
        brandTable = 'nike_promos';
        console.log('nike promos');
    }
    else if(userInput === 'adidas') {
        brandTable = 'adidas_promos';
        console.log('adidas promos');
    }
    var sql = "SELECT * FROM phly.`" + brandTable + "`";
    console.log(sql);
    connection.query(sql, function (err, result) {
        if (err)  callback(err, null);

        else callback(null, result);
    });
}
