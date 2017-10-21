const express = require('express');
const exphbs = require('express-handlebars');
const hbs = require('hbs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

//Map global promise -get rid of warning
mongoose.Promise = global.Promise;

//connect to mongoose
mongoose.connect('mongodb://localhost/webjob-dev', {
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


//add idea form
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
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
        res.send('Passed');
    }

});


const port = 5000;

app.listen(port, () => {
    console.log(`Server Started on port ${port}`);
});