const webpack = require('webpack');
// const cssVariablesPlugin = require('postcss-css-variables');
// const cssVariables = require('./cssVariables');

module.exports = {
  entry: './dist/AudioRecorder.js',
  output: {
    filename: './dist/AudioRecorder.min.js',
    library: 'AudioRecorder',
    libraryTarget: 'var'
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM'
  },
  plugins: [
    ...
    new webpack.WatchIgnorePlugin([/css\.d\.ts$/])
  ],
  test: /\.css$/,
  use: [
    require.resolve('style-loader'),
    {
      loader: require.resolve('typings-for-css-modules-loader'),
      options: {
        modules: true,
        importLoaders: 1,
        localIdentName: '[name]__[local]___[hash:base64:5]',
        namedExport: true,
        camelCase: true
      },
    },
  ],
};
