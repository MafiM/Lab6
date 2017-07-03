var express = require('express')
var fs = require('fs')
var path = require('path');
var validator = require('express-validator')
var bodyParser = require('body-parser');
var urlencoder = bodyParser.urlencoded({extended : true})

var app = express();

app.use(urlencoder)
app.use(validator())
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('index.ejs', {title : 'NewLetter Subscription'})
  res.end()
});
app.route('/newsletter')
  .get(function(req, res) {
    res.render('newsletter.ejs', {title : 'NewLetter Subscription'})
    res.end()
  })
  .post((req, res, next) => {   
    req.assert('email', 'Please enter a valid email.').notEmpty().isEmail()
    var e = req.validationErrors();
    if (e){
      console.log(e)
      res.render('error.ejs', {message : e, error : e})
      res.end()
    } else {
      fs.appendFile('subscribers.txt', req.body.email+'\n' , (err) => {
        if (err) throw err;
        console.log('The data was appended to file!');
        res.writeHead(302, {'Location' : path.join(__dirname, 'thankyou.ejs')})
        res.render('thankyou.ejs', {title : 'Thank you', email : req.body.email})     
      });
    }    
  });
app.listen(2000)