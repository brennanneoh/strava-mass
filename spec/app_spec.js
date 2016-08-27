const request = require('supertest')
const app     = require('../app').app

describe('app', function () {
  it('should set the view engine to pug', function () {
    expect(app.get('view engine')).toEqual('pug');
  });

  it('should use cookieParser', function (done) {
    app.get('/cookie', function(req, res) {
      res.cookie('cookie', 'hello');
      res.send();
    });

    request(app).get('/cookie')
      .expect('set-cookie', 'cookie=hello; Path=/')
      .end(function (err, res) {
        if (err) { done.fail(err); } else { done(); }
      });
  });

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
