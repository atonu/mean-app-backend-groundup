const mongoose = require('mongoose');

var Employee = mongoose.model('Employee', {
    name: {type: String},
    position: {type: String},
    office: {type: String},
    salary: {type: String},
});
// var Employee = mongoose.Schema('Employee', {
//     name: {type: String},
//     position: {type: String},
//     office: {type: String},
//     salary: {type: String},
// });

// mongoose.model('Employee', Employee)
module.exports = {Employee};
