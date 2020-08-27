const express = require('express');
const ObjectId = require('mongoose').Types.ObjectId;
var router = express.Router();
// const cors = require('cors');

var {Employee} = require('../models/employee');


router.get('/', (req, res) => {
    Employee.find((err, docs) => {
        if (!err) {
            res.send(docs);
        } else {
            console.log('Error:' + JSON.stringify(err, undefined, 2));
        }
    });
});

router.get('/:id', (req, res) => {

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

router.post('/', (req, res) => {
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

router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
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

module.exports = router;
