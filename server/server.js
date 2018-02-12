const mongoose=require('mongoose');
mongoose.Promise=global.Promise;
const _=require('lodash');
const express=require('express');
var app=express();

const bodyParser=require('body-parser');
app.use(bodyParser.json());

var {User}=require('./user');
const {SHA256}=require('crypto-js');
const jwt=require('jsonwebtoken');

var {authenticate}=require('./middleware/authenticate');

mongoose.connect('mongodb://localhost:27017/Users',(err,db)=> {
  if(err){
    console.log('Failed to connect');
  }
  console.log('connected to mongodb');
  //db.close();
});

app.post('/users',(req,res)=> {
  var body=_.pick(req.body,['email','password']);
  var user=new User(body);
  user.save().then(()=> {
   return user.generateAuthToken()
  }).then((token)=> {
    res.header('x-auth',token).send(user);
  }).catch((e)=> {
    res.status(400).send(e);
  });
});



app.get('/users/me',authenticate,(req,res)=> {
  res.send(req.user);
});

app.listen('3000',()=> {
  console.log('server is up on port 3000');
});
