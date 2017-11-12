const rp = require('request-promise');
const cheerio = require('cheerio');
var mysql = require('mysql');
var schedule = require('node-schedule');

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

const adidas = {
    uri: `https://www.joinhoney.com/shop/adidas?hasOpened=1`,
    transform: function (body) {
        return cheerio.load(body);
    }
};

const nike = {
    uri: `https://www.joinhoney.com/shop/nike?hasOpened=1`,
    transform: function (body) {
        return cheerio.load(body);
    }
};

var adidasText = [];
var adidasCode = [];
var acombinedData = [];
var nikeText = [];
var nikeCode = [];
var ncombinedData = [];
// var j = schedule.scheduleJob('30 * * * *', function(){
//     var date = input.split('/')[1].split('-');
//     console.log(date);
//     var dates = getDates(new Date(2017,9,15), new Date(date[0],date[1] - 1,date[2]));
//     dates.forEach(function(date) {
//         var half = date.toISOString().split('T')[0];
//         console.log(baseUrl + input.split('/')[0] + "/" + half + "/" + input.split('/')[2]);
//         getData(baseUrl + input.split('/')[0] + "/" + half + "/" + input.split('/')[2], caseNumber, input.split('/')[0] + "/" + half + "/" + input.split('/')[2]);
//     })
// });
schedule.scheduleJob('30 * * * * *', () => {
    rp(adidas)
    .then(($) => {
        // delete everything on the table
        connection.query("TRUNCATE adidas_promos", function (err, result) {
            if (err) throw err;
        });

        $('h2').each(function(i, elem) {
            if(i >= 3 && i <= 11) {
                adidasText.push($(this).text());
                // console.log($(this).text());
            }
        });

        j = 0;
        $('button').each(function(i, elem) {
            if(i >= 16 && i % 2 && i <= 16 + (2 * 10)) {
                adidasCode.push($(this).text());
                // console.log($(this).text());
            }
        });



        // organize the data and query
        for(var i = 0; i < adidasText.length; i++) {
            console.log(adidasText[i], ": ", adidasCode[i]);
            acombinedData.push({'id': i + 1, 'text': adidasText[i], 'code': adidasCode[i], 'last_modified': new Date().toISOString().replace(/T/, ' ').split('.')[0]});
            // console.log(acombinedData[i]);

        }

        // put the new data on with modified date.
        var sql = "INSERT INTO adidas_promos (adidas_promo_id, adidas_promo_last_modified, adidas_promo_code, adidas_promo_info) VALUES ?";
        for(var i = 0; i < acombinedData.length; i++) {
            var values = [
                [acombinedData[i].id, acombinedData[i].last_modified, acombinedData[i].code, acombinedData[i].text]
            ];

            connection.query(sql, [values], function (err, result) {
                if (err) throw err;
                console.log('inserted adidas');
            });
        }

    })
    .catch((err) => {
        console.log(err);
    });


    rp(nike)
    .then(($) => {
        connection.query("TRUNCATE nike_promos", function (err, result) {
            if (err) throw err;
        });

        $('h2').each(function(i, elem) {
            if(i >= 3 && i <= 11) {
                nikeText.push($(this).text());
                // console.log($(this).text());
            }
        });

        j = 0;
        $('button').each(function(i, elem) {
            if(i >= 16 && i % 2 && i <= 16 + (2 * 10)) {
                nikeCode.push($(this).text());
                // console.log($(this).text());
            }
        });



        // organize the data and query

        for(var i = 0; i < nikeText.length; i++) {
            console.log(nikeText[i], ": ", nikeCode[i]);
            ncombinedData.push({'id': i + 1, 'text': nikeText[i], 'code': nikeCode[i], 'last_modified': new Date().toISOString().replace(/T/, ' ').split('.')[0]});
            // console.log(ncombinedData[i]);
        }

        // delete everything on the table

        // put the new data on with modified date.
        var sql = "INSERT INTO nike_promos (nike_promo_id, nike_promo_last_modified, nike_promo_code, nike_promo_info) VALUES ?";
        for(var i = 0; i < ncombinedData.length; i++) {
            var values = [
                [ncombinedData[i].id, ncombinedData[i].last_modified, ncombinedData[i].code, ncombinedData[i].text]
            ];

            connection.query(sql, [values], function (err, result) {
                if (err) throw err;
                console.log('inserted nike');
            });
        }
    })
    .catch((err) => {
        console.log(err);
    });
});


/*

CREATE TABLE `phly`.`nike_promos` (
  `nike_promo_id` INT NOT NULL,
  `nike_promo_last_modified` DATETIME NULL,
  `nike_promo_code` VARCHAR(20) NULL,
  `nike_promo_info` VARCHAR(100) NULL,
  PRIMARY KEY (`nike_promo_id`));

*/
