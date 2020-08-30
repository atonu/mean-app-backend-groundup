const express = require('express');
const ObjectId = require('mongoose').Types.ObjectId;
var router = express.Router();
const cors = require('cors');
let middleware = require('./Middlewares');

var {Employee} = require('../models/employee');

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");

    res.header(
        'Access-Control-Expose-Headers',
        'x-access-token, x-refresh-token'
    );
    next();
});

router.get('/',middleware.authenticate,cors(), (req, res) => {
    Employee.find((err, docs) => {
        if (!err) {
            res.send(docs);
        } else {
            console.log('Error:' + JSON.stringify(err, undefined, 2));
        }
    });
});

router.get('/:id',cors(), (req, res) => {

    if (!ObjectId.isValid(req.param.id)) {
        console.log(`Invalid id ${req.params.id}`);
        // return res.status(400).send(`No record with ID: ${req.params.id}`);
    }

    Employee.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.send(doc)
        } else {
            console.log('Error getting employee:' + JSON.stringify(err, undefined, 2));
        }
    })
});

router.post('/',cors(), (req, res) => {
    var emp = new Employee({
        name: req.body.name,
        position: req.body.position,
        office: req.body.office,
        salary: req.body.salary,
    });
    emp.save((err, doc) => {
        if (!err) {
            res.send(doc)
        } else {
            console.log('Error: ' + JSON.stringify(err, undefined, 2))
        }
    });
});

router.put('/:id',cors(), (req, res) => {
    if (!ObjectId.isValid(req.param.id)) {
        console.log(`Invalid id ${req.params.id}`);
        // return res.status(400).send(`No record with ID: ${req.params.id}`);
    }

    var emp = {
        name: req.body.name,
        position: req.body.position,
        office: req.body.office,
        salary: req.body.salary,
    };
    Employee.findByIdAndUpdate(req.params.id, {$set: emp}, {new: true}, (err, doc) => {
        if (!err) {
            res.send(doc)
        } else {
            console.log('Error: ' + JSON.stringify(err, undefined, 2))
        }
    });
});

router.delete('/:id',cors(), (req, res) => {
    if (!ObjectId.isValid(req.param.id)) {
        console.log(`Invalid id ${req.params.id}`);
        // return res.status(400).send(`No record with ID: ${req.params.id}`);
    }

    Employee.findByIdAndDelete(req.params.id, (err, doc) => {
        if (!err) {
            res.send(doc)
        } else {
            console.log('Error: ' + JSON.stringify(err, undefined, 2))
        }
    });
});

module.exports.saveEmployee = function (name) {
    let emp = new Employee({
        name: name
    });
    emp.save().then((doc) => {
        console.log('------------------------------------------------')
        console.log(doc);
    }).catch((err) => {
        console.log('------------------------------------------------')
        console.log(err);
    });
};

module.exports = router;
