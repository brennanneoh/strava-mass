const baseUrl = '//www.strava.com/api/v3';
const resourceUrl = '/activities';
const gridMetadata = [
  { name: 'name', label: 'Name', datatype: 'string', editable: true },
  { name: 'start_date_local', label: 'Date', datatype: 'string', editable: false },
  { name: 'start_time_local', label: 'Time', datatype: 'string', editable: false },
  { name: 'commute', label: 'Commute', datatype: 'boolean', editable: true }
];

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
let activitiesData = null;
_getEndpointUrl = function(resourceUrl) {
  const accessToken = Cookies.get('access_token');
  let script = document.createElement('script');
  if (!_.isEmpty(accessToken)) {
    const paramsData = {
      access_token: accessToken,
      callback: 'stravaActivitiesCallback'
    };
    let params = [];
    let data = '';
    for (data in paramsData) {
      params.push(data + "=" + paramsData[data]);
    }
    script.src = baseUrl + resourceUrl + '?' + params.join('&');
    document.head.appendChild(script);
  }
};

const stravaActivitesCallback = function(activitiesData) {
  indexDB.then(function(server) {
    activitesData.forEach(function(acvtivity) {
      server.activities.add(activity);
    });
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
