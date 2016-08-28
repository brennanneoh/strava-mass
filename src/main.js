const _            = require('lodash');
const Cookie       = require('js-cookie/src/js.cookie.js');
const db           = require('db.js/src/db.js');
const moment       = require('moment');

const baseUrl       = '//www.strava.com/api/v3';
const activitiesUrl = '/activities';

const gridMetadata = [
  { name: 'name', label: 'Name', datatype: 'string', editable: true },
  { name: 'start_date_local', label: 'Date', datatype: 'string', editable: false },
  { name: 'start_time_local', label: 'Time', datatype: 'string', editable: false },
  { name: 'commute', label: 'Commute', datatype: 'boolean', editable: true }
];

let activitiesData = [];
let indexDB = db.open({
  server: 'strava_mass',
  schema: {
    activities: {
      key: {
        keyPath: 'id'
      }
    }
  }
});


_buildActivitiesUrl = function() {
  const accessToken = Cookie.get('access_token');
  if (!_.isEmpty(accessToken)) {
    const paramsData = { access_token: accessToken, callback: 'stravaActivitiesCallback' };
    let params = [];
    for (datum in paramsData) { params.push(datum + "=" + paramsData[datum]); }
    return baseUrl + activitiesUrl + '?' + params.join('&');
  }
  return undefined;
};

exports.baseUrl = baseUrl;
exports.activitiesUrl = activitiesUrl;
exports.gridMetadata = gridMetadata;
exports.activitiesData = activitiesData;
exports._buildActivitiesUrl = _buildActivitiesUrl;

const stravaActivitesCallback = function(activitiesData) {
  indexDB.then(function(server) {
    activitesData.forEach((acvtivity) => server.activities.add(activity));
  });
};

const _loadGrid = function(data) {
  let editableGrid = new EditableGrid('activitiesJsData', {});

  editableGrid.modelChanged = function(rowIndex, columnIndex, oldValue, newValue, row) {
    console.log([rowIndex, columnIndex, oldValue, newValue, row]);
  };

  editableGrid.load({
    metadata: gridMetadata,
    data: data
  });

  editableGrid.renderGrid('tablecontent', 'testgrid');
  window.editableGrid = editableGrid;
};

indexDB.then(function(server) {
  server.activities.query().all().execute().then(function(activities) {
    let data = _.map(activities, function(activity) {
      activity.start_time_local = moment(activity.start_date_local).format('h:mm:ss a');
      activity.start_date_local = moment(activity.start_date_local).format('MMM Do YYYY');
      return {
        id: activity.EditableGrid,
        values: _.pick(activity, ['name', 'start_date_local', 'start_time_local', 'commute'])
      };
    });
    _loadGrid(data);
  });
});
