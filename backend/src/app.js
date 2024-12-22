const express = require('express');
const app = express();

require('dotenv').config();
const pool = require('./db');

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to AgriPro Backend' });
});

module.exports = app;
