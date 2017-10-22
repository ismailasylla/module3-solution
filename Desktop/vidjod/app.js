const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
const hbs = require('hbs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session')

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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Method override Middleware
app.use(methodOverride('_method'));

//Express Session Middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(flash());

//Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});


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
                req.flash('success_msg', 'New Note Added');
                res.redirect('/ideas');
            })
    }

});

//Edit form process and updates
app.put('/ideas/:id', (req, res) => {
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
app.delete('/ideas/:id', (req, res) => {
    Idea.remove({ _id: req.params.id })
        .then(() => {
            req.flash('success_msg', 'Idea removed');
            res.redirect('/ideas');
        });
});


const port = 3000;

app.listen(port, () => {
    console.log(`Server Started on port ${port}`);
});