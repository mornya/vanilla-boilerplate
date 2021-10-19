import autoprefixer from 'autoprefixer';
import fs from 'fs';
import fibers from 'fibers';
import path from 'path';
import postcssFlexbugsFixes from 'postcss-flexbugs-fixes';
import { Configuration } from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction;
const appPath = (...paths: string[]) => path.resolve(__dirname, ...paths); // 절대경로 생성

// Lintest configuration (bypass if not installed)
const lintestInfoFilename = './node_modules/.cache/lintest/info.json';
const lintestInfoJson = fs.existsSync(lintestInfoFilename) ? require(lintestInfoFilename) : null;

export default <Configuration>{
  mode: process.env.NODE_ENV ?? 'development',
  target: 'web',
  cache: isDevelopment,
  stats: 'errors-warnings',
  entry: [
    // 엔트리포인트 지정
    './src',
  ],
  output: {
    path: appPath('dist'),
    publicPath: '/',
    filename: 'index.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [appPath('src'), appPath('node_modules')],
    alias: {
      '~': appPath(), // root
      '@': appPath('src'), // root/src
    },
  },
  module: {
    rules: [
      {
        // TypeScript source files
        test: /\.([tj]s)$/,
        include: appPath('src'),
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: appPath('tsconfig.json'),
              transpileOnly: true, // ForkTsCheckWebpackPlugin 사용하므로 타입체크용도로만 사용
              logLevel: 'warn',
              silent: true,
              colors: true,
            },
          },
        ],
      },
      // Styles (scss/css)
      {
        test: /\.s?css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              // 다른 옵션(modules 등)은 절대 넣지 말 것!
              importLoaders: 1,
              sourceMap: !isProduction,
            },
          },
          // postcss
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: !isProduction,
              postcssOptions: {
                plugins: [postcssFlexbugsFixes, autoprefixer({ flexbox: 'no-2009' })],
              },
            },
          },
          // resolves import url
          {
            loader: 'resolve-url-loader',
            options: {
              sourceMap: !isProduction,
              removeCR: true,
              debug: false,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true, // resolve-url-loader를 위해 항상 true로 설정
              sassOptions: {
                fiber: fibers,
                includePaths: [appPath('src'), appPath('node_modules')],
                indentedSyntax: false, // scss must disabled
                sourceComments: isDevelopment,
              },
            },
          },
        ],
      },
      // Images
      {
        test: /\.(bmp|gif|jpe?g|png|tiff?|ico|webp)(\?.*)?$/,
        type: 'asset/resource',
        dependency: { not: ['url'] },
        generator: {
          filename: 'images/[fullhash][ext][query]',
        },
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),

    isProduction &&
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public',
          to: '[name][ext]',
          context: appPath(),
          force: true,
        },
      ],
      options: {
        concurrency: 100,
      },
    }),

    // ForkTsCheckerWebpackPlugin
    new ForkTsCheckerWebpackPlugin({
      async: true,
      typescript: {
        enabled: true,
        configFile: `${__dirname}/tsconfig.json`,
      },
      eslint: {
        enabled: !!lintestInfoJson,
        files: `${__dirname}/src/**/*.{ts,js}`,
        options: lintestInfoJson?.eslintOptions ?? {},
      },
    }),
  ].filter(Boolean),
};
