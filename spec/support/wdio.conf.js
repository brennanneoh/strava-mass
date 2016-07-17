exports.config = {
    host: '0.0.0.0',
    port: 4444,
    path: '/wd/hub',
    specs: [
        'spec/features/*.js'
    ],
    exclude: [
        // 'path/to/excluded/files'
    ],
    maxInstances: 10,
    capabilities: [{
        browserName: 'chrome'
    }],
    sync: true,
    logLevel: 'silent',
    coloredLogs: true,
    screenshotPath: './errorShots/',
    baseUrl: 'http://localhost:3000',
    waitforTimeout: 10000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
    framework: 'jasmine',
    reporters: ['spec'],
    jasmineNodeOpts: {
        defaultTimeoutInterval: 10000,
        expectationResultHandler: function(passed, assertion) {
        }
    }
}
