baseUrl        = '//www.strava.com/api/v3'
resourceUrl    = '/activities'
activitiesData = undefined

indexDB = db.open
  server: 'strava_mass'
  schema:
    activities:
      key:
        keyPath: 'id'


_getEndpointUrl = (resourceUrl) ->
  accessToken = Cookies.get 'access_token'
  params = []
  script = document.createElement 'script'

  if !_.isEmpty(accessToken)
    paramsData =
      access_token: accessToken
      callback: 'loadFromStavaData'
    for data of paramsData
      params.push "#{data}=#{paramsData[data]}"
    script.src = baseUrl + resourceUrl + '?' + params.join '&'
    document.head.appendChild script

_buildMetadata = (name, label, datatype, editable) ->
  { name: name, label: label, datatype: datatype, editable: editable }

loadFromStravaData = (activitiesData) ->
  indexDB.then (server) ->
    activitesData.forEach (acvtivity) ->
      server.activities.add activity

_loadGrid = (data) ->
    editableGrid = new EditableGrid 'activitiesJsData', {}
    editableGrid.modelChanged = (rowIndex, columnIndex, oldValue, newValue, row) ->
      console.log [rowIndex, columnIndex, oldValue, newValue, row]
    metadata =
      [
        { name: 'name', label: 'Name', datatype: 'string', editable: true }
        { name: 'start_date_local', label: 'Date', datatype: 'string', editable: false }
        { name: 'start_time_local', label: 'Time', datatype: 'string', editable: false }
        { name: 'commute', label: 'Commute', datatype: 'boolean', editable: true }
      ]
    editableGrid.load
      metadata: metadata
      data: data
    editableGrid.renderGrid 'tablecontent', 'testgrid'
    window.editableGrid = editableGrid

indexDB.then (server) ->
  server.activities.query().all().execute().then (activities) ->
    data = _.map activities, (activity) ->
      activity.start_time_local = moment(activity.start_date_local).format 'h:mm:ss a'
      activity.start_date_local = moment(activity.start_date_local).format 'MMM Do YYYY'
      {
        id: activity.EditableGrid
        values: _.pick activity, ['name', 'start_date_local', 'start_time_local', 'commute']
      }

    _loadGrid data
