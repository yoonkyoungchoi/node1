const fs = require('fs');

const  testFolder = '../data/';

fs.readdir(testFolder, function (err, data){
    console.log(data);
});