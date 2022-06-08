const express = require('express');
const ejs = require('ejs');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const stripeKey = 'sk_test_51L5wlbFQq2QbDoZ4yeL0u2b7AaTjzbarfJSQrsYo1rAEtgpLWx886tS7jTMOZcqkDViFC3jr8y7ufgKOX434Syw500tLQ3IZiK'
const striplePublicKey = 'pk_test_51L5wlbFQq2QbDoZ49e5JcGhq8BBna4OS9PJLKWhfmy5tyCJ7OY3mMgQXeaN0uy93TmcHQAIH40eV3QyTgNAL0IlG00NqvLdeiF'
const MongoDBURI = process.env.MONGO_URI || 'mongodb://localhost/login';
const fs = require('fs')

mongoose.connect(MongoDBURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
});

app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.get('/store',function(req,res){
  fs.readFile('items.json', function(error,data){
    if(error){
      res.status(500).end()
    }else{
      res.render('store.ejs',{
        striplePublicKey: striplePublicKey,
        items: JSON.parse(data)


      })


    }


  })

})

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/views'));

const index = require('./routes/index');
app.use('/', index);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message);
});

// listen on port 3000
app.listen(process.env.PORT || 3000, () => {
  console.log('Express app listening on port 3000');
});