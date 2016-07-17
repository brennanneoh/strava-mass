require('dotenv').config()
express = require 'express'
cookieParser = require 'cookie-parser'

coffee = require 'coffee-script'
path = require 'path'
fs = require('fs')
mkdirp = require('mkdirp')
url = require 'url'

app = express()

credentials =
  clientID: process.env.STRAVA_CLIENT_ID
  clientSecret: process.env.STRAVA_CLIENT_SECRET
  site: 'https://www.strava.com'
oauth2 = require('simple-oauth2')(credentials)
authUri = oauth2.authCode.authorizeURL(redirect_uri: 'http://localhost:3000/callback')

app.set 'view engine', 'pug'

app.use cookieParser()
app.use (req, res, next) ->
  options =
    src: 'src'
    dest: 'public'
  destRe = new RegExp(options.dest, 'i')
  return next() if not destRe.test(req.url)
  coffeePath = req.url.replace(/\.js$/i, '.coffee')
                      .replace(new RegExp(options.dest, 'i'), options.src)
  baseDir = process.cwd()
  srcPath = "#{baseDir}#{coffeePath}"
  destPath = "#{baseDir}#{req.url}"

  fs.readFile srcPath, 'utf8', (err, data) ->
    return next(err) if err
    compiled = coffee.compile data
    mkdirp path.dirname(destPath)
    fs.writeFile destPath, compiled, 'utf8', (err) ->
      return next(err) if err
      next()

app.use '/public', express.static('public')
app.use '/vendor', express.static('bower_components')

# TODO: test #1
app.get '/', (req, res) ->
  res.render 'index', authUri: authUri

# TODO: test #2
app.get '/callback', (req, res) ->
  tokenConfig =
    code: req.query.code
    redirect_uri: 'http://localhost:3000/callback'
  oauth2.authCode.getToken(tokenConfig).then (result) ->
    token = oauth2.accessToken.create result
    console.log 'cookie!'
    res.cookie 'access_token', token.token.access_token
    res.redirect 'http://localhost:3000/activities'

app.get '/activities', (req, res) ->
  res.render 'activities'

app.listen 3000, ->
  console.log 'Listening on port 3000'
