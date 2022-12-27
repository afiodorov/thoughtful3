const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/app.ts',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  experiments: {
    topLevelAwait: true
  },
  plugins: [
     new webpack.DefinePlugin({
       'process.env': {
         THOUGHTFUL_ENV: JSON.stringify(process.env.THOUGHTFUL_ENV),
       },
     }),
   ],
};
