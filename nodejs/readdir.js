const fs = require('fs');

const  testFolder = '../data/';

//파일 읽기
fs.readdir(testFolder, function (err, data){
    console.log(data);
});