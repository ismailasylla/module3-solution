const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
//const passport = require('passport');


const router = express.Router();
//load user model 
require('../models/User');
const User = mongoose.model('users');

require('../models/Idea');
const Idea = mongoose.model('ideas');



//user login route 
router.get('/login', (req, res) => {
    res.render('users/login');
});

//user registering route
router.get('/register', (req, res) => {
    res.render('users/register');
});


//register users 
router.post('/register', (req, res) => {
    let errors = [];
    if (req.body.password != req.body.password2) {
        errors.push({ text: 'passwords do not match' });
    }

    if (req.body.password.length < 4) {
        errors.push({ text: 'password must be at least 4 characters' })
    }

    if (errors.length > 0) {
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2

        });
    } else {
        User.findOne({ email: req.body.email })
            .then(user => {
                if (user) {
                    req.flash('error_msg', 'This email is already in use ');
                    res.redirect('/users/register')

                } else {
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password,
                        password2: req.body.password2
                    })
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are Now Registered You can Now logIn');
                                    res.redirect('/users/login');
                                })
                                .catch(err => {
                                    console.log(err);
                                    return;
                                });
                        });
                    });

                }
            });


    }
});

module.exports = router;