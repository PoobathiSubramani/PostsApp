const express = require('express');

const expressApp = express();
const bodyParser = require("body-parser");

const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');

//dbname - node-angular //can be user defined as well
mongoose.connect("mongodb+srv://dbuser:dbpwd09@boomongocluster-rcqr2.azure.mongodb.net/node-angular?retryWrites=true&w=majority")
  .then (() => {
    console.log('connected to db!');
  })
  .catch(() => {
    console.log('connection failed!');
  })


//below are the usage of middleware. the same expressApp used to write on console as well as to send response
/*
expressApp.use ((req, res, next) => {
  console.log('i\'m using express app');
  next();
})
*/

expressApp.use(bodyParser.json());

expressApp.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); //this is to avoid cross-origin script issue
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS");
  next();
})

//the below will send the urls start with '/api/posts' to the postsRoute
expressApp.use('/api/posts',postsRoutes); //this is to make node aware of the postsRoute.

module.exports = expressApp;
