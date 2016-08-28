const _      = require('lodash');
const Cookie = require('js-cookie/src/js.cookie.js');
const main   = require('./main.js');

describe('main', function() {
  describe('baseUrl', function() {
    it('should be set to the URL for Strava API v3', function() {
      expect(main.baseUrl).toEqual('//www.strava.com/api/v3');
    });
  });

  describe('activitiesUrl', function() {
    it('should be set to the path `/activities`', function() {
      expect(main.activitiesUrl).toEqual('/activities');
    });
  });

  describe('gridMetadata', function() {
    it('should have `name` metadata for the editableGrid', function() {
      expect(_.map(main.gridMetadata, function(datum) { return datum.name })).toEqual(['name', 'start_date_local', 'start_time_local', 'commute']);
    });
    it('should have `label` metadata for the editableGrid', function() {
      expect(_.map(main.gridMetadata, function(datum) { return datum.label })).toEqual(['Name', 'Date', 'Time', 'Commute']);
    });
  });

  describe('indexDB', function() {
    it('should be set to an instance of db.js', function(done) {
      main.indexDB.then(function(server) {
        expect(server).not.toBe(undefined);
        done();
      });
    });

    it('should have activities', function(done) {
      main.indexDB.then(function(server) {
        expect(server.activities).toEqual(jasmine.any(Object));
        done();
      });
    });
  });

  describe('_buildActivitiesUrl', function() {
    describe('whem access_token is set in cookie', function() {
      beforeEach(function() {
        spyOn(Cookie, 'get').and.returnValue('efg456');
      });

      it('should build the activities URL', function() {
        expect(main._buildActivitiesUrl()).toEqual('//www.strava.com/api/v3/activities?access_token=efg456&callback=stravaActivitiesCallback');
      });
    });

    describe('whem access_token is not set', function() {
      beforeEach(function() {
        spyOn(Cookie, 'get');
      });

      it('should return `null`', function() {
        expect(main._buildActivitiesUrl()).toEqual(null);
      });
    });
  });

  describe('stravaActivitesCallback', function() {
    const activitiesData = [
      { id: 1, name: 'Cycling' },
      { id: 2, name: 'Running' },
      { id: 3, name: 'Swimming' }
    ];

    beforeEach(function() {
      main.indexDB.then(function(server) {
        server.activities.clear().then(function() {
          console.log('`activities` store cleared');
        });
      });
      main.stravaActivitiesCallback(activitiesData);
    });

    it('should load the `activities` indexedDB store with activities data', function(done) {
      main.indexDB.then(function(server) {
        server.activities.query().all().execute().then(function(results) {
          expect(results).toEqual(activitiesData);
          done();
        });
      });
    });
  });
});
