const _    = require('lodash');
const main = require('./main.js');

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

  describe('activitiesData', function() {
    it('should be set to an empty array', function() {
      expect(main.activitiesData).toEqual([]);
    });
  });
});
