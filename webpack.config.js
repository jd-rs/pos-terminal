const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  target: 'electron-renderer',
  mode: process.env.NODE_ENV !== 'production' ? 'development' : 'production',
  entry: ['./styles.scss', './app.js'],
  output: {
    filename: 'dist/bundle.js',
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
      filename: 'dist/bundle.css',
    }),
  ],
};
