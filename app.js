require('dotenv').config();
const credentials = {
  clientID    : process.env.STRAVA_CLIENT_ID,
  clientSecret: process.env.STRAVA_CLIENT_SECRET,
  site        : 'https://www.strava.com'
};
const express      = require('express');
const cookieParser = require('cookie-parser');
const coffee       = require('coffee-script');
const path         = require('path');
const fs           = require('fs');
const mkdirp       = require('mkdirp');
const url          = require('url');
const oauth2       = require('simple-oauth2')(credentials);
const authUri      = oauth2.authCode.authorizeURL({redirect_uri: 'http://localhost:3000/callback'});

let app = express();

app.set('view engine', 'pug');

app.use(cookieParser());
app.use('/public', express.static('public'));
app.use('/vendor', express.static('bower_components'));

app.get('/', (req, res) => res.render('index', {authUri}));

app.get('/callback', function(req, res) {
  const tokenConfig = { code: req.query.code, redirect_uri: 'http://localhost:3000/callback' };
  oauth2.authCode.getToken(tokenConfig).then(function(result) {
    const token = oauth2.accessToken.create(result);
    res.cookie('access_token', token.token.access_token);
    res.redirect('http://localhost:3000/activities');
  });
}
);

app.get('/activities', (req, res) => res.render('activities'));

if (!module.parent) {
  app.listen(3000, () => console.log('Listening on port 3000'));
}

exports.app = app;
