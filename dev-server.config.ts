import { Configuration } from 'webpack-dev-server';

export default <Configuration>{
  host: 'localhost',
  port: 3000,
  allowedHosts: 'all',
  open: false,
  hot: true,
  static: {
    directory: './public',
    publicPath: '/',
    watch: {
      ignored: /node_modules/,
      interval: 100,
      binaryInterval: 300,
      usePolling: false,
    },
  },
  historyApiFallback: {
    // Paths with dots should still use the history fallback.
    disableDotRule: true,
    index: '/',
  },
  devMiddleware: {
    index: true,
    mimeTypes: { 'text/html': 'html' },
    publicPath: '/',
  },
};
