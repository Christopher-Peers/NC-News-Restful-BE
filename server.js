if (!process.env.NODE_ENV) process.env.NODE_ENV = 'dev';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const config = require('./config');
const apiRouter = require('./routes/apiRouter')
const db = config.DB[process.env.NODE_ENV] || process.env.DB;
mongoose.Promise = Promise;

mongoose.connect(db, {useMongoClient: true})
  .then(() => console.log('successfully connected to', db))
  .catch(err => console.log('connection failed', err));

app.use(bodyParser.json());
app.use('/api', apiRouter)
app.use('*', (req, res, next) => {res.send('404 page not found')})

app.use((err, req, res, next) => {
  
  switch(err.name) {
    case 'castError':
    res.status(404).send({message: `The ID '${err.value}' does not exist in the database.`})
    break;
    case 'invalidId':
    res.status(400).send({message: `The ID '${err.value}' is not a valid mongoose object ID`});
    break;
    case 'invalidDirection':
    res.status(400).send({message: `The query '${err.value}' is invalid. Only '?vote=up' or '?vote=down' are acceptable.`})
    break;
    case 'invalidQuery':
    res.status(400).send({message: `The query string '${err.value}' is not valid please use the keyword 'vote'.`})
    break;
    case 'invalidTopic':
    res.status(404).send({message: `The topic '${err.value}' does not exist in the database.`});
    break;
    case 'invalidComment':
    res.status(400).send({message: `The attempted comment posting's body was either not passed or an empty string`});
    break;
    case 'noComment':
    res.status(404).send({message: `The comment ID '${err.value}' does not exist in the database. Unable to delete.`});
    break;
    default:
    res.status(500).send({message: `Some kind of unprocessable error occured`})
  }

  next()
})


module.exports = app;
