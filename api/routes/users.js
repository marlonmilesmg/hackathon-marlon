const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user');

router.get('/', (req, res, next) => {
    User.find()
    .select('username password _id')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            users: docs
        }
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.post('/', (req, res, next) => {
    const user = new User ({
        _id: new mongoose.Types.ObjectId(),
        username: req.body.username,
        password: req.body.password
    });
    user.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Handling POST requests to /users',
            createdUser: user
        }); 
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
    
});

router.get('/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.findById(id)
    .select('username password _id')
    .exec()
    .then(doc => {
        console.log("From database", doc);
        if (doc) {
            res.status(200).json(doc);
        } else {
            res.status(404).json({message: "No valid entry found for provided ID"});
        }  
    }) 
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.patch('/:userId', (req, res, next) => {
    const id = req.params.userId;
    const updateOps ={};  
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    } 
    User.update({ _id: id}, { $set: updateOps })
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err  
        });
    });
});

router.delete('/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.remove({ _id: id})
    .exec()
    .then(result => {
        res.status(200).json(result);
    })  
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;


