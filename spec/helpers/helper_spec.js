const jasmineConsoleReporter = require('jasmine-console-reporter');
const reporter = new jasmineConsoleReporter();

jasmine.getEnv().addReporter(reporter);
