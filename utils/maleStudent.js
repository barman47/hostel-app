const fs = require('fs');

var hostels = {
    "blockA": 0,
    "blockB": 0,
    "blockC": 0,
    "blockD": 0
}

for (var x in hostels) {
    console.log(x.prop);
}

// console.log(hostels);

// fs.writeFileSync(`${__dirname}/hostels.txt`, hostels, (err) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log('Sucessfully written to file');
//     }
// });