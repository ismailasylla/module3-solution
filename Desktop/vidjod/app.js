const express = require('express');
const exphbs = require('express-handlebars');
const hbs = require('hbs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

//Map global promise -get rid of warning
mongoose.Promise = global.Promise;

//connect to mongoose
mongoose.connect('mongodb://localhost:27017/webjob-dev', {
        useMongoClient: true
    })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

//load the idea model
require('./models/Idea');
const Idea = mongoose.model('ideas');




//handlebars Middlewares 
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//Body parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


//index Route
app.get('/', (req, res) => {
    const title = "Welcome";
    res.render('index', {
        title: title
    });
});

app.get('/about', (req, res) => {
    res.render('about');
});

//idea index page 
app.get('/ideas', (req, res) => {
    Idea.find({})
        .sort({ date: 'desc' })
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            });
        });
});

//add idea form
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});


//edit idea form
app.get('/ideas/edit/:id', (req, res) => {
    Idea.findOne({
            _id: req.params.id
        })
        .then(idea => {
            res.render('ideas/edit', {
                idea: idea
            });
        });

});

app.get('/about', (req, res) => {
    res.render('about');
});

//process form
app.post('/ideas', (req, res) => {
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
                res.redirect('/ideas');
            })
    }

});


const port = 3000;

app.listen(port, () => {
    console.log(`Server Started on port ${port}`);
});