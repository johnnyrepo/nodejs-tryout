const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Utilize EJS template engine in Express app
app.set('view engine', 'ejs');
app.set('views', 'views');

// Body-Parser middleware registered
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware to set a Response Header registered
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'text/html');
    // Call for next middleware in line
    next();
});

// Middleware to send a Response Body registered
app.use((req, res, next) => {
    const text = req.body.sometext || 'Unknown text';
    res.render('index', {
        text: text
    });
});

app.listen(3000);