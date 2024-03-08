const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const postCssPresetEnv = require('postcss-preset-env');
const ESLintWebpackPlugin = require('eslint-webpack-plugin');

module.exports = env => {
  const isDev = env.mode === 'development';
  const isProd = env.mode === 'production';

  return {
    mode: env.mode ?? 'development',
    entry: ['@babel/polyfill', path.resolve(__dirname, 'src', 'index.ts')],
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'script.[contenthash].js',
      clean: true,
    },
    plugins: [
      new ESLintWebpackPlugin({ extensions: 'ts' }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src', 'index.html'),
      }),
      isProd ? new MiniCssExtractPlugin({ filename: 'style.[contenthash].css' }) : false,
      isDev ? new webpack.ProgressPlugin() : false,
    ].filter(Boolean),
    module: {
      rules: [
        {
          test: /\.html$/i,
          loader: 'html-loader',
        },
        {
          test: /\.(c|sa|sc)ss$/i,
          use: [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [postCssPresetEnv],
                },
              },
            },
            'sass-loader',
          ],
        },
        {
          test: /\.woff2?$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name][ext]',
          },
        },
        {
          test: /\.(jpe?g|png|webp|gif|svg|webm)$/i,
          use: [
            {
              loader: 'image-webpack-loader',
              options: {
                mozjpeg: {
                  progressive: true,
                },
                optipng: {
                  enabled: false,
                },
                pngquant: {
                  quality: [0.65, 0.9],
                  speed: 4,
                },
                gifsicle: {
                  interlaced: false,
                },
                webp: {
                  quality: 75,
                },
              },
            },
          ],
          type: 'asset/resource',
          generator: {
            filename: 'images/[hash][ext]',
          },
        },
        {
          test: /\.json$/i,
          type: 'javascript/auto',
          use: 'json-loader',
          generator: {
            filename: 'data/[contenthash][ext]',
          },
        },
        {
          test: /\.(mp3|wav|m4a|flac|mp2|ogg|amr|m4r|aiff|ape)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'audio/[hash][ext]',
          },
        },
        {
          test: /\.(t|j)s$/i,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [['@babel/preset-env', { targets: 'defaults' }], '@babel/preset-typescript'],
            },
          },
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    devtool: isDev ? 'inline-source-map' : false,
    devServer: isDev
      ? {
          port: 3000,
          open: true,
        }
      : undefined,
  };
};
