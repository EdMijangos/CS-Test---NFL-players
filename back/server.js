const express = require('express');
const mongoose = require('mongoose');
const fetch = require('node-fetch')
const Log = require('./logModel')

const app = express();
const port = process.env.PORT || 3000;

//run server with nodemon server.js on terminal while running MongoDB

//connect to the DB, this is to store the log
mongoose.Promise = Promise;
mongoose
  .connect('mongodb://localhost/logs', {useNewUrlParser: true})
  .then(()=>{
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

//initialize server
app.listen(port, ()=>{console.log(`listening on port ${port}`)});

//route to call the API
//since the server only has one function, there's no need to put this in a separate js

app.get('/api/:id', (req,res)=>{
  //saving variables for the API request
  const crimeID = req.params.id;
  let date = '';
  if (req.query.date) date = '?start_date=' + req.query.date;
  else date = '';
  const queryUrl = 'http://nflarrest.com/api/v1/crime/topPlayers/' + crimeID + date

  //request to the external API
  fetch(queryUrl)
  .then(res =>{
    if(!res.ok) throw new Error();
    return res.json();
  })
  .then(results=>{
    //making object to save the log in the DB
    const logEntry = {
    formCrimeId: crimeID,
    formCrimeDate: date,
    APIRequest: queryUrl,
    APIAnswer: results,
    infoShown: [],
    };

    for (result of results){
      logEntry.infoShown.push(result.Name)
    }

    //saving new log entry
    Log.create(logEntry)
    .then(newEntry =>{
      res.json(newEntry.APIAnswer) //takes the API's answer from the log and sends it to the front
    })
    .catch(err => res.json(err))
  })
})


module.exports = app;

