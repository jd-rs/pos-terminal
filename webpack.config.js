const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const prod = process.env.NODE_ENV === 'production';
module.exports = {
  target: 'electron-renderer',
  mode: prod ? 'production' : 'development',
  entry: ['./styles.scss', './app.js'],
  output: {
    filename: prod ? 'bundle.js' : 'dist/bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          // Extract the CSS from the bundle
          MiniCssExtractPlugin.loader,
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                fiber: require('fibers'),
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: prod ? 'bundle.css' : 'dist/bundle.css',
    }),
  ],
};
