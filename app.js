var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('customerapp', ['user']);
var ObjectId = mongojs.ObjectId;

var app = express();

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// Set Stattic path
app.use(express.static(path.join(__dirname, 'public')));

// Global Vars
app.use(function(req, res, next){
  res.locals.errors = null;
  next();
})

// Express Validator Middleware
app.use(expressValidator());﻿

app.get('/',function(req, res){

  db.user.find(function (err, docs) {
     res.render('index',{
       title:"Customers",
       users: docs
     });
  })

})

app.post('/users/add', function(req, res){

  req.checkBody('first_name', 'First Name is Required').notEmpty();
  req.checkBody('last_name', 'Last Name is Required').notEmpty();
  req.checkBody('email', 'Email is Required').notEmpty();

  var errors = req.validationErrors();

  if(errors){
    res.render('index',{
      title:"Customers",
      users: users,
      errors: errors
    });
  } else {
    var newUser = {
      first_name:req.body.first_name,
      last_name:req.body.last_name,
      email:req.body.email,
    }
    db.user.insert(newUser,function(err, result){
      if(err){
        console.log(err);
      }
      ress.redirect('/');
    });
  }

});

app.delete('/users/delete/:id',function(req, res){
  db.user.remove({_id:ObjectId(req.params.id)},function(err, result){
    if(err){
      console.log(err);
    } else {
      res.redirect('/');
    }
  })
})

app.listen(3000, function(){
  console.log('Server started on Port 3000..');
})
