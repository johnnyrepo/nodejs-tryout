const express = require('express');
const bodyParser = require('body-parser');
const locationRoutes = require('./routes/location');

const app = express();

// Body-Parser middleware
app.use(bodyParser.json());

// CORS headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Routes middleware
app.use(locationRoutes);

app.listen(3000);