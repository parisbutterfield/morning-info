
var http = require('http');
var path = require('path');

var express = require('express');
var router = express();
var server = http.createServer(router);
var querystring = require('querystring');
var unirest = require('unirest');

var gmapsParams = {
  origins: "", //example Times Square 42nd Street New York, New York
  destinations: "", //204 Varick St, New York, NY 10014

  traffic_model: "best_guess",
  mode: "driving",
  key: "", //google maps api key
  departure_time: "now"
};

var automatic_access_token = '';  //replace th

router.use('/', function(req, res, next) {

  unirest.get('https://api.automatic.com/vehicle/')
    .headers({
      'Authorization': 'Bearer ' + automatic_access_token
    })
    .end(function(automaticResponse) {

      unirest.get('https://maps.googleapis.com/maps/api/distancematrix/json?' + querystring.stringify(gmapsParams))
        .end(function(googleResponse) {
          res.send({
            "frames": [{
              "text": Math.floor(automaticResponse.body.results[0].fuel_level_percent) + "%",
              "icon": "a88"
            }, {
              "text": googleResponse.body.rows[0].elements[0].duration_in_traffic.text,
              "icon": "i130"
            }]
          });


        });

    });

});


server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
  var addr = server.address();
});
