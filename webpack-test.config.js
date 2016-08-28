const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/main_spec.js',
  output: {
    path: __dirname + '/public/js',
    filename: 'bundle.test.js'
  },
  resolve: {
    modulesDirectories: ['node_modules', 'bower_components']
  },
  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(false)
    }),
    new webpack.ResolverPlugin( new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"]) ),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ]
};
