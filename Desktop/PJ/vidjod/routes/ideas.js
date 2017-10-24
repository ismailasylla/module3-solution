const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

module.exports = router;

//load the idea model
require('../models/Idea');
const Idea = mongoose.model('ideas');

//idea index page 
router.get('/', (req, res) => {
    Idea.find({})
        .sort({ date: 'desc' })
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            });
        });
});

//add idea form
router.get('/add', (req, res) => {
    res.render('ideas/add');
});


//edit idea form
router.get('/edit/:id', (req, res) => {
    Idea.findOne({
            _id: req.params.id
        })
        .then(idea => {
            res.render('ideas/edit', {
                idea: idea
            });
        });
});



//process form
router.post('/', (req, res) => {
    let errors = [];

    if (!req.body.title) {
        errors.push({ text: 'Please add a title' });

    }
    if (!req.body.details) {
        errors.push({ text: 'Please add a details ' });

    }

    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });

    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }
        new Idea(newUser)
            .save()
            .then(idea => {
                req.flash('success_msg', 'New Note Added');
                res.redirect('/ideas');
            })
    }

});

//Edit form process and updates
router.put('/:id', (req, res) => {
    Idea.findOne({
            _id: req.params.id
        })
        .then(idea => {
            // new values 
            idea.title = req.body.title;
            idea.details = req.body.details;

            idea.save()
                .then(idea => {
                    res.redirect('/ideas');
                })

        });
});

//delete idea 
router.delete('/:id', (req, res) => {
    Idea.remove({ _id: req.params.id })
        .then(() => {
            req.flash('success_msg', 'Idea removed');
            res.redirect('/ideas');
        });
});