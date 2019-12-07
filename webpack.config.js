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
  rules: [
    {
      test: /\.css$/,
      include: path.join(__dirname, 'src/components'),
      use: [
        'style-loader',
        {
          loader: 'typings-for-css-modules-loader',
          options: {
            modules: true,
            namedExport: true
          }
        }
      ]
    }
  ]
};
