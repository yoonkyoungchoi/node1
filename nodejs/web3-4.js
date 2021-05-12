var express = require('express');
var app = express()
var fs = require('fs');
var template = require('./lib/template.js');

app.get('/', function(req, res) {
    fs.readdir('./data', function(error, filelist){
        
    })

})