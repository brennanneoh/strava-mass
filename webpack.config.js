const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/main.js',
  output: {
    path: __dirname + '/public/js',
    filename: 'bundle.js'
  },
  resolve: {
    modulesDirectories: ['node_modules', 'bower_components']
  },
  plugins: [
    new webpack.ResolverPlugin( new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"]) ),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ]
};
