const request = require('supertest');
const nock    = require('nock');
const app     = require('../app').app;

describe('app', function () {
  it('should set the view engine to pug', function () {
    expect(app.get('view engine')).toEqual('pug');
  });

  describe('static files', function () {
    it('should have a `public` static mount path', function (done) {
      request(app).get('/public')
        .expect(301)
        .end(function (err, res) {
          if (err) { done.fail(err); } else { done(); }
        });
    });

    it('should have a `vendor` static mount path', function (done) {
      request(app).get('/vendor')
        .expect(301)
        .end(function (err, res) {
          if (err) { done.fail(err); } else { done(); }
        });
    });
  });

  describe('/', function () {
    it('should render the path with html', function (done) {
      request(app).get('/')
        .expect(200)
        .end(function (err, res) {
          if (err) { done.fail(err); } else {
            expect(res.header['content-type']).toEqual('text/html; charset=utf-8');
            done();
          }
        });
    });
  });

  describe('/callback', function () {
    it('should set the `access_token as a cookie and redirect to `/activities`', function (done) {
      stravaApi = nock('https://www.strava.com')
        .post('/oauth/token')
        .reply(200, {
          access_token: 'abc123'
        });

      request(app).get('/callback')
        .expect(302)
        .expect('set-cookie', 'access_token=abc123; Path=/')
        .end(function (err, res) {
          if (err) { done.fail(err); } else {
            expect(res.header['location']).toEqual('/activities')
            done();
          }
        });
    });
  });

  describe('/activities', function () {
    it('should render the path with html when the `auth_token` cookie is set', function (done) {
      request(app).get('/activities')
       .set('Cookie', ['access_token="123abc"'])
       .expect(200)
       .end(function (err, res) {
         if (err) { done.fail(err); } else {
           expect(res.header['content-type']).toEqual('text/html; charset=utf-8');
           done();
         }
      });
    });

    it('should redrect to `/` when the `auth_token` cookie is not set', function (done) {
      request(app).get('/activities')
       .expect(302)
       .end(function (err, res) {
         if (err) { done.fail(err); } else {
           expect(res.header['location']).toEqual('/')
           done();
         }
      });
    });
  });
});
