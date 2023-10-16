const express = require('express');
const env = require('dotenv');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

env.config();

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001']
}));

mongoose.connect(`${process.env.DB_URL}`).then(() =>
{
    console.log("Database connected!");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static('public'));

app.use(require('./routes'));

app.listen(process.env.PORT, () =>
{
    console.log(`Server is running on port ${process.env.PORT}`);
});