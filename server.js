if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
  const User=require('./models/user')
  const Hashb=require('./models/hashud') 
  const express = require('express')
  var mongo=require('mongodb')
  const app = express()
  const bcrypt = require('bcrypt')
  var assert=require('assert');
  const mongoose=require ('mongoose')
  const passport = require('passport')
  const flash = require('express-flash')
  const session = require('express-session')
  const methodOverride = require('method-override')
  const initializePassport = require('./passport-config')
  initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
  )
  
  const users = []
  mongoose.connect('mongodb://localhost:27017/studenthash',{ useNewUrlParser: true },  { useUnifiedTopology: true });
  app.set('view-engine', 'ejs')
  app.use(express.urlencoded({ extended: false }))
  app.use(flash())
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  }))
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(methodOverride('_method'))
  
  app.get('/', checkAuthenticated, (req, res) => {
   /* Hashb.find({},function(err,hashes){
      if(err)console.warn(err);
      else
      {
    res.render('index.ejs', {
        items:hashes})      
      }
    })*/
    var resultarray=[];
    mongoose.connect("mongodb://localhost:27017/studenthash",function(err,db){
         assert.equal(null,err);
         var cursor=db.collection('shash').find();
         cursor.forEach(function(doc,err) {
              assert.equal(null,err);
              resultarray.push(doc);
         },function(){
              db.close;
              res.render('index.ejs',{items: resultarray});
         });
         },
         )

})

    /*res.render('index.ejs', { name: req.user.name })*/
  /*})*/
  
  app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
  })
  
  app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }))
  
  app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
  })
  
  app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        let user1=new User({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password
        })
        user1.save();

      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      users.push({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      })
      res.rendirect('/login')
    } catch {
      res.redirect('/register')
    }
  })
  
  app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
  })
  
  function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }
  
  app.listen(3000)