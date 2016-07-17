activitiesData = undefined
indexDB = db.open(
  server: 'strava_mass'
  schema:
    activities:
      key:
        keyPath: 'id'
)
baseUrl = '//www.strava.com/api'
resourceUrl = '/activities'

_getEndpointUrl = (resourceUrl) ->
  accessToken = Cookies.get('access_token')
  params = []
  script = document.createElement('script')

  if !_.isEmpty(accessToken)
    paramsData =
      access_token: accessToken
      callback: 'loadApiData'
    for data of paramsData
      params.push("#{data}=#{paramsData[data]}")
    script.src = baseUrl + resourceUrl + '?' + params.join('&')
    document.head.appendChild script

loadData = (jsonpData) ->
  activitiesData = jsonpData

  requestDB = indexedDB.open(dbName)

  requestDB.onerror = (event) ->
    console.log 'Database error: ' + event.target.errorCode

  requestDB.onupgradeneeded = (event) ->
    db = event.target.result
    objStore = db.createObjectStore('activities', {keyPath: 'id'})
    objStore.transaction.oncomplete = (event) ->
      activitiesObjectStore = db.transaction('activities', 'readwrite').objectStore('activities')
      for i of activitiesData
        activitiesObjectStore.add activitiesData[i]

indexDB.then (s) ->
  server = s
  server.activities.query().all().execute().then (activities) ->
    data = _.map activities, (activity) ->
      activity.start_date_local = moment(activity.start_date_local).format('MMM Do YYYY')
      {
        id: activity.id
        values: _.pick activity, ['name', 'start_date_local', 'commute']
      }
    editableGrid = new EditableGrid('activitiesJsData', {})
    metadata =
      [
        {
          name: 'name'
          label: 'Name'
          datatype: 'string'
          editable: false
        }
        {
          name: 'start_date_local'
          label: 'Date'
          datatype: 'string'
          editable: false
        }
        {
          name: 'commute'
          label: 'Commute'
          datatype: 'string'
          editable: false
        }
      ]
    editableGrid.load
      metadata: metadata
      data: data
    editableGrid.renderGrid 'tablecontent', 'testgrid'
