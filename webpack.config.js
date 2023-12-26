const path = require('path');

module.exports = {
  entry: './public/table.js',
  mode: 'development',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js'], // Add '.js' as resolvable extensions.
    modules: [path.resolve(__dirname, 'node_modules')], // Add 'node_modules' to the modules array
  },
};
