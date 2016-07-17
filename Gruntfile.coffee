require 'coffee-script/register'

module.exports = (grunt) ->
  grunt.initConfig
    webdriver:
      test:
        configFile: 'spec/support/wdio.conf.js'

  grunt.loadNpmTasks 'grunt-webdriver'
