import webpack from 'webpack';
import webpackConfig from './webpack.config';

webpack(webpackConfig, (err, _stats) => {
  if (err) {
    console.error(err);
  }
});
